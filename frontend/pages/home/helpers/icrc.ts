import { TAllowance } from "@/@types/allowance";
import { hexToUint8Array, toFullDecimal, toHoleBigInt } from "@/utils";
import { ApproveParams, IcrcLedgerCanister, TransferFromParams } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import { AssetContact, SubAccountContact } from "@redux/models/ContactsModels";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface TransferAmountParams {
  receiverPrincipal: string;
  assetAddress: string;
  transferAmount: string;
  decimal: string;
  fromSubAccount: string;
  toSubAccount: string;
}

export async function transferAmount(params: TransferAmountParams) {
  try {
    const { receiverPrincipal, transferAmount, assetAddress, decimal, fromSubAccount, toSubAccount } = params;
    console.log(params);

    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);

    const canister = IcrcLedgerCanister.create({
      agent,
      canisterId,
    });

    const amount = toHoleBigInt(transferAmount, Number(decimal));

    await canister.transfer({
      to: {
        owner: Principal.fromText(receiverPrincipal),
        subaccount: [hexToUint8Array(toSubAccount)],
      },
      amount,
      from_subaccount: hexToUint8Array(fromSubAccount),
    });
  } catch (error) {
    console.error(error);
  }
}

interface TransferFromAllowanceParams extends TransferAmountParams {
  senderPrincipal: string;
}

export async function transferFromAllowance(params: TransferFromAllowanceParams) {
  try {
    const { receiverPrincipal, senderPrincipal, assetAddress, transferAmount, decimal, fromSubAccount, toSubAccount } =
      params;

    console.log(params);

    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({
      agent,
      canisterId,
    });

    const amount = toHoleBigInt(transferAmount, Number(decimal));
    // FIXME: the sender is using the 0x0 account and not the spender_subaccount
    const transferParams: TransferFromParams = {
      // Where the allowance is created
      from: {
        owner: Principal.fromText(senderPrincipal),
        subaccount: [],
      },
      // Any persona that can receive the money
      to: {
        owner: Principal.fromText(receiverPrincipal),
        subaccount: [hexToUint8Array(toSubAccount)],
      },
      spender_subaccount: hexToUint8Array(fromSubAccount),
      amount,
    };

    console.log(transferParams);

    const response = await canister.transferFrom(transferParams);
    console.log("allowance response", response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export function generateApproveAllowance(allowance: TAllowance): ApproveParams {
  const spenderPrincipal = allowance.spender.principal;
  const allowanceSubAccountId = allowance.subAccount.sub_account_id;
  const allowanceAssetDecimal = allowance.asset.decimal;
  const allowanceAmount = allowance.amount;

  const owner = Principal.fromText(spenderPrincipal);
  const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));
  const amount: bigint = toHoleBigInt(allowanceAmount, Number(allowanceAssetDecimal));
  const expirationTimeStamp =
    !allowance.noExpire && allowance?.expiration ? dayjs.utc(allowance?.expiration).valueOf() * 1000000 : undefined;
  const expiration = expirationTimeStamp ? BigInt(expirationTimeStamp) : undefined;

  return {
    spender: {
      owner,
      subaccount: [subAccountUint8Array],
    },
    amount: amount,
    expires_at: expiration,
  };
}

export async function ICRCApprove(params: ApproveParams, assetAddress: string): Promise<bigint | undefined> {
  try {
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const result = await canister.approve(params);
    return result;
  } catch (e) {
    console.error(e);
    throw new Error("Error approving");
  }
}

export async function checkAllowanceExist(
  principal: string,
  assetAddress: string,
  allowanceSubAccountId: string,
  decimal: number,
) {
  try {
    const spenderPrincipal = store.getState().auth.userPrincipal;
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));

    const result = await canister.allowance({
      spender: {
        owner: spenderPrincipal,
        subaccount: [subAccountUint8Array],
      },
      account: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
    });

    return {
      allowance: Number(result.allowance) <= 0 ? "" : toFullDecimal(result.allowance, decimal),
      expires_at:
        result.expires_at.length <= 0 ? "" : dayjs(Number(result?.expires_at) / 1000000).format("YYYY-MM-DD HH:mm:ss"),
    };
  } catch (e) {
    console.error(e);
  }
}

export async function hasSubAccountAllowances(
  spenderPrincipal: string,
  subAccounts: SubAccountContact[],
  assetAddress: string,
  assetDecimal: string,
) {
  const newSubAccounts = [];

  for (let subAccountIndex = 0; subAccountIndex < subAccounts.length; subAccountIndex++) {
    const subAccountId = subAccounts[subAccountIndex]?.sub_account_id;
    const response = await checkAllowanceExist(spenderPrincipal, assetAddress, subAccountId, Number(assetDecimal));

    if (response?.allowance) {
      newSubAccounts.push({
        ...subAccounts[subAccountIndex],
        allowance: response,
      });
    } else {
      newSubAccounts.push(subAccounts[subAccountIndex]);
    }
  }
  return newSubAccounts;
}

export async function hasSubAccountAssetAllowances(
  spenderPrincipal: string,
  assets: AssetContact[],
): Promise<AssetContact[] | []> {
  const newAssets: AssetContact[] = [];

  for (let assetIndex = 0; assetIndex < assets.length; assetIndex++) {
    const subAccounts = assets[assetIndex].subaccounts;

    const currentAsset: AssetContact = {
      ...assets[assetIndex],
      subaccounts: [],
    };

    for (let subAccountIndex = 0; subAccountIndex < subAccounts?.length; subAccountIndex++) {
      const subAccountId = subAccounts[subAccountIndex]?.sub_account_id;
      const assetAddress = assets[assetIndex].address;
      const assetDecimal = assets[assetIndex].decimal;
      const response = await checkAllowanceExist(spenderPrincipal, assetAddress, subAccountId, Number(assetDecimal));

      if (response?.allowance) {
        currentAsset.subaccounts.push({
          ...subAccounts[subAccountIndex],
          allowance: response,
        });
      } else {
        currentAsset.subaccounts.push(subAccounts[subAccountIndex]);
      }
    }

    const assetHasAllowance = currentAsset.subaccounts.some((subaccount) => subaccount?.allowance);

    if (assetHasAllowance) {
      currentAsset.hasAllowance = true;
    }

    newAssets.push(currentAsset);
  }
  return newAssets;
}
