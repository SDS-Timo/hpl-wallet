import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomInput } from "@components/input";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomCopy } from "@components/tooltip";
import { toFullDecimal } from "@/utils";

interface AccountAccordionItemProps {
  subAccount: SubAccount;
  isCurrentSubAccountSelected: boolean;
  currentAsset: Asset;
}

export default function AccountAccordionItem({
  subAccount,
  isCurrentSubAccountSelected,
  currentAsset,
}: AccountAccordionItemProps) {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      <div
        aria-haspopup="true"
        className={getAccountStyles()}
        // onClick={() => {
        //   if (selectedAsset?.tokenSymbol !== currentAsset.tokenSymbol) changeSelectedAsset(asset);
        //   if (selectedAccount !== subAccount) changeSelectedAccount(subAccount);
        //   if (editNameId !== subAccount.sub_account_id) setEditNameId("");
        // }}
      >
        <div className="flex flex-col items-start justify-center">
          {editNameId === subAccount.sub_account_id ? (
            <div className="flex flex-row items-center justify-start">
              <CustomInput
                intent={"primary"}
                placeholder={""}
                value={name}
                border={nameError ? "error" : undefined}
                sizeComp="small"
                sizeInput="small"
                inputClass="!py-1"
                compOutClass="!w-1/2"
                autoFocus
                onChange={onNameChange}
              />
              <button
                className="flex justify-center items-center ml-2 p-0.5 bg-RadioCheckColor rounded cursor-pointer"
                onClick={onSave}
              >
                <p className="text-sm text-PrimaryTextColor">{t("save")}</p>
              </button>
              <button
                className="flex items-center justify-center p-1 ml-2 rounded cursor-pointer bg-LockColor"
                onClick={onAdd}
              >
                <img src={PlusIcon} className="w-4 h-4 rotate-45" alt="info-icon" />
              </button>
            </div>
          ) : (
            <button className="p-0 w-full text-left min-h-[1.645rem]" onDoubleClick={onDoubleClick}>
              <p className={`${accName()} break-words max-w-[9rem]`}>{`${subAccount?.name}`}</p>
            </button>
          )}
          <div className="flex flex-row items-center justify-start gap-3 min-h-5">
            <p className={`${subAccountIdStyles()} break-words max-w-[9rem] text-left`}>{subAccount?.sub_account_id}</p>
            {isCurrentSubAccountSelected && (
              <CustomCopy size={"xSmall"} className="p-0" copyText={subAccount?.sub_account_id.substring(2) || "0"} />
            )}
          </div>
        </div>
        <div
          className={getDefaultAccountStyles(
            // subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub,
            subAccount?.sub_account_id !== "0x0",
          )}
        >
          <div className="flex flex-col items-end justify-center">
            <p className="whitespace-nowrap">
              {`${toFullDecimal(subAccount?.amount, subAccount.decimal, Number(currentAsset.shortDecimal))} ${
                currentAsset.symbol
              }`}
            </p>
            <p className={subAccountCurrencyStyles()}>{`≈ $${Number(subAccount?.currency_amount).toFixed(2)}`}</p>
          </div>
          {/* {subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub && ( */}
          {subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && (
            <button
              className="p-0"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              <TrashIcon className=" fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
            </button>
          )}
        </div>
      </div>
      {deleteModal && <p>Delete Modal</p>}
    </>
  );

  function onDoubleClick() {
    setEditNameId(subAccount.sub_account_id);
    // setName(subAccount.name);
    // setNewSub(undefined);
    // setAddOpen(false);
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    // setName(e.target.value);
    // setNameError(false);
  }

  function onAdd() {
    setEditNameId("");
    // setNewSub(undefined);
    // setAddOpen(false);
  }

  async function onSave() {
    //   if (name.trim() !== "") {
    //     setEditNameId("");
    //     if (newSub) {
    //       // INFO: adding new sub account ?
    //       const asset = assets[+tokenIndex];
    //       const subAccounts = asset.subAccounts
    //         .map((sa) => ({
    //           ...sa,
    //           name: name,
    //           numb: subAccount.sub_account_id,
    //         }))
    //         .sort((a, b) => bigInt(a.numb).compare(bigInt(b.numb)));
    //       await db().updateAsset(
    //         asset.address,
    //         {
    //           ...asset,
    //           subAccounts: subAccounts,
    //         },
    //         { sync: true },
    //       );
    //       setNewSub(undefined);
    //       setAddOpen(false);
    //     } else {
    //       // INFO: updating the name of the sub account
    //       const asset = assets[+tokenIndex];
    //       const subAccounts = asset.subAccounts.map((sa) =>
    //         sa.sub_account_id === subAccount.sub_account_id ? { ...sa, name: name } : sa,
    //       );
    //       await db().updateAsset(
    //         asset.address,
    //         {
    //           ...asset,
    //           subAccounts: subAccounts,
    //         },
    //         { sync: true },
    //       );
    //     }
    //   } else {
    //     setNameError(true);
    //   }
  }

  function getAccountStyles() {
    return clsx({
      ["relative flex flex-row justify-between items-center w-[calc(100%-2rem)] min-h-[3.5rem] pl-4 pr-4 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-[rgb(51,178,239,0.24)] text-md"]:
        true,
      ["bg-[rgb(51,178,239,0.24)]"]: isCurrentSubAccountSelected,
      // ["bg-[rgb(51,178,239,0.24)]"]: isCurrentSubAccountSelected && !newSub,
      // ["!bg-SvgColor"]: newSub,
    });
  }

  function accName() {
    return clsx({ ["text-[#33b2ef]"]: isCurrentSubAccountSelected });
  }

  function subAccountIdStyles() {
    return clsx({
      ["text-[#33b2ef]"]: isCurrentSubAccountSelected,
      ["opacity-60"]: !isCurrentSubAccountSelected,
    });
  }

  function subAccountCurrencyStyles() {
    return clsx({
      ["opacity-60"]: !isCurrentSubAccountSelected,
    });
  }
}

const getDefaultAccountStyles = (isNotDefault = false) =>
  clsx("flex flex-row justify-between items-center gap-2", {
    "pr-6": !isNotDefault,
    "": isNotDefault,
  });
