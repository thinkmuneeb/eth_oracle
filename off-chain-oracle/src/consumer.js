import {
  updatedRequestEvent,
  newRequestEvent
} from "./ethereum";

const consume = () => {
  updatedRequestEvent((error, result) => {
    console.log("UPDATE REQUEST DATA EVENT ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("UPDATE REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });

  newRequestEvent((error, result) => {
    console.log("NEW REQUEST DATA EVENT ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("NEW REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });
};

export default consume;