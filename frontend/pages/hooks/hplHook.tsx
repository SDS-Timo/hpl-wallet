// svgs
import { SubaccountInfo, SubaccountInfoEnum } from "@/const";
import HplDefaultIcon from "@assets/svg/files/defaultHPL.svg";
//
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateHPLBalances } from "@redux/assets/AssetActions";
import {
  editHPLAsset,
  editHPLSub,
  setHPLSelectedSub,
  setHPLSelectedVt,
  setHPLVTsData,
  setLoading,
} from "@redux/assets/AssetReducer";
import {
  HPLAsset,
  HPLAssetData,
  HPLSubAccount,
  HPLSubData,
  HPLVirtualData,
  HPLVirtualSubAcc,
} from "@redux/models/AccountModels";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useHPL = (open: boolean) => {
  const dispatch = useAppDispatch();

  const { userAgent } = useAppSelector((state) => state.auth);
  const { subaccounts, ingressActor, hplFTs, selectSub, selectVt, hplFTsData, hplSubsData, hplVTsData } =
    useAppSelector((state) => state.asset);
  const [selAssetOpen, setSelAssetOpen] = useState(false);
  const [selAssetSearch, setSelAssetSearch] = useState("");
  const [editNameId, setEditNameId] = useState("");
  const [editSubName, setEditSubName] = useState("");
  const [addSubErr, setAddSubErr] = useState("");
  const [sortVt, setSortVt] = useState(0);
  const [subInfoType, setSubInfoType] = useState<SubaccountInfo>(SubaccountInfoEnum.Enum.VIRTUALS);
  const [selAsset, setSelAsset] = useState<HPLAsset | undefined>();
  const [editedFt, setEditedFt] = useState<HPLAsset | undefined>();
  const [newVt, setNewVt] = useState<HPLVirtualSubAcc>({
    virt_sub_acc_id: "",
    name: "",
    amount: "",
    currency_amount: "",
    expiration: dayjs().add(7, "day").valueOf(),
    accesBy: "",
    backing: "",
  });

  const [newHplSub, setNewHplSub] = useState<HPLSubAccount>({
    name: "",
    sub_account_id: "0",
    amount: "0",
    currency_amount: "0",
    transaction_fee: "0",
    ft: "-1",
    virtuals: [],
  });

  const setSelSub = (sub: HPLSubAccount | undefined) => {
    dispatch(setHPLSelectedSub(sub));
  };
  const setSelVt = (vt: HPLVirtualSubAcc | undefined) => {
    dispatch(setHPLSelectedVt(vt));
  };
  const editSelAsset = (ft: HPLAsset, ftData: HPLAssetData[]) => {
    dispatch(editHPLAsset(ft, ftData));
  };
  const editSelSub = (subEdited: HPLSubAccount, subData: HPLSubData[]) => {
    dispatch(editHPLSub(subEdited, subData));
  };
  const editVtDAta = (vtData: HPLVirtualData[]) => {
    dispatch(setHPLVTsData(vtData));
  };

  useEffect(() => {
    if (!selAssetOpen) {
      setNewHplSub({
        name: "",
        sub_account_id: "0",
        amount: "0",
        currency_amount: "0",
        transaction_fee: "0",
        ft: "-1",
        virtuals: [],
      });
      setAddSubErr("");
      setSelAssetSearch("");
      setSelAsset(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!selectSub && subaccounts.length > 0) setSelSub(subaccounts[0]);
  }, [subaccounts]);

  const reloadHPLBallance = async () => {
    dispatch(setLoading(true));
    const { subs } = await updateHPLBalances(userAgent);
    if (selectSub) {
      const auxSub = subs.find((sub) => sub.sub_account_id === selectSub.sub_account_id);
      setSelSub(auxSub);
      setSelVt(undefined);
    }
    dispatch(setLoading(false));
  };

  const getFtFromSub = (sub: string) => {
    return (
      hplFTs.find((ft) => ft.id === sub) || {
        id: "",
        name: "",
        token_name: "",
        symbol: "",
        token_symbol: "",
        decimal: 0,
        description: "",
        logo: "",
      }
    );
  };
  const getSubFromVt = (backing: string) => {
    return (
      subaccounts.find((sub) => sub.sub_account_id === backing) || {
        sub_account_id: "",
        name: "",
        amount: "0",
        currency_amount: "0",
        transaction_fee: "0",
        ft: "0",
        virtuals: [],
      }
    );
  };
  const getFtFromVt = (backing: string) => {
    return getFtFromSub(getSubFromVt(backing).ft);
  };

  const getAssetLogo = (id: string) => {
    const ft = hplFTs.find((ft) => ft.id === id);
    if (ft) {
      return ft.logo != "" ? ft.logo : HplDefaultIcon;
    } else {
      return HplDefaultIcon;
    }
  };

  return {
    ingressActor,
    subaccounts,
    hplFTs,
    selAsset,
    setSelAsset,
    selAssetOpen,
    setSelAssetOpen,
    selAssetSearch,
    setSelAssetSearch,
    newHplSub,
    setNewHplSub,
    addSubErr,
    setAddSubErr,
    selectSub,
    setSelSub,
    selectVt,
    editedFt,
    setSelVt,
    setEditedFt,
    editSelAsset,
    editSelSub,
    editVtDAta,
    getFtFromSub,
    getSubFromVt,
    getFtFromVt,
    hplFTsData,
    hplSubsData,
    hplVTsData,
    editNameId,
    setEditNameId,
    editSubName,
    setEditSubName,
    getAssetLogo,
    subInfoType,
    setSubInfoType,
    sortVt,
    setSortVt,
    newVt,
    setNewVt,
    reloadHPLBallance,
  };
};
