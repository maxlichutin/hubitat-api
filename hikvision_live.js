import { HikvisionAlerts, HikvisionStream } from "./hikvision.js";
import { broadcast } from "./wss_ssl.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function broadcastLive(ip, resolution) {
  const options = {
    ip: ip,
    port: 554,
    channel: 101,
    resolution: resolution || "640x360",
    user: process.env.CAM_USER,
    pass: process.env.CAM_PASS,
  };

  let ipCamRtsp = new HikvisionStream(options);
  ipCamRtsp.alertStream.on("data", function (chunk) {
    let payload = JSON.stringify({
      messageType: `live-video-${ip}`,
      data: chunk.toString("base64"),
    });
    broadcast(payload);
  });
}

export { broadcastLive as broadcastLive };
