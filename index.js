// import { startWSS, broadcast } from "./wss.js";
// import { startExpress } from "./express.js";
import { startWSS, broadcast } from "./wss_ssl.js";
import { startExpress } from "./express_ssl.js";
import { startHeartbeat } from "./heartbeat.js";
import { liveVideo, alerts } from "./hikvision_live.js";
import { startSonos } from "./sonos.js";

// START EXPRESS
startExpress();

// START WS
startWSS();

// START PERIODIC UPDATES
startHeartbeat();

// START LIVE STREAM
// liveVideo("10.0.1.102", "640x360", 10);
// liveVideo("10.0.1.103", "640x360", 10);
// liveVideo("10.0.1.104", "640x360", 10);

// WATCH HIKVISION EVENTS
alerts("10.0.1.102", "Gate")
alerts("10.0.1.103", "Porch")
alerts("10.0.1.104", "Driveway")

// START SONOS
startSonos()