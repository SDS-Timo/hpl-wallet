import ReceiverType from "@/pages/home/components/ICRC/transaction/SendForm/ReceiverType";
import ReceiverOwner from "@/pages/home/components/ICRC/transaction/SendForm/ReceiverOwner";
import ReceiverThird from "@/pages/home/components/ICRC/transaction/SendForm/ReceiverThird";
import { useAppSelector } from "@redux/Store";
import { clearReceiverAction, setReceiverOptionAction } from "@redux/transaction/TransactionActions";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import { useTranslation } from "react-i18next";
import { TransactionReceiverOptionEnum, TransactionSenderOptionEnum } from "@/@types/transactions";
import useSend from "@pages/home/hooks/useSend";
import { useEffect } from "react";

export default function ReceiverItem() {
  const { receiver, sender } = useAppSelector((state) => state.transaction);
  const { isReceiver } = useSend();
  const { t } = useTranslation();

  useEffect(() => {
    if (sender.senderOption == TransactionSenderOptionEnum.Enum.service) {
      setReceiverOptionAction(TransactionReceiverOptionEnum.Values.own);
      if (!receiver.ownSubAccount.address) clearReceiverAction();
    }
  }, [sender]);

  return (
    <div className="w-full mt-4 rounded-md bg-secondary-color-1-light dark:bg-level-1-color">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <ReceiverType />
      </div>

      <div>
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.third && <ReceiverThird />}
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.own && <ReceiverOwner />}
      </div>

      <div className="flex justify-start">
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.third && (
          <>
            {isReceiver ? (
              <button onClick={handleResetReceiver}>
                <p className="flex items-center justify-center text-md text-primary-color text-start">
                  <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
                  {t("back")}
                </p>
              </button>
            ) : (
              <button onClick={onReceiverOptionChange}>
                <p className="flex text-md text-primary-color text-start">
                  {t("transfer.between.accounts")}
                  <DownAmountIcon className="relative mt-2 -rotate-90 bottom-2 left-2" />
                </p>
              </button>
            )}
          </>
        )}

        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.own &&
          (sender.senderOption !== TransactionSenderOptionEnum.Enum.service ? (
            <button onClick={onReceiverOptionChange}>
              <p className="flex items-center justify-center text-md text-primary-color text-start">
                <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
                {t("back")}
              </p>
            </button>
          ) : (
            <button></button>
          ))}
      </div>
    </div>
  );

  function handleResetReceiver() {
    clearReceiverAction();
  }

  function onReceiverOptionChange() {
    if (receiver.receiverOption === TransactionReceiverOptionEnum.Values.third)
      setReceiverOptionAction(TransactionReceiverOptionEnum.Values.own);
    if (receiver.receiverOption === TransactionReceiverOptionEnum.Values.own)
      setReceiverOptionAction(TransactionReceiverOptionEnum.Values.third);
    clearReceiverAction();
  }
}
