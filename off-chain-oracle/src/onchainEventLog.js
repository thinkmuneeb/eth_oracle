import {
  updateRequestEvent,
  newRequestEvent
} from "./ethereum";

const consume = () => {
  updateRequestEvent((error, result) => {
    console.log("UPDATE REQUEST EVENT EMITTED ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("UPDATE REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });

  newRequestEvent((error, result) => {
    console.log("NEW REQUEST EVENT EMITTED ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("NEW REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });
};

export default consume;