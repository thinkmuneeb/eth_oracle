require("dotenv").config();

import request from "request-promise-native";

import {
  updateRequest,
  newRequestEvent
} from "./ethereum";

const start = () => {

  newRequestEvent(async (error, result) => {

    let options = {
      uri: result.args.url,
      json: true
    };

    let id = result.args.id
    let valueRetrieved = 'can not get value from api.';
    
    try {
      //console.log('result from onchain: ', result)
      valueRetrieved = await request(options)
      //console.log('value got from api: ', valueRetrieved)
    	valueRetrieved = valueRetrieved[result.args.attribute]
    }catch(err){
    	console.log('api data fetch error: ' + err)
    }
    
    try{
      await updateRequest({id,valueRetrieved});
    }
    catch(err){
      console.log('update request error while sending data onchain. ' + err);
    }

  });
};

export default start;
