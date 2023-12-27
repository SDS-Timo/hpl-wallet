import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";

export interface Allowance {
  id: string;
  asset: Asset;
  subAccount: Partial<SubAccount>;
  spender: Partial<Contact>;
  amount: string;
  expiration: string;
  noExpire: boolean;
}
