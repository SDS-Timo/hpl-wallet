import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";

export const UseAsset = () => {
  console.log("render UseAsset");

  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const changeSelectedAsset = (value: Asset) => dispatch(setSelectedAsset(value));
  const changeSelectedAccount = (value: SubAccount | undefined) => dispatch(setSelectedAccount(value));

  useEffect(() => {
    if (assets && assets.length > 0) {
      let actualAsset: Asset | undefined = undefined;

      assets.map((currentAsset: Asset) => {
        if (currentAsset?.tokenSymbol === selectedAsset?.tokenSymbol) {
          actualAsset = currentAsset;
          changeSelectedAsset(currentAsset);
        }
      });
      if (!actualAsset) {
        changeSelectedAsset(assets[0]);
      }
    }
  }, [assets]);

  useEffect(() => {
    console.log("selectedAsset", selectedAsset);

    if (selectedAsset) {
      let actualSub: SubAccount | undefined = undefined;
      selectedAsset.subAccounts.map((currentSubAccount: SubAccount) => {
        if (currentSubAccount.sub_account_id === (selectedAccount?.sub_account_id || "")) {
          actualSub = currentSubAccount;
          changeSelectedAccount(currentSubAccount);
        }
      });
      if (!actualSub) {
        changeSelectedAccount(selectedAsset.subAccounts[0]);
      }
    }
  }, [selectedAsset]);

  return {};
};
