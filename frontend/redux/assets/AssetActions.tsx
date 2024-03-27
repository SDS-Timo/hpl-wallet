/* eslint-disable no-empty */
import { Actor, ActorSubclass } from "@dfinity/agent";
import store from "@redux/Store";
import { SnsToken, Token, TokenSubAccount } from "@redux/models/TokenModels";
import { IcrcAccount, IcrcIndexCanister, IcrcLedgerCanister, IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import {
  formatIcpTransaccion,
  getSubAccountArray,
  getMetadataInfo,
  formatckBTCTransaccion,
  getUSDfromToken,
  hexToUint8Array,
  hexToNumber,
  formatHPLSubaccounts,
  formatFtInfo,
  formatVirtualAccountInfo,
  formatAccountInfo,
} from "@/utils";
import {
  setAssets,
  setTransactions,
  setTokenMarket,
  setICPSubaccounts,
  setHPLSubAccounts,
  setHPLAssets,
  setHPLSelectedSub,
  setAcordeonAssetIdx,
  setnHpl,
  setHPLVTsData,
  setHPLAssetsData,
  setHPLSubsData,
  setOwnerId,
} from "./AssetReducer";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Asset, HplContact, HplRemote, ICPSubAccount, ResQueryState, SubAccount } from "@redux/models/AccountModels";
import { Principal } from "@dfinity/principal";
import { AccountDefaultEnum } from "@/const";
import bigInt from "big-integer";
import { AccountType, AssetId, SubId, VirId } from "@research-ag/hpl-client/dist/candid/ledger";
import { _SERVICE as IngressActor } from "@candid/HPL/service.did";
import { _SERVICE as OwnersActor } from "@candid/Owners/service.did";
import { _SERVICE as HplMintActor } from "@candid/HplMint/service.did";
import { idlFactory as HplMintIDLFactory } from "@candid/HplMint/candid.did";
import { setHplContacts } from "@redux/contacts/ContactsReducer";
import { SupportedStandardEnum } from "@/@types/icrc";
import { getETHRate, getTokensFromMarket } from "@/utils/market";
import { GetAllTransactionsICPParams, UpdateAllBalances } from "@/@types/assets";

/**
 * This function updates the balances for all provided tokens and their subaccounts, based on the market price and the account balance.
 *
 * @param params An object containing parameters for the update process.
 * @returns An object containing updated `newAssetsUpload` and `tokens` arrays.
 */
export const updateAllBalances: UpdateAllBalances = async (params) => {
  const { myAgent = store.getState().auth.userAgent, tokens, basicSearch, fromLogin } = params;

  const tokenMarkets = await getTokensFromMarket();

  const ETHRate = await getETHRate();
  if (ETHRate) tokenMarkets.push(ETHRate);
  store.dispatch(setTokenMarket(tokenMarkets));

  const auxTokens = [...tokens].sort((a, b) => a.id_number - b.id_number);
  const myPrincipal = store.getState().auth.userPrincipal;

  if (!myPrincipal) return;

  const tokensAseets = await Promise.all(
    auxTokens.map(async (currentToken, idNum) => {
      try {
        const { balance, metadata, transactionFee } = IcrcLedgerCanister.create({
          agent: myAgent,
          canisterId: Principal.fromText(currentToken.address),
        });

        const [myMetadata, myTransactionFee] = await Promise.all([
          metadata({ certified: false }),
          transactionFee({ certified: false }),
        ]);

        const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);

        const assetMarket = tokenMarkets.find((tokenMarket) => tokenMarket.symbol === symbol);
        const subAccList: SubAccount[] = [];
        const userSubAcc: TokenSubAccount[] = [];
        let subAccts: { saAsset: SubAccount; saToken: TokenSubAccount }[] = [];

        // Basic Serach look into first 1000 subaccount under the 5 consecutive zeros logic
        // It iterates geting amount of each subaccount
        // If 5 consecutive subaccounts balances are zero, iteration stops
        if (basicSearch) {
          let zeros = 0;
          for (let basicSearchIndex = 0; basicSearchIndex < 1000; basicSearchIndex++) {
            const myBalance = await balance({
              owner: myPrincipal,
              subaccount: new Uint8Array(getSubAccountArray(basicSearchIndex)),
              certified: false,
            });

            if (Number(myBalance) > 0 || basicSearchIndex === 0) {
              zeros = 0;

              subAccList.push({
                name: basicSearchIndex === 0 ? AccountDefaultEnum.Values.Default : "-",
                sub_account_id: `0x${basicSearchIndex.toString(16)}`,
                address: myPrincipal?.toString(),
                amount: myBalance.toString(),
                currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
                transaction_fee: myTransactionFee.toString(),
                decimal: decimals,
                symbol: currentToken.symbol,
              });

              userSubAcc.push({
                name: basicSearchIndex === 0 ? AccountDefaultEnum.Values.Default : "-",
                numb: `0x${basicSearchIndex.toString(16)}`,
                amount: myBalance.toString(),
                currency_amount: assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0",
              });
            } else zeros++;

            if (zeros === 5) break;
          }
        } else {
          // Non Basic Serach first look into storaged subaccounts
          // Then search into first 1000 subaccount that are not looked yet under the 5 consecutive zeros logic
          // It iterates geting amount of each subaccount
          // If 5 consecutive subaccounts balances are zero, iteration stops
          const idsPushed: string[] = [];
          subAccts = await Promise.all(
            currentToken.subAccounts.map(async (sa) => {
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(hexToUint8Array(sa.numb)),
                certified: false,
              });
              idsPushed.push(sa.numb);
              const amnt = myBalance.toString();
              const crncyAmnt = assetMarket ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals) : "0";
              const saAsset: SubAccount = {
                name: sa.name,
                sub_account_id: sa.numb,
                address: myPrincipal?.toString(),
                amount: amnt,
                currency_amount: crncyAmnt,
                transaction_fee: myTransactionFee.toString(),
                decimal: decimals,
                symbol: currentToken.symbol,
              };
              const saToken: TokenSubAccount = {
                name: sa.name,
                numb: sa.numb,
                amount: amnt,
                currency_amount: crncyAmnt,
              };

              return { saAsset, saToken };
            }),
          );

          let zeros = 0;
          for (let i = 0; i < 1000; i++) {
            if (!idsPushed.includes(`0x${i.toString(16)}`)) {
              const myBalance = await balance({
                owner: myPrincipal,
                subaccount: new Uint8Array(getSubAccountArray(i)),
                certified: false,
              });
              if (Number(myBalance) > 0 || i === 0) {
                zeros = 0;
                const amnt = myBalance.toString();
                const crncyAmnt = assetMarket
                  ? getUSDfromToken(myBalance.toString(), assetMarket.price, decimals)
                  : "0";
                const saAsset: SubAccount = {
                  name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                  sub_account_id: `0x${i.toString(16)}`,
                  address: myPrincipal?.toString(),
                  amount: amnt,
                  currency_amount: crncyAmnt,
                  transaction_fee: myTransactionFee.toString(),
                  decimal: decimals,
                  symbol: currentToken.symbol,
                };
                const saToken: TokenSubAccount = {
                  name: i === 0 ? AccountDefaultEnum.Values.Default : "-",
                  numb: `0x${i.toString(16)}`,
                  amount: amnt,
                  currency_amount: crncyAmnt,
                };
                subAccts.push({ saAsset, saToken });
              } else zeros++;

              if (zeros === 5) break;
            }
          }
        }

        const saTokens = subAccts.map((saT) => saT.saToken);
        const saAssets = subAccts.map((saA) => saA.saAsset);

        const newToken: Token = {
          ...currentToken,
          logo: logo !== "" ? logo : currentToken.logo && currentToken.logo !== "" ? currentToken.logo : "",
          tokenName: name,
          tokenSymbol: symbol,
          decimal: decimals.toFixed(0),
          subAccounts: (basicSearch ? userSubAcc : saTokens).sort((a, b) => {
            return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
          }),
          supportedStandards: currentToken.supportedStandards,
        };

        const newAsset: Asset = {
          symbol: currentToken.symbol,
          name: currentToken.name,
          address: currentToken.address,
          index: currentToken.index,
          subAccounts: (basicSearch ? subAccList : saAssets).sort((a, b) => {
            return hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0;
          }),
          sort_index: idNum,
          decimal: decimals.toFixed(0),
          shortDecimal: currentToken.shortDecimal || decimals.toFixed(0),
          tokenName: name,
          tokenSymbol: symbol,
          logo: logo !== "" ? logo : currentToken.logo && currentToken.logo !== "" ? currentToken.logo : "",
          supportedStandards: currentToken.supportedStandards,
        };
        return { newToken, newAsset };
      } catch (e) {
        const newAsset: Asset = {
          symbol: currentToken.symbol,
          name: currentToken.name,
          address: currentToken.address,
          index: currentToken.index,
          subAccounts: [
            {
              name: AccountDefaultEnum.Values.Default,
              sub_account_id: "0x0",
              address: myPrincipal?.toString(),
              amount: "0",
              currency_amount: "0",
              transaction_fee: "0",
              decimal: 8,
              symbol: currentToken.symbol,
            },
          ],
          decimal: "8",
          shortDecimal: "8",
          sort_index: 99999 + idNum,
          tokenName: currentToken.name,
          tokenSymbol: currentToken.symbol,
          supportedStandards: currentToken.supportedStandards,
        };
        return { newToken: currentToken, newAsset };
      }
    }),
  );

  const newAssetsUpload = tokensAseets
    .map((tA) => {
      return tA.newAsset;
    })
    .sort((a, b) => {
      return a.sort_index - b.sort_index;
    });
  const newTokensUpload = tokensAseets
    .map((tA) => {
      return tA.newToken;
    })
    .sort((a, b) => {
      return a.id_number - b.id_number;
    });
  store.dispatch(setAssets(newAssetsUpload));

  if (fromLogin) {
    newAssetsUpload.length > 0 && store.dispatch(setAcordeonAssetIdx([newAssetsUpload[0].tokenSymbol]));
  }

  const icpAsset = newAssetsUpload.find((ast) => ast.tokenSymbol === "ICP");
  if (icpAsset) {
    const sub: ICPSubAccount[] = [];
    icpAsset.subAccounts.map((saICP) => {
      let subacc: SubAccountNNS | undefined = undefined;
      try {
        subacc = SubAccountNNS.fromBytes(hexToUint8Array(saICP.sub_account_id)) as SubAccountNNS;
      } catch {
        subacc = undefined;
      }
      sub.push({
        legacy: AccountIdentifier.fromPrincipal({
          principal: myPrincipal,
          subAccount: subacc,
        }).toHex(),
        sub_account_id: saICP.sub_account_id,
      });
    });

    store.dispatch(setICPSubaccounts(sub));
  }

  return {
    newAssetsUpload,
    tokens: newTokensUpload.sort((a, b) => {
      return a.id_number - b.id_number;
    }),
  };
};

export const updateHPLBalances = async (
  actor: ActorSubclass<IngressActor>,
  owner: ActorSubclass<OwnersActor>,
  contacts: HplContact[],
  principal: string,
  fromWorker?: boolean,
  updateInfo?: boolean,
  nLocalData?: {
    nAccounts: string;
    nVirtualAccounts: string;
    nFtAssets: string;
  },
) => {
  // Get amounts nAccounts, nVirtualAccounts, nFtAssets
  const nLocalHpl = {
    nAccounts: nLocalData ? nLocalData.nAccounts : "0",
    nVirtualAccounts: nLocalData ? nLocalData.nVirtualAccounts : "0",
    nFtAssets: nLocalData ? nLocalData.nFtAssets : "0",
  };
  const nHpl = store.getState().asset.nHpl;
  const nInfo = {
    nAccounts: BigInt(nLocalHpl.nAccounts || nHpl.nAccounts || 0),
    nVirtualAccounts: BigInt(nLocalHpl.nVirtualAccounts || nHpl.nVirtualAccounts || 0),
    nFtAssets: BigInt(nLocalHpl.nFtAssets || nHpl.nFtAssets || 0),
  };
  if (!fromWorker || updateInfo) {
    const nData = {
      nAccounts: "0",
      nVirtualAccounts: "0",
      nFtAssets: "0",
    };
    try {
      const nAccounts = await actor.nAccounts();
      nData.nAccounts = nAccounts.toString();
      nInfo.nAccounts = nAccounts;
    } catch (e) {
      console.log("err-nHpl", e);
    }
    try {
      const nVirtualAccounts = await actor.nVirtualAccounts();
      nData.nVirtualAccounts = nVirtualAccounts.toString();
      nInfo.nVirtualAccounts = nVirtualAccounts;
    } catch (e) {
      console.log("err-nHpl", e);
    }
    try {
      const nFtAssets = await actor.nFtAssets();
      nData.nFtAssets = nFtAssets.toString();
      nInfo.nFtAssets = nFtAssets;
    } catch (e) {
      console.log("err-nHpl", e);
    }

    localStorage.setItem("nhpl-" + principal, JSON.stringify(nData));
    store.dispatch(setnHpl(nData));
  }

  let subAccInfo: Array<[SubId, AccountType]> | undefined = undefined;
  if (nInfo.nAccounts > BigInt(nLocalHpl.nAccounts) || (updateInfo && nInfo.nAccounts !== BigInt(0))) {
    try {
      subAccInfo = await actor.accountInfo({ idRange: [BigInt(0), [nInfo.nAccounts - BigInt(1)]] });
    } catch (e) {
      console.log("errAccountInfo", e);
    }
  }

  let ftInfo:
    | Array<
        [
          AssetId,
          {
            controller: Principal;
            decimals: number;
            description: string;
          },
        ]
      >
    | undefined = undefined;
  if (nInfo.nFtAssets > BigInt(nLocalHpl.nFtAssets) || (updateInfo && nInfo.nFtAssets !== BigInt(0))) {
    try {
      ftInfo = await actor.ftInfo({ idRange: [BigInt(0), [nInfo.nFtAssets - BigInt(1)]] });
    } catch (e) {
      console.log("errFtInfor", e);
    }
  }

  let vtData = store.getState().asset.hplVTsData;
  let vtInfo: Array<[VirId, [AccountType, Principal]]> | undefined = undefined;
  if (
    nInfo.nVirtualAccounts > BigInt(nLocalHpl.nVirtualAccounts) ||
    ((updateInfo || vtData.length === 0) && nInfo.nVirtualAccounts !== BigInt(0))
  ) {
    try {
      vtInfo = await actor.virtualAccountInfo({ idRange: [BigInt(0), [nInfo.nVirtualAccounts - BigInt(1)]] });
    } catch (e) {
      console.log("errVirtualAccountInfo", e);
    }
  }

  const remotesToLook: { id: [Principal, bigint] }[] = [];
  contacts.map((cntc) => {
    const pncpl = Principal.fromText(cntc.principal);
    cntc.remotes.map((rmt) => {
      remotesToLook.push({ id: [pncpl, BigInt(rmt.index)] });
    });
  });

  const state: ResQueryState = { ftSupplies: [], virtualAccounts: [], accounts: [], remoteAccounts: [] };

  try {
    const auxState = await actor.state({
      ftSupplies: nInfo.nFtAssets > BigInt(0) ? [{ idRange: [BigInt(0), [nInfo.nFtAssets - BigInt(1)]] }] : [],
      virtualAccounts:
        nInfo.nVirtualAccounts > BigInt(0) ? [{ idRange: [BigInt(0), [nInfo.nVirtualAccounts - BigInt(1)]] }] : [],
      accounts: nInfo.nAccounts > BigInt(0) ? [{ idRange: [BigInt(0), [nInfo.nAccounts - BigInt(1)]] }] : [],
      remoteAccounts: remotesToLook.length > 0 ? [{ cat: remotesToLook }] : [],
    });
    state.ftSupplies = auxState.ftSupplies;
    state.virtualAccounts = auxState.virtualAccounts;
    state.accounts = auxState.accounts;
    state.remoteAccounts = auxState.remoteAccounts as any;
  } catch (e) {
    console.log("errState", e);
  }

  try {
    const ftDict = store.getState().asset.dictionaryHplFTs;
    let ftData = store.getState().asset.hplFTsData;
    if (ftInfo && ftInfo.length > 0) {
      ftData = formatFtInfo(ftInfo, ftData);
      localStorage.setItem(
        "hplFT-" + principal,
        JSON.stringify({
          ft: ftData,
        }),
      );
      store.dispatch(setHPLAssetsData(ftData));
    }
    let subData = store.getState().asset.hplSubsData;
    if (subAccInfo && subAccInfo.length > 0) {
      subData = formatAccountInfo(subAccInfo, subData);
      localStorage.setItem(
        "hplSUB-" + principal,
        JSON.stringify({
          sub: subData,
        }),
      );
      store.dispatch(setHPLSubsData(subData));
    }

    const myAgent = store.getState().auth.userAgent;

    const getMintPrinc = async () => {
      if (!vtInfo) return [];
      const auxPric: string[] = [];
      vtInfo.map((vt) => {
        auxPric.push(vt[1][1].toText());
      });

      const checkPrinc = await Promise.all(
        auxPric
          .filter((item, index) => auxPric.indexOf(item) === index)
          .map(async (vt) => {
            const canisterPrinc = vt;
            // HPL MINTER
            const mintActor = Actor.createActor<HplMintActor>(HplMintIDLFactory, {
              agent: myAgent,
              canisterId: canisterPrinc,
            });
            let isMint = false;
            try {
              isMint = await mintActor.isHplMinter();
            } catch {
              isMint = false;
            }
            if (isMint) return canisterPrinc;
          }),
      );

      return checkPrinc;
    };
    if (vtInfo && vtInfo.length > 0) {
      const mintsAll = await getMintPrinc();
      const finalMints: string[] = [];
      mintsAll.map((mnt) => {
        if (mnt) finalMints.push(mnt);
      });

      vtData = formatVirtualAccountInfo(vtInfo, vtData, finalMints);
      localStorage.setItem(
        "hplVT-" + principal,
        JSON.stringify({
          vt: vtData,
        }),
      );
      store.dispatch(setHPLVTsData(vtData));
    }

    let myOwnerId = "";
    const ownerID = await owner.lookup(Principal.fromText(principal));
    if (ownerID[0]) {
      myOwnerId = ownerID[0].toString();
      store.dispatch(setOwnerId(myOwnerId));
    }

    let adminAccountState: Array<[bigint, { ft: bigint }]> = [];
    try {
      const adminState = await actor.adminState({
        ftSupplies: [],
        virtualAccounts: [],
        accounts: [{ idRange: [BigInt(0), []] }],
        remoteAccounts: [],
      });
      adminAccountState = adminState.accounts;
    } catch (e) {
      console.log("errState", e);
    }

    const { auxSubaccounts, auxFT } = formatHPLSubaccounts(
      { ft: ftData, sub: subData, vt: vtData },
      ftDict,
      state,
      adminAccountState,
      myOwnerId,
    );
    store.dispatch(setHPLSubAccounts(auxSubaccounts));
    store.dispatch(setHPLAssets(auxFT));

    const selectedSub = store.getState().asset.selectSub;
    if (selectedSub) {
      const sel = auxSubaccounts.find((sub) => sub.sub_account_id === selectedSub.sub_account_id);
      if (sel) store.dispatch(setHPLSelectedSub(sel));
    }

    updateHplRemotes(state, contacts);

    return { subs: auxSubaccounts, fts: auxFT };
  } catch (e) {
    console.log("err", e);
  }
  return { subs: [], fts: [] };
};

export const updateHplRemotes = async (auxState: ResQueryState, contacts: HplContact[]) => {
  try {
    const updatedContacts: HplContact[] = [];
    contacts.map((hplCntc) => {
      const updatedRemotes: HplRemote[] = [];
      hplCntc.remotes.map((rmt) => {
        const rmtFounded = auxState.remoteAccounts.find((auxRmt) => {
          return hplCntc.principal === auxRmt[0][0].toText() && auxRmt[0][1] === BigInt(rmt.index);
        });
        if (rmtFounded) {
          updatedRemotes.push({
            ...rmt,
            amount: rmtFounded[1][0].ft.toString(),
            expired: Math.trunc(Number(rmtFounded[1][1].toString()) / 1000000),
          });
        } else updatedRemotes.push(rmt);
      });
      updatedContacts.push({ ...hplCntc, remotes: updatedRemotes });
    });

    store.dispatch(setHplContacts(updatedContacts));
  } catch (e) {
    console.log("contacts-catch", contacts);
    store.dispatch(setHplContacts(contacts));
    console.log("errState-rem", e);
  }
};

export const setAssetFromLocalData = (tokens: Token[], myPrincipal: string) => {
  const assets: Asset[] = [];
  tokens.map((tkn) => {
    const subAccList: SubAccount[] = [];
    tkn.subAccounts?.map((sa) => {
      subAccList.push({
        name: sa.name,
        sub_account_id: sa.numb,
        address: myPrincipal,
        amount: sa.amount || "0",
        currency_amount: sa.currency_amount || "0",
        transaction_fee: tkn.fee || "0",
        decimal: Number(tkn.decimal),
        symbol: tkn.symbol,
      });
    });

    assets.push({
      symbol: tkn.symbol,
      name: tkn.name,
      address: tkn.address,
      index: tkn.index,
      subAccounts: subAccList.sort((a, b) => {
        return hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0;
      }),
      sort_index: tkn.id_number,
      decimal: tkn.decimal,
      shortDecimal: tkn.shortDecimal || tkn.decimal,
      tokenName: tkn.tokenName,
      tokenSymbol: tkn.tokenSymbol,
      logo: tkn.logo,
      supportedStandards: tkn.supportedStandards,
    });
  });

  store.dispatch(setAssets(assets));
};

export const getAllTransactionsICP = async (params: GetAllTransactionsICPParams) => {
  const { subaccount_index, loading, isOGY } = params;

  const myPrincipal = store.getState().auth.userPrincipal;
  let subacc: SubAccountNNS | undefined = undefined;
  try {
    subacc = SubAccountNNS.fromBytes(hexToUint8Array(subaccount_index)) as SubAccountNNS;
  } catch {
    subacc = undefined;
  }

  const accountIdentifier = AccountIdentifier.fromPrincipal({
    principal: myPrincipal,
    subAccount: subacc,
  });
  try {
    const response = await fetch(
      `${isOGY ? import.meta.env.VITE_ROSETTA_URL_OGY : import.meta.env.VITE_ROSETTA_URL}/search/transactions`,
      {
        method: "POST",
        body: JSON.stringify({
          network_identifier: {
            blockchain: isOGY ? import.meta.env.VITE_NET_ID_BLOCKCHAIN_OGY : import.meta.env.VITE_NET_ID_BLOCKCHAIN,
            network: isOGY ? import.meta.env.VITE_NET_ID_NETWORK_OGY : import.meta.env.VITE_NET_ID_NETWORK,
          },
          account_identifier: {
            address: accountIdentifier.toHex(),
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    ).catch();
    if (!response.ok) throw Error(`${response.statusText}`);
    const { transactions } = await response.json();
    const transactionsInfo = transactions.map(({ transaction, block_identifier }: any) =>
      formatIcpTransaccion(accountIdentifier.toHex(), transaction, block_identifier.hash),
    );

    if (loading) {
      store.dispatch(setTransactions(transactionsInfo));
    } else {
      return transactionsInfo;
    }
  } catch (error) {
    if (!loading) {
      return [];
    }
  }
};

export const getAllTransactionsICRC1 = async (
  canister_id: any,
  subaccount_index: Uint8Array,
  loading: boolean,
  assetSymbol: string,
  canister: string,
  subNumber?: string,
) => {
  try {
    const myAgent = store.getState().auth.userAgent;
    const myPrincipal = store.getState().auth.userPrincipal;
    const canisterPrincipal = Principal.fromText(canister_id);

    const { getTransactions: ICRC1_getTransactions } = IcrcIndexCanister.create({
      agent: myAgent,
      canisterId: canisterPrincipal,
    });

    const ICRC1getTransactions = await ICRC1_getTransactions({
      account: {
        owner: myPrincipal,
        subaccount: subaccount_index,
      } as IcrcAccount,
      max_results: BigInt(100),
    });

    const transactionsInfo = ICRC1getTransactions.transactions.map(({ transaction, id }) =>
      formatckBTCTransaccion(transaction, id, myPrincipal?.toString(), assetSymbol, canister, subNumber),
    );
    if (
      loading &&
      store.getState().asset.selectedAccount?.sub_account_id === subNumber &&
      assetSymbol === store.getState().asset.selectedAsset?.tokenSymbol
    ) {
      store.dispatch(setTransactions(transactionsInfo));
      return transactionsInfo;
    } else {
      return transactionsInfo;
    }
  } catch {
    store.dispatch(setTransactions([]));
    return [];
  }
};

export const getSNSTokens = async () => {
  let tokens: SnsToken[] = [];
  for (let index = 0; index < 100; index++) {
    try {
      const response = await fetch(`https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/${index}/slow.json`);
      if (response.ok && response.status === 200) {
        const snses: SnsToken[] = await response.json();
        tokens = [...tokens, ...snses];
        if (snses.length < 10) break;
      } else {
        break;
      }
    } catch (error) {
      console.error("snses", error);
      break;
    }
  }

  const deduplicatedTokens: Token[] = [];
  const symbolsAdded: string[] = [];
  tokens.reverse().map((tkn, k) => {
    const metadata = getMetadataInfo(tkn.icrc1_metadata as IcrcTokenMetadataResponse);
    if (!symbolsAdded.includes(metadata.symbol)) {
      symbolsAdded.push(metadata.symbol);
      deduplicatedTokens.push({
        id_number: 10005 + k,
        symbol: metadata.symbol,
        name: metadata.name,
        tokenSymbol: metadata.symbol,
        tokenName: metadata.name,
        address: tkn.canister_ids.ledger_canister_id,
        index: tkn.canister_ids.index_canister_id || "",
        decimal: metadata.decimals.toString(),
        shortDecimal: metadata.decimals.toString(),
        fee: metadata.fee,
        subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
        supportedStandards: [SupportedStandardEnum.Values["ICRC-1"]],
        logo: metadata.logo !== "" ? metadata.logo : "https://3r4gx-wqaaa-aaaaq-aaaia-cai.ic0.app" + tkn.meta.logo,
      } as Token);
    }
  });
  return deduplicatedTokens.reverse();
};
