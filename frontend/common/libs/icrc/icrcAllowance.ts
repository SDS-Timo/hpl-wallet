import {
  CheckAllowanceParams,
  // HasAssetAllowanceParams,
  // HasSubAccountsParams,
  SupportedStandardEnum,
} from "@/@types/icrc";
import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
// import { AssetContact } from "@redux/models/ContactsModels";
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";
import dayjs from "dayjs";
import { ApproveParams } from "@dfinity/ledger-icrc";
import { getCanister } from "./getIcrcCanister";
import { TAllowance } from "@/@types/allowance";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { toFullDecimal, toHoleBigInt } from "@common/utils/amount";
import logger from "@common/utils/logger";
import { RetrieveSubAccountsWithAllowanceArgs } from "@/@types/contacts";

function calculateExpirationAsBigInt(
  expirationString: string | undefined,
  hasExpiration?: boolean,
): bigint | undefined {
  if (hasExpiration) {
    return undefined;
  }

  if (!expirationString) {
    return undefined;
  }

  try {
    const expirationTimestamp = dayjs.utc(expirationString).valueOf() * 1000000;
    return BigInt(expirationTimestamp);
  } catch (error) {
    logger.debug(error);
    return undefined;
  }
}

export function createApproveAllowanceParams(allowance: TAllowance): ApproveParams {
  if (!allowance?.asset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"])) {
    throw new Error("ICRC-2 not supported");
  }

  const spenderPrincipal = allowance.spender;
  const allowanceSubAccountId = allowance.subAccountId;
  const allowanceAssetDecimal = allowance.asset.decimal;
  const allowanceAmount = allowance.amount || "0";

  const owner = Principal.fromText(spenderPrincipal);
  const subAccountUint8Array = new Uint8Array(hexToUint8Array(allowanceSubAccountId));
  const amount: bigint = toHoleBigInt(allowanceAmount, Number(allowanceAssetDecimal));
  const expiration = calculateExpirationAsBigInt(allowance.expiration);
  return {
    spender: {
      owner,
      subaccount: [],
    },
    from_subaccount: subAccountUint8Array,
    amount: amount,
    expires_at: expiration,
  };
}

export async function submitAllowanceApproval(
  params: ApproveParams,
  assetAddress: string,
): Promise<bigint | undefined> {
  try {
    const canister = getCanister({ assetAddress });
    const result = await canister.approve(params);
    return result;
  } catch (error) {
    logger.debug(error);
    throw error;
  }
}

export async function getAllowanceDetails(params: CheckAllowanceParams) {
  try {
    const { spenderPrincipal, allocatorSubaccount, allocatorPrincipal, assetAddress, assetDecimal } = params;

    const userPrincipal = store.getState().auth.userPrincipal;
    const agent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText(assetAddress);
    const subAccountUint8Array = new Uint8Array(hexToUint8Array(allocatorSubaccount));

    const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
      agent,
      canisterId,
    });

    const result = await ledgerActor.icrc2_allowance({
      spender: {
        owner: spenderPrincipal ? Principal.fromText(spenderPrincipal) : userPrincipal,
        subaccount: [],
      },
      account: {
        owner: allocatorPrincipal ? Principal.fromText(allocatorPrincipal) : userPrincipal,
        subaccount: [subAccountUint8Array],
      },
    });

    const allowance = Number(result.allowance) <= 0 ? "" : toFullDecimal(result.allowance, Number(assetDecimal));
    const expires_at = result.expires_at.length <= 0 ? "" : dayjs(Number(result?.expires_at) / 1000000).format();

    return { allowance, expires_at };
  } catch (e) {
    logger.debug(e);
    return { allowance: "", expires_at: "" };
  }
}

export async function retrieveSubAccountsWithAllowance(params: RetrieveSubAccountsWithAllowanceArgs) {
  const { accountPrincipal, subAccounts, assetAddress, assetDecimal } = params;

  const subAccountsWithAllowance = await Promise.all(
    subAccounts.map(async (subAccount) => {
      const spenderSubaccount = subAccount?.subaccountId;
      const response = await getAllowanceDetails({
        allocatorSubaccount: spenderSubaccount,
        allocatorPrincipal: accountPrincipal,
        assetAddress,
        assetDecimal,
      });

      return {
        ...subAccount,
        allowance: response,
      };
    }),
  );

  return subAccountsWithAllowance;
}

// export async function retrieveAssetsWithAllowance(params: HasAssetAllowanceParams): Promise<AssetContact[] | []> {
//   const { accountPrincipal, assets } = params;

//   const supportedAssets = assets?.filter((asset) =>
//     asset.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]),
//   );

//   const noSupportedAssets = assets?.filter(
//     (asset) => !asset.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]),
//   );

//   const assetsWithAllowance = await Promise.all(
//     supportedAssets.map(async (asset) => {
//       const subAccountsWithAllowance = await retrieveSubAccountsWithAllowance({
//         accountPrincipal,
//         subAccounts: asset.subaccounts,
//         assetAddress: asset.address,
//         assetDecimal: asset.decimal,
//       });

//       return {
//         ...asset,
//         subaccounts: subAccountsWithAllowance,
//       };
//     }),
//   );

//   return [...assetsWithAllowance, ...noSupportedAssets];
// }
