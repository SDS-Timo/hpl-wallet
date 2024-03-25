// svgs
import { ProtocolType, ProtocolTypeEnum } from "@/const";
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

interface SearchAssetProps {
  searchKey: string;
  setSearchKey(e: ChangeEvent<HTMLInputElement>): void;
  onAddAsset(): void;
  protocol: ProtocolType;
  handleFilterNonZeroBalances: any;
  zeroBalance: boolean;
}

export default function SearchAsset(props: SearchAssetProps) {
  const { t } = useTranslation();
  const { searchKey, setSearchKey, onAddAsset, protocol, handleFilterNonZeroBalances, zeroBalance } = props;

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-start w-full gap-3 pr-5 mb-4">
        <input
          className="dark:bg-PrimaryColor bg-PrimaryColorLight text-PrimaryTextColorLight dark:text-PrimaryTextColor border-SearchInputBorderLight dark:border-SearchInputBorder w-full h-8 rounded-lg border-[1px] outline-none px-3 text-md"
          type="text"
          placeholder={t("search")}
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e);
          }}
          autoComplete="false"
          spellCheck={false}
        />
        <div
          className="flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor"
          onClick={onAddAsset}
        >
          <img src={PlusIcon} alt="plus-icon" />
        </div>
      </div>
      {protocol === ProtocolTypeEnum.Enum.HPL && (
        <div className="flex flex-row justify-between items-center w-full pr-5 pl-4 mb-3 mt-2 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <div className="flex flex-row justify-start items-center gap-2">
            <p className="text-md">{t("non.zero.balance")}</p>
            <div
              className={`flex flex-row w-9 h-4 rounded-full relative cursor-pointer items-center ${
                zeroBalance ? "bg-[#26A17B]" : "bg-[#7E7D91]"
              }`}
              onClick={handleFilterNonZeroBalances}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-spacing duration-300 ${
                  zeroBalance ? "ml-5" : "ml-1"
                }`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
