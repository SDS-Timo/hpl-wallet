import { z } from "zod";

export const contactAllowanceSchema = z.object({
  expiration: z.string(),
  amount: z.string(),
});

export type ContactAllowance = z.infer<typeof contactAllowanceSchema>;

export const contactAccountSchema = z.object({
  name: z.string(),
  subaccount: z.string(),
  subaccountId: z.string(),
  tokenSymbol: z.string(),
  allowance: contactAllowanceSchema.optional(), // Allow optional allowance
});

export type ContactAccount = z.infer<typeof contactAccountSchema>;

export const contactSchema = z.object({
  name: z.string(),
  principal: z.string(),
  accountIdentifier: z.string(),
  accounts: z.array(contactAccountSchema),
});

export type Contact = z.infer<typeof contactSchema>;

export const defaultContactSubAccount: ContactAccount = {
  name: "",
  subaccountId: "",
  subaccount: "",
  tokenSymbol: "",
  allowance: undefined,
};

export const NewContactSubAccountSchema = z.object({
  principal: z.string(),
  name: z.string(),
  tokenSymbol: z.string(),
  symbol: z.string(),
  subaccIdx: z.string(),
  subaccName: z.string(),
  totalAssets: z.number(),
  TotalSub: z.number(),
});

export type NewContactSubAccount = z.infer<typeof NewContactSubAccountSchema>;

const ContactErr = z.object({
  name: z.boolean(),
  principal: z.boolean(),
});

export type ContactErr = z.infer<typeof ContactErr>;
