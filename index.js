import { startWSS, broadcast } from "./wss.js";
import { startHeartbeat } from "./heartbeat.js";
// import { startExpress } from "./express.js";
import { startExpress } from "./express_ssl.js";

// START EXPRESS
startExpress();

// START WS
startWSS();

// START PERIODIC UPDATES
startHeartbeat();