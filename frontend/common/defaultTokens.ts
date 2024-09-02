import { SupportedStandardEnum } from "../@types/icrc";
import { Asset, SubAccount } from "@redux/models/AccountModels";

const supportedStandards = [SupportedStandardEnum.Values["ICRC-1"], SupportedStandardEnum.Values["ICRC-2"]];

export const defaultSubAccount: SubAccount = {
  sub_account_id: "0x0",
  name: "Default",
  amount: "0",
  currency_amount: "0",
  address: "",
  decimal: 0,
  symbol: "",
  transaction_fee: "0",
};

// INFO: default assets to add in the add asset modal
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
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10000" }],
    supportedStandards,
  },
  {
    sortIndex: 10001,
    address: "oh54a-baaaa-aaaap-abryq-cai",
    symbol: "GLDT",
    name: "Gold token",
    tokenSymbol: "GLDT",
    tokenName: "Gold token",
    decimal: "8",
    shortDecimal: "8",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10000" }],
    index: "oo6x4-xiaaa-aaaap-abrza-cai",
    supportedStandards,
  },
  {
    sortIndex: 10002,
    address: "jwcfb-hyaaa-aaaaj-aac4q-cai",
    symbol: "OGYL",
    name: "Origyn Legacy",
    tokenSymbol: "OGYL",
    tokenName: "Origyn Legacy",
    decimal: "8",
    shortDecimal: "8",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "200000" }],
    index: "",
    supportedStandards,
  },
  {
    sortIndex: 10003,
    symbol: "TCYCLES",
    name: "Trillion Cycles",
    tokenSymbol: "TCYCLES",
    tokenName: "Trillion Cycles",
    address: "um5iw-rqaaa-aaaaq-qaaba-cai",
    decimal: "12",
    shortDecimal: "12",
    logo: "",
    index: "ul4oc-4iaaa-aaaaq-qaabq-cai",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10" }],
    supportedStandards,
  },
];

// INFO: default assets of a new user
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
    index: "",
    logo: "",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10000" }],
    supportedStandards,
  },
  {
    sortIndex: 1,
    symbol: "TCYCLES",
    name: "Trillion Cycles",
    tokenSymbol: "TCYCLES",
    tokenName: "Trillion Cycles",
    address: "um5iw-rqaaa-aaaaq-qaaba-cai",
    decimal: "12",
    shortDecimal: "12",
    logo: "",
    index: "ul4oc-4iaaa-aaaaq-qaabq-cai",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10" }],
    supportedStandards,
  },
  {
    sortIndex: 2,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    shortDecimal: "8",
    logo: "",
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10" }],
    supportedStandards,
  },
  {
    sortIndex: 3,
    symbol: "ckETH",
    name: "ckETH",
    tokenSymbol: "ckETH",
    tokenName: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    shortDecimal: "18",
    logo: "",
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "2000000000000" }],
    supportedStandards,
  },
  {
    sortIndex: 4,
    symbol: "ckUSDC",
    name: "ckUSDC",
    tokenSymbol: "ckUSDC",
    tokenName: "ckUSDC",
    address: "xevnm-gaaaa-aaaar-qafnq-cai",
    index: "xrs4b-hiaaa-aaaar-qafoa-cai",
    decimal: "6",
    shortDecimal: "6",
    logo: "",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10000" }],
    supportedStandards,
  },
  {
    sortIndex: 5,
    symbol: "ckUSDT",
    name: "ckUSDT",
    tokenSymbol: "ckUSDT",
    tokenName: "ckUSDT",
    address: "cngnf-vqaaa-aaaar-qag4q-cai",
    index: "cefgz-dyaaa-aaaar-qag5a-cai",
    decimal: "6",
    shortDecimal: "6",
    logo: "",
    subAccounts: [{ ...defaultSubAccount, transaction_fee: "10000" }],
    supportedStandards,
  },
];

export const defaultHplLedgers = ["rqx66-eyaaa-aaaap-aaona-cai"];
