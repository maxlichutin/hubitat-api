// HEARTBEAT
import { getDevices } from "./hubitat.js";
// import { broadcast } from "./wss.js";
import { broadcast } from "./wss_ssl.js";

async function heartbeat() {
  let data = {
    messageType: "hubitatHeartbeat",
    data: await getDevices(),
  };
  broadcast(data);
}

function startHeartbeat() {
    heartbeat()
    setTimeout(()=>{
        startHeartbeat()
    }, 15000)
}
export { startHeartbeat as startHeartbeat };
