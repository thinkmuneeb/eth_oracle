import startOracle from "./oracle";
import startOnchainEventsLog from "./consumer";
import startClient from "./client";

startOracle();
startOnchainEventsLog();
startClient();
