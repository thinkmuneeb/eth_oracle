import startOracle from "./oracle";
import onChainEventsListener from "./consumer";
import startClient from "./client";

startOracle();
onChainEventsListener();
startClient();
