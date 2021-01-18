require("dotenv").config();

import Web3 from "web3";

import HDWalletProvider from "@truffle/hdwallet-provider";

let provider = null;
let mnemonic = null;

const fs = require("fs");
try {
  mnemonic = fs.readFileSync(".secret").toString().trim();
  provider = new HDWalletProvider(mnemonic, process.env.WEB3_PROVIDER_ADDRESS);
} catch (err) {
  //console.log('Error: please provide correct .env file and .secret file.\n\n', err);
  throw "please make a .secret file in off-chain oracle folder and provide the mnemonic in this file.";
}
const web3 = new Web3(provider);
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACT_ADDRESS;
const contract = web3.eth.contract(abi).at(address);

const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
        resolve(accounts[process.env.ACCOUNT_NUMBER]);
      } else {
        reject(err);
      }
    });
  });
};

export const createRequest = ({ urlToQuery, attributeToFetch }) => {
  return new Promise((resolve, reject) => {
    account()
      .then((account) => {
        contract.createRequest(
          urlToQuery,
          attributeToFetch,
          {
            from: account,
          },
          (err, res) => {
            if (err === null) {
              resolve(res);
            } else {
              reject(err);
            }
          }
        );
      })
      .catch((error) => reject(error));
  });
};

export const updateRequest = ({ id, valueRetrieved }) => {
  return new Promise((resolve, reject) => {
    account()
      .then((account) => {
        console.log(
          "Sending this value to block chain: id:",
          id,
          ", value:",
          valueRetrieved
        );
        contract.updateRequest(
          id,
          "" + valueRetrieved,
          {
            from: account,
            gas: 1000000,
            gasPrice: web3.toWei(2, "gwei"),
          },
          (err, res) => {
            console.log("account: " + account);
            console.log("transaction id: " + res);
            if (err === null) {
              resolve(res);
            } else {
              reject(err);
            }
          }
        );
      })
      .catch((error) => reject(error));
  });
};

//new request event emitted to get data on block chain from internet oracle nodes
export const newRequestEvent = (callback) => {
  contract.NewRequest((error, result) => callback(error, result));
};

//when consensus is done request is updated
export const updateRequestEvent = (callback) => {
  contract.UpdatedRequest((error, result) => callback(error, result));
};
export const toWei = (data) => web3.toWei(data);
