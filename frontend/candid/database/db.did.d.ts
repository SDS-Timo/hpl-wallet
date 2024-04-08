import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AllowanceDocument {
  id: string;
  deleted: boolean;
  asset: {
    logo: string;
    name: string;
    tokenSymbol: string;
    supportedStandards: Array<string>;
    address: string;
    tokenName: string;
    decimal: string;
    symbol: string;
  };
  updatedAt: number;
  expiration: string;
  amount: string;
  subAccountId: string;
  spender: string;
}
export interface AssetDocument {
  deleted: boolean;
  logo: string;
  name: string;
  tokenSymbol: string;
  updatedAt: number;
  supportedStandards: Array<string>;
  address: string;
  tokenName: string;
  index: string;
  sortIndex: number;
  shortDecimal: string;
  decimal: string;
  subAccounts: Array<{
    transaction_fee: string;
    currency_amount: string;
    name: string;
    sub_account_id: string;
    address: string;
    amount: string;
    decimal: number;
    symbol: string;
  }>;
  symbol: string;
}
export interface ContactDocument {
  principal: string;
  deleted: boolean;
  name: string;
  assets: Array<{
    subaccounts: Array<{
      name: string;
      sub_account_id: string;
      subaccount_index: string;
    }>;
    logo: string;
    tokenSymbol: string;
    supportedStandards: Array<string>;
    address: string;
    shortDecimal: string;
    decimal: string;
    symbol: string;
  }>;
  updatedAt: number;
  accountIdentier: string;
}
export interface WalletDatabase {
  doesStorageExist: ActorMethod<[], boolean>;
  dump: ActorMethod<
    [],
    Array<[Principal, [Array<[] | [AssetDocument]>, Array<[] | [ContactDocument]>, Array<[] | [AllowanceDocument]>]]>
  >;
  pullAllowances: ActorMethod<[number, [] | [string], bigint], Array<AllowanceDocument>>;
  pullAssets: ActorMethod<[number, [] | [string], bigint], Array<AssetDocument>>;
  pullContacts: ActorMethod<[number, [] | [string], bigint], Array<ContactDocument>>;
  pushAllowances: ActorMethod<[Array<AllowanceDocument>], Array<AllowanceDocument>>;
  pushAssets: ActorMethod<[Array<AssetDocument>], Array<AssetDocument>>;
  pushContacts: ActorMethod<[Array<ContactDocument>], Array<ContactDocument>>;
}
export interface _SERVICE extends WalletDatabase {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
