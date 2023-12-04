const WorkerTrans = {
  TRANSACTIONS: "TRANSACTIONS",
  ASSETS: "ASSETS",
};

// eslint-disable-next-line no-restricted-globals
const timerCode = () => {
  self.onmessage = () => {
    self.postMessage(WorkerTrans.TRANSACTIONS);
    setInterval(() => {
      self.postMessage(WorkerTrans.TRANSACTIONS);
    }, 10 * 60 * 1000);
    setInterval(() => {
      self.postMessage(WorkerTrans.ASSETS);
    }, 10 * 60 * 1000);
  };
};

let code = timerCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "text/javascript" });
const timer_script = URL.createObjectURL(blob);

export default timer_script;
