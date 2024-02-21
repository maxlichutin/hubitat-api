// import { startWSS, broadcast } from "./wss.js";
// import { startExpress } from "./express.js";
import { startWSS, broadcast } from "./wss_ssl.js";
import { startExpress } from "./express_ssl.js";
import { startHeartbeat } from "./heartbeat.js";
import { broadcastLive } from "./hikvision_live.js";

// START EXPRESS
startExpress();

// START WS
startWSS();

// START PERIODIC UPDATES
startHeartbeat();

// START LIVE STREAM
broadcastLive("10.0.1.103", "640x360");
broadcastLive("10.0.1.104", "640x360");