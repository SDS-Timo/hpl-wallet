import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { Asset } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { CustomCheck } from "@components/checkbox";

interface AssetFilterProps {
  setAssetOpen: (open: boolean) => void;
  assetFilter: string[];
  assetOpen: boolean;
  setAssetFilter: (filter: string[]) => void;
}

export default function AssetFilter(props: AssetFilterProps) {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);
  const { setAssetOpen, assetFilter, assetOpen, setAssetFilter } = props;

  return (
    <DropdownMenu.Root
      onOpenChange={(e: boolean) => {
        setAssetOpen(e);
      }}
    >
      <DropdownMenu.Trigger asChild>
        <div className={triggerContainerStyles}>
          <div className="flex flex-row items-center justify-between w-full">
            {assetFilter.length === 0 || assetFilter.length === assets.length ? (
              <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("all")}</p>
            ) : assetFilter.length === 1 ? (
              <div className="flex items-center justify-start gap-2 flex-start">
                {getAssetIcon(
                  IconTypeEnum.Enum.FILTER,
                  assetFilter[0],
                  assets.find((ast) => ast.tokenSymbol === assetFilter[0])?.logo,
                )}
                <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{assetFilter[0]}</p>
              </div>
            ) : (
              <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{`${assetFilter.length} ${t(
                "selections",
              )}`}</p>
            )}

            <DropIcon className={`fill-gray-color-4 ${assetOpen ? "-rotate-90" : ""}`} />
          </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentContainerStyles} sideOffset={2} align="end">
          <button
            onClick={handleSelectAll}
            className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-t-lg hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
          >
            <p>{t("selected.all")}</p>
            <CustomCheck
              className="border-secondary-color-2-light dark:border-BorderColor"
              checked={assetFilter.length === assets.length}
            />
          </button>
          {assets.map((asset, k) => {
            return (
              <button
                key={k}
                className={assetStyle(k, assets)}
                onClick={() => {
                  handleSelectAsset(asset);
                }}
              >
                <div className="flex items-center justify-start gap-2 flex-start">
                  {getAssetIcon(IconTypeEnum.Enum.FILTER, asset.tokenSymbol, asset.logo)}
                  <p>{asset.symbol}</p>
                </div>

                <CustomCheck
                  className="border-BorderColorLight dark:border-BorderColor"
                  checked={assetFilter.includes(asset.tokenSymbol)}
                />
              </button>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function handleSelectAll() {
    if (assetFilter.length === assets.length) setAssetFilter([]);
    else {
      const symbols = assets.map((currentAsset) => {
        return currentAsset.tokenSymbol;
      });
      setAssetFilter(symbols);
    }
  }

  function handleSelectAsset(asset: Asset) {
    if (assetFilter.includes(asset.tokenSymbol)) {
      const auxSymbols = assetFilter.filter((currentAsset) => currentAsset !== asset.tokenSymbol);
      setAssetFilter(auxSymbols);
    } else setAssetFilter([...assetFilter, asset.tokenSymbol]);
  }
}

const assetStyle = (k: number, assets: Asset[]) =>
  clsx({
    ["flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"]:
      true,
    ["rounded-b-lg"]: k === assets.length - 1,
  });

const triggerContainerStyles = clsx(
  "flex flex-row justify-start items-center cursor-pointer",
  "border border-BorderColorLight dark:border-BorderColor",
  "rounded px-2 py-1 w-[10rem] h-[2.5rem]",
  "bg-SecondaryColorLight dark:bg-SecondaryColor",
);

const contentContainerStyles = clsx(
  "text-md bg-PrimaryColorLight w-[10rem]",
  "rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20",
);
