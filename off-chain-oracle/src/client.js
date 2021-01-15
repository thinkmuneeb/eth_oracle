require("dotenv").config();

import { createRequest } from "./ethereum";

const start = () => {
  let ethAddressToQuery = "0xD06777d9b02F677214073cC3C5338904CBa7894a";
  let attributeToFetch = "bird_rating";

  createRequest({
    urlToQuery: ethAddressToQuery,
    attributeToFetch,
  })
    .then(restart)
    .catch(error);
};

const restart = () => {
  wait(process.env.TIMEOUT).then(start).catch(console.log("wait..."));
};

const wait = (milliseconds) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(), milliseconds)
  );
};

const error = (error) => {
  console.error(error);
  restart();
};

export default start;
