import { SupportedStandardEnum } from "./@types/icrc";
import { Asset, SubAccount } from "@redux/models/AccountModels";


const supportedStandards = [SupportedStandardEnum.Values["ICRC-1"], SupportedStandardEnum.Values["ICRC-2"]];

const defaultSubAccount: SubAccount = {
  sub_account_id: "0",
  name: "Default",
  amount: "0",
  currency_amount: "0",
  address: "",
  decimal: 0,
  symbol: "",
  transaction_fee: ""

};
const defaultAssetSubAccount: SubAccount = {
  ...defaultSubAccount,
  sub_account_id: "0x0",
  name: "Default",
  amount: "0",
  currency_amount: "0",
  address: "",
  decimal: 0,
  symbol: "",
  transaction_fee: ""
};

//
export const ICRC1systemAssets: Array<Asset> = [
  {
    sortIndex: 10000,
    symbol: "ICP",
    name: "Internet Computer",
    tokenSymbol: "ICP",
    tokenName: "Internet Computer",
    address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    decimal: "8",
    shortDecimal: "8",
    // fee: "10000",
    subAccounts: [defaultSubAccount],
    supportedStandards,
  },
  {
    sortIndex: 10001,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    shortDecimal: "8",
    // fee: "10",
    subAccounts: [defaultSubAccount],
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    supportedStandards,
  },
  {
    sortIndex: 10002,
    symbol: "ckETH",
    name: "ckETH",
    tokenName: "ckETH",
    tokenSymbol: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    shortDecimal: "18",
    // fee: "2000000000000",
    subAccounts: [defaultSubAccount],
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    supportedStandards,
  },
  {
    sortIndex: 10003,
    address: "oh54a-baaaa-aaaap-abryq-cai",
    symbol: "GLDT",
    name: "Gold token",
    tokenSymbol: "GLDT",
    tokenName: "Gold token",
    decimal: "8",
    shortDecimal: "8",
    // fee: "10000",
    subAccounts: [defaultSubAccount],
    index: "oo6x4-xiaaa-aaaap-abrza-cai",
    supportedStandards,
  },
  {
    sortIndex: 10004,
    address: "jwcfb-hyaaa-aaaaj-aac4q-cai",
    symbol: "OGY",
    name: "Origyn",
    tokenSymbol: "OGY",
    tokenName: "Origyn",
    decimal: "8",
    shortDecimal: "8",
    // fee: "200000",
    subAccounts: [defaultSubAccount],
    index: "",
    supportedStandards,
  },
];

//
export const defaultTokens: Asset[] = [
  {
    sortIndex: 0,
    symbol: "ICP",
    name: "Internet Computer",
    tokenSymbol: "ICP",
    tokenName: "Internet Computer",
    address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    decimal: "8",
    shortDecimal: "8",
    // fee: "10000",
    index: "",
    logo: "",
    subAccounts: [defaultAssetSubAccount],
    supportedStandards,
  },
  {
    sortIndex: 1,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    shortDecimal: "8",
    // fee: "10",
    logo: "",
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    subAccounts: [defaultAssetSubAccount],
    supportedStandards,
  },
  {
    sortIndex: 2,
    symbol: "ckETH",
    name: "ckETH",
    tokenSymbol: "ckETH",
    tokenName: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    shortDecimal: "18",
    // fee: "2000000000000",
    logo: "",
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    subAccounts: [defaultAssetSubAccount],
    supportedStandards,
  },
];


