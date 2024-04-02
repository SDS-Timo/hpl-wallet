// svgs
import { ReactComponent as DownBlueArrow } from "@assets/svg/files/down-blue-arrow.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { getAssetSymbol, getICRC1Acc, hexToUint8Array, shortAddress, toFullDecimal } from "@/utils";
import { AssetSymbolEnum, SpecialTxTypeEnum } from "@/const";
import { Principal } from "@dfinity/principal";
import { AccountHook } from "@pages/hooks/accountHook";
import { IcrcAccount } from "@dfinity/ledger-icrc";
import { CustomCopy } from "@components/tooltip";
import { AssetHook } from "@pages/home/hooks/assetHook";
import { GeneralHook } from "@pages/home/hooks/generalHook";

const DrawerTransaction = () => {
  const { t } = useTranslation();

  const { authClient } = AccountHook();
  const { assets } = AssetHook();
  const { ICPSubaccounts, selectedTransaction, selectedAccount } = GeneralHook();

  const assetSymbol = getAssetSymbol(selectedTransaction?.symbol || "", assets);

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start w-full h-full pt-4 mt-4 text-md text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70">
        {/* FROM SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-secondary-color-1-light dark:bg-level-1-color">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("from")}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.principal")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(false) ? shortAddress(getPrincipal(false), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getPrincipal(false)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.subacc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(false) ? getSub(false) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getSub(false).substring(2)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("icrc.acc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(false) ? shortAddress(getICRCAccount(false), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={hasSub(false) ? getICRCAccount(false) : ""}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
              <div className="flex flex-row items-center justify-between w-full font-normal">
                <p>{`${t("acc.identifier")}`}</p>
                <div className="flex flex-row items-center justify-start gap-2">
                  <p>{`${shortAddress(getIdentifier(false), 12, 12)}`}</p>
                  <CustomCopy
                    size={"small"}
                    copyText={getIdentifier(false)}
                    copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                    isTransaction={true}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{t("transaction.amount")}</p>
              <p className="">{`${toFullDecimal(
                BigInt(selectedTransaction?.amount || "0") + BigInt(selectedAccount?.transaction_fee || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol}`}</p>
            </div>
          </div>
        )}

        {/* ARROW SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.burn &&
          selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && <DownBlueArrow className="my-3"></DownBlueArrow>}
        {/* TO SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.burn && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-secondary-color-1-light dark:bg-level-1-color rounded-md">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("to")}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.principal")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(true) ? shortAddress(getPrincipal(true), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getPrincipal(true)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.subacc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(true) ? getSub(true) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getSub(true).substring(2)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("icrc.acc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(true) ? shortAddress(getICRCAccount(true), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getICRCAccount(true)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
              <div className="flex flex-row items-center justify-between w-full font-normal">
                <p>{`${t("acc.identifier")}`}</p>
                <div className="flex flex-row items-center justify-start gap-2">
                  <p>{`${shortAddress(getIdentifier(true), 12, 12)}`}</p>
                  <CustomCopy
                    size={"small"}
                    copyText={getIdentifier(true)}
                    copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                    isTransaction={true}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{t("transaction.amount")}</p>
              <p className="">{`${toFullDecimal(
                BigInt(selectedTransaction?.amount || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol}`}</p>
            </div>
          </div>
        )}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 mt-5 p-4 bg-secondary-color-1-light dark:bg-level-1-color rounded-md">
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p className="font-bold">{t("fee")}</p>
              <p className="font-bold">{`${toFullDecimal(
                BigInt(selectedAccount?.transaction_fee || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol}`}</p>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );

  function hasSub(to: boolean) {
    return (
      selectedTransaction?.symbol !== AssetSymbolEnum.Enum.ICP ||
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  }

  function isICPWithSub(to: boolean) {
    return (
      selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP &&
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  }

  function getIdentifier(to: boolean) {
    if (selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP) {
      if (to) return selectedTransaction?.to || "";
      else return selectedTransaction?.from || "";
    } else
      return Principal.fromHex(
        to ? selectedTransaction?.identityTo || "" : selectedTransaction?.identityFrom || "",
      ).toString();
  }

  function getPrincipal(to: boolean) {
    return isICPWithSub(to) ? authClient : to ? selectedTransaction?.to || "" : selectedTransaction?.from || "";
  }

  function getSub(to: boolean) {
    if (isICPWithSub(to)) {
      return (
        ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
          ?.sub_account_id || "0x0"
      );
    } else if (to) return selectedTransaction?.toSub || "0x0";
    else return selectedTransaction?.fromSub || "0x0";
  }

  function getICRCAccount(to: boolean) {
    try {
      return getICRC1Acc({
        owner: Principal.fromText(getPrincipal(to)),
        subaccount: hexToUint8Array(getSub(to)),
      } as IcrcAccount);
    } catch {
      return getPrincipal(to);
    }
  }
};

export default DrawerTransaction;
