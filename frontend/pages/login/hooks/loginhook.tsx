// svgs
import XxxxIcon from "@/assets/svg/files/xxxx-logo.svg";
import icUrl from "@/assets/img/icp-logo.png";
import nfidUrl from "@/assets/img/nfid-logo.png";
import metamaskUrl from "@/assets/img/metamask-logo.png";
//
import { useState } from "react";
import { AuthNetworkNameEnum, AuthNetworkType, AuthNetworkTypeEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";

export const LoginHook = () => {
  // seed auth method
  const [seedOpen, setSeedOpen] = useState(false);
  const [seed, setSeed] = useState("");
  // principal auth method
  const [watchOnlyOpen, setWatchOnlyOpen] = useState(false);
  const [principalAddress, setPrincipalAddress] = useState("");
  // mnemonic auth method
  const [mnemonicOpen, setMnemonicOpen] = useState(false);
  const [phrase, setPhrase] = useState("");

  const loginOpts: AuthNetwork[] = [
    {
      name: AuthNetworkNameEnum.Values["Internet Identity"],
      icon: <img src={icUrl} alt="ic-logo" />,
      type: AuthNetworkTypeEnum.Values.IC,
      network: import.meta.env.VITE_AGGENT_HOST,
    },
    {
      name: AuthNetworkNameEnum.Values.NFID,
      icon: <img src={nfidUrl} alt="nfid-logo" />,
      type: AuthNetworkTypeEnum.Values.NFID,
      network: import.meta.env.VITE_AGGENT_NFID_HOST,
    },
    {
      name: AuthNetworkNameEnum.Values.Metamask,
      extra: "not.yet.available",
      icon: <img src={metamaskUrl} alt="metamask-logo" />,
      type: AuthNetworkTypeEnum.Values.MM,
      network: "",
    },
    {
      name: AuthNetworkNameEnum.Values.Seed,
      extra: "devs.only",
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.S,
      network: "",
    },
    {
      name: AuthNetworkNameEnum.Values["Watch-Only"],
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.WO,
      network: "",
    },
    {
      name: AuthNetworkNameEnum.Values.Mnemonic,
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.MNEMONIC,
      network: "",
    },
  ];

  console.log("login hook: ", [
    { seedOpen, seed },
    { watchOnlyOpen, principalAddress },
    { mnemonicOpen, phrase },
  ]);

  function clearLoginInputs() {
    setSeed("");
    setPrincipalAddress("");
    setPhrase("");
  }

  function closeLoginInputs() {
    setSeedOpen(false);
    setWatchOnlyOpen(false);
    setMnemonicOpen(false);
  }

  function resetMethods() {
    clearLoginInputs();
    closeLoginInputs();
  }

  function handleMethodChange(method: AuthNetworkType) {
    resetMethods();

    if (method === AuthNetworkTypeEnum.Enum.S) {
      setSeedOpen((prev) => !prev);
    }

    if (method === AuthNetworkTypeEnum.Enum.WO) {
      setWatchOnlyOpen((prev) => !prev);
    }

    if (method === AuthNetworkTypeEnum.Enum.MNEMONIC) {
      setMnemonicOpen((prev) => !prev);
    }
  }

  return {
    loginOpts,
    seedOpen,
    seed,
    setSeed,
    watchOnlyOpen,
    mnemonicOpen,
    principalAddress,
    setPrincipalAddress,
    phrase,
    setPhrase,

    handleMethodChange,
    resetMethods,
  };
};
