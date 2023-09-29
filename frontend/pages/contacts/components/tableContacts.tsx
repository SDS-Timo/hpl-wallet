// svgs
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useTranslation } from "react-i18next";
import {
  AssetContact,
  Contact,
  ContactErr,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { AccountIdentifier } from "@dfinity/nns";
import ContactAssetPop from "./contactAssetPop";
import { getInitialFromName, shortAddress } from "@/utils";
import TableAssets from "./tableAssets";
import { Fragment } from "react";
import { CustomCopy } from "@components/CopyTooltip";
import { CustomInput } from "@components/Input";
import { clsx } from "clsx";
import { DeleteContactTypeEnum } from "@/const";
import { Principal } from "@dfinity/principal";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { useContacts } from "../hooks/contactsHook";

interface TableContactsProps {
  contacts: Contact[];
  openSubaccToken: string;
  setOpenSubaccToken(value: string): void;
  setSelSubaccIdx(value: string): void;
  changeName(value: string): void;
  addSub: boolean;
  setAddSub(value: boolean): void;
  setDeleteType(value: DeleteContactTypeEnum): void;
  setDeleteObject(value: NewContactSubAccount): void;
  setSelContactPrin(value: string): void;
  setSubaccEdited(value: SubAccountContact): void;
  setSubaccEditedErr(value: SubAccountContactErr): void;
  changeSubIdx(value: string): void;
  setDeleteModal(value: boolean): void;
  selSubaccIdx: string;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
  searchKey: string;
  assetFilter: string[];
  openAssetsPrin: string;
  selContactPrin: string;
  setOpenAssetsPrin(value: string): void;
  selCntcPrinAddAsst: string;
  contactEditedErr: ContactErr;
  setContactEditedErr(value: any): void;
  contactEdited: Contact;
  setContactEdited(value: any): void;
  setSelCntcPrinAddAsst(value: string): void;
}

const TableContacts = ({
  contacts,
  openSubaccToken,
  setOpenSubaccToken,
  setSelSubaccIdx,
  changeName,
  addSub,
  setAddSub,
  setDeleteType,
  setDeleteObject,
  setSelContactPrin,
  setSubaccEdited,
  setSubaccEditedErr,
  changeSubIdx,
  setDeleteModal,
  selSubaccIdx,
  subaccEdited,
  subaccEditedErr,
  searchKey,
  assetFilter,
  openAssetsPrin,
  selContactPrin,
  setOpenAssetsPrin,
  selCntcPrinAddAsst,
  contactEditedErr,
  setContactEditedErr,
  contactEdited,
  setContactEdited,
  setSelCntcPrinAddAsst,
}: TableContactsProps) => {
  const { t } = useTranslation();

  const { assets, getAssetIcon } = GeneralHook();
  const { checkPrincipalValid, updateContact, addAsset } = useContacts();

  const getContactColor = (idx: number) => {
    if (idx % 3 === 0) return "bg-ContactColor1";
    else if (idx % 3 === 1) return "bg-ContactColor2";
    else return "bg-ContactColor3";
  };

  const getContactsToShow = () => {
    return contacts.filter((cntc) => {
      let incSubName = false;
      for (let i = 0; i < cntc.assets.length; i++) {
        const ast = cntc.assets[i];
        for (let j = 0; j < ast.subaccounts.length; j++) {
          const sa = ast.subaccounts[j];
          if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) {
            incSubName = true;
            break;
          }
        }
      }
      if (assetFilter.length === 0) {
        return (
          cntc.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          incSubName ||
          cntc.principal.toLowerCase().includes(searchKey.toLowerCase())
        );
      } else {
        const astFilValid = assetFilter.some((astFil) => {
          return cntc.assets.find((ast) => ast.tokenSymbol === astFil);
        });

        return (
          (cntc.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            incSubName ||
            cntc.principal.toLowerCase().includes(searchKey.toLowerCase())) &&
          astFilValid
        );
      }
    });
  };

  // Tailwind CSS
  const contactStyle = (cntc: Contact) =>
    clsx({
      ["border-b border-BorderColorTwoLight dark:border-BorderColorTwo"]: true,
      ["bg-SelectRowColor/10"]: cntc.principal === selContactPrin || cntc.principal === selCntcPrinAddAsst,
      ["bg-SecondaryColorLight dark:bg-SecondaryColor"]:
        cntc.principal === openAssetsPrin && cntc.principal !== selContactPrin && cntc.principal !== selCntcPrinAddAsst,
    });

  return (
    <table className="w-full  text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
      <thead className="border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 sticky top-0 z-[1]">
        <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <th className="p-2 text-left w-[30%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
            <p>{t("name")}</p>
          </th>
          <th className="p-2 text-left w-[40%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{"Principal"}</p>
          </th>
          <th className="p-2 w-[15%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{t("assets")}</p>
          </th>
          <th className="p-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{t("action")}</p>
          </th>
          <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
        </tr>
      </thead>
      <tbody>
        {getContactsToShow().map((cntc, k) => (
          <Fragment key={k}>
            <tr className={contactStyle(cntc)}>
              <td className="">
                <div className="relative flex flex-row justify-start items-center w-full min-h-14 gap-2 px-4">
                  {(cntc.principal === selContactPrin ||
                    cntc.principal === openAssetsPrin ||
                    cntc.principal === selCntcPrinAddAsst) && (
                    <div className="absolute left-0 w-1 h-14 bg-SelectRowColor"></div>
                  )}
                  {cntc.principal === selContactPrin ? (
                    <CustomInput
                      intent={"primary"}
                      border={contactEditedErr.name ? "error" : "selected"}
                      sizeComp={"xLarge"}
                      sizeInput="small"
                      value={contactEdited.name}
                      onChange={(e) => {
                        setContactEdited((prev: any) => {
                          return { ...prev, name: e.target.value };
                        });
                        setContactEditedErr((prev: any) => {
                          return { name: false, principal: prev.principal };
                        });
                      }}
                    />
                  ) : (
                    <div className="flex flex-row justify-start items-center w-full gap-2">
                      <div
                        className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(
                          k,
                        )}`}
                      >
                        <p className="text-PrimaryTextColor">{getInitialFromName(cntc.name, 2)}</p>
                      </div>
                      <p className="text-left opacity-70 break-words w-full max-w-[14rem]">{cntc.name}</p>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-2">
                <div className="flex flex-row justify-start items-center gap-2 opacity-70 px-2">
                  <p>{shortAddress(cntc.principal, 12, 9)}</p>
                  <CustomCopy size={"xSmall"} className="p-0" copyText={cntc.principal} />
                </div>
              </td>
              <td className="py-2">
                <div className="flex flex-row justify-center items-center w-full">
                  <div
                    className={
                      "flex flex-row justify-between items-center w-28 h-8 rounded bg-black/10 dark:bg-white/10"
                    }
                  >
                    <p className="ml-2">{`${cntc.assets.length} ${t("assets")}`}</p>
                    <ContactAssetPop
                      compClass="flex flex-row justify-center items-center"
                      btnClass="!w-8 !h-8 bg-AddSecondaryButton rounded-l-none"
                      assets={assets.filter((ast) => {
                        let isIncluded = false;
                        cntc.assets.map((contAst) => {
                          if (ast.tokenSymbol === contAst.tokenSymbol) isIncluded = true;
                        });
                        return !isIncluded;
                      })}
                      getAssetIcon={getAssetIcon}
                      onAdd={(data) => {
                        const auxAsst: AssetContact[] = data.map((dt) => {
                          return {
                            symbol: dt.symbol,
                            tokenSymbol: dt.tokenSymbol,
                            logo: dt.logo,
                            subaccounts: [],
                          };
                        });
                        addAsset(auxAsst, cntc.principal);
                      }}
                      onOpen={() => {
                        setSelCntcPrinAddAsst(cntc.principal);
                        setAddSub(false);
                        setSelSubaccIdx("");
                        setSelContactPrin("");
                      }}
                      onClose={() => {
                        setSelCntcPrinAddAsst("");
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-2">
                <div className="flex flex-row justify-center items-start gap-4 w-full">
                  {cntc.principal === selContactPrin ? (
                    <CheckIcon
                      onClick={() => {
                        setContactEditedErr({
                          name: contactEdited.name.trim() === "",
                          principal:
                            contactEdited.principal !== cntc.principal && !checkPrincipalValid(contactEdited.principal),
                        });

                        if (
                          contactEdited.name.trim() !== "" &&
                          (checkPrincipalValid(contactEdited.principal) || contactEdited.principal === cntc.principal)
                        ) {
                          updateContact(
                            {
                              ...contactEdited,
                              assets: cntc.assets,
                              accountIdentier: AccountIdentifier.fromPrincipal({
                                principal: Principal.fromText(contactEdited.principal),
                              }).toHex(),
                            },
                            cntc.principal,
                          );
                          setSelContactPrin("");
                        }
                      }}
                      className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  ) : (
                    <PencilIcon
                      onClick={() => {
                        setAddSub(false);
                        setSelSubaccIdx("");
                        setSelContactPrin(cntc.principal);
                        setContactEdited(cntc);
                        if (cntc.principal !== openAssetsPrin) {
                          setOpenAssetsPrin("");
                        }
                        setContactEditedErr({ name: false, principal: false });
                      }}
                      className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  )}
                  {cntc.principal === selContactPrin ? (
                    <CloseIcon
                      onClick={() => {
                        setSelContactPrin("");
                        setSubaccEditedErr({ name: false, subaccount_index: false });
                      }}
                      className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  ) : (
                    <TrashIcon
                      onClick={() => {
                        setAddSub(false);
                        setSelContactPrin("");
                        setSelSubaccIdx("");
                        setDeleteType(DeleteContactTypeEnum.Enum.CONTACT);
                        let ttlSub = 0;
                        cntc.assets.map((asst) => {
                          ttlSub = ttlSub + asst.subaccounts.length;
                        });
                        setDeleteObject({
                          principal: cntc.principal,
                          name: cntc.name,
                          tokenSymbol: "",
                          symbol: "",
                          subaccIdx: "",
                          subaccName: "",
                          totalAssets: cntc.assets.length,
                          TotalSub: ttlSub,
                        });
                        setDeleteModal(true);
                      }}
                      className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                    />
                  )}
                </div>
              </td>
              <td className="py-2">
                <div className="flex flex-row justify-center items-start gap-2 w-full">
                  <ChevIcon
                    onClick={() => {
                      if (cntc.principal === openAssetsPrin) setOpenAssetsPrin("");
                      else {
                        if (cntc.assets.length > 0) {
                          setContactEdited(cntc);
                          setOpenAssetsPrin(cntc.principal);
                        }
                      }
                      if (cntc.principal !== selContactPrin) setSelContactPrin("");
                      setOpenSubaccToken("");
                      setSelSubaccIdx("");
                      setAddSub(false);
                    }}
                    className={`w-8 h-8 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor stroke-0  cursor-pointer ${
                      cntc.principal === openAssetsPrin ? "" : "rotate-90"
                    }`}
                  />
                </div>
              </td>
            </tr>
            {cntc.principal === openAssetsPrin && (
              <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
                <td colSpan={5} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
                  <TableAssets
                    cntc={cntc}
                    openSubaccToken={openSubaccToken}
                    setOpenSubaccToken={setOpenSubaccToken}
                    setSelSubaccIdx={setSelSubaccIdx}
                    changeName={changeName}
                    addSub={addSub}
                    setAddSub={setAddSub}
                    setDeleteType={setDeleteType}
                    setDeleteObject={setDeleteObject}
                    setSelContactPrin={setSelContactPrin}
                    setSubaccEdited={setSubaccEdited}
                    setSubaccEditedErr={setSubaccEditedErr}
                    changeSubIdx={changeSubIdx}
                    setDeleteModal={setDeleteModal}
                    selSubaccIdx={selSubaccIdx}
                    subaccEdited={subaccEdited}
                    subaccEditedErr={subaccEditedErr}
                  ></TableAssets>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableContacts;
