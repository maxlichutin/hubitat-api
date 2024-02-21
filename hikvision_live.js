import { HikvisionAlerts, HikvisionStream } from "./hikvision.js";
// import { broadcast } from "./wss.js";
import { broadcast } from "./wss_ssl.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function liveVideo(ip, resolution) {
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

async function alerts(ip, label) {
  const options = {
    label: label.toLower() || ip,
    ip: ip,
    port: 80,
    user: process.env.CAM_USER,
    pass: process.env.CAM_PASS,
  };

  let ipCamAlerts = new HikvisionAlerts(options);
  ipCamAlerts.alertStream.on("statusChange", function (data) {
    let payload = JSON.stringify({
      messageType: `hikvision-status-${label}`,
      data: data,
    });
    broadcast(payload);
  });

  ipCamAlerts.alertStream.on("alert", function (data) {
    let payload = JSON.stringify({
      messageType: `hikvision-alert-${label}`,
      data: data,
    });
  });
}

export { liveVideo as liveVideo };
export { alerts as alerts };
