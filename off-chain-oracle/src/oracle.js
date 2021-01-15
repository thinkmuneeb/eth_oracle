require("dotenv").config();

import request from "request-promise-native";

import { updateRequest, newRequestEvent, toWei } from "./ethereum";

let diary = {};

const start = () => {
  newRequestEvent(async (error, result) => {
    //return;
    // console.log("blockNumber: ", blockNumber);
    // if (diary[blockNumber] !== true) return;
    // diary[blockNumber] = true;

    console.log("result.args.ethAddress: ", result.args.ethAddress);
    console.log("result: ", result);

    let options = {
      uri: `https://www.bird.money/analytics/address/${result.args.ethAddress}`,
      json: true,
    };

    let id = result.args.id;
    let valueRetrieved = "can not get value from api.";

    try {
      //console.log('result from onchain: ', result)
      valueRetrieved = await request(options);
      //console.log('value got from api: ', valueRetrieved)
      valueRetrieved = valueRetrieved[result.args.attribute];

      try {
        valueRetrieved = toWei(valueRetrieved);
      } catch (err) {
        console.log("can not convert to wei: " + err);
      }
    } catch (err) {
      console.log("api data fetch error: " + err);
    }

    try {
      await updateRequest({ id, valueRetrieved });
    } catch (err) {
      console.log(
        "update request error while sending data onchain. " + err.message
      );
    }
  });
};

export default start;
