import { HikvisionAlerts, HikvisionStream } from "./hikvision.js";
// import { broadcast } from "./wss.js";
import { broadcast } from "./wss_ssl.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function liveVideo(ip, resolution, nthFrame) {
  nthFrame = nthFrame || 10;
  let frameNum = 0;

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
    frameNum++;
    if (frameNum === nthFrame) {
      let payload = JSON.stringify({
        messageType: `hikvisionLiveVideoFrame`,
        data: {
          ip: ip,
          data: chunk.toString("base64"),
        },
      });
      broadcast(payload);
      frameNum = 0;
    }
  });
}

async function alerts(ip, label) {
  label = label.toLowerCase() || ip;

  const options = {
    label: label,
    ip: ip,
    port: 80,
    user: process.env.CAM_USER,
    pass: process.env.CAM_PASS,
  };

  let ipCamAlerts = new HikvisionAlerts(options);
  ipCamAlerts.alertStream.on("statusChange", function (data) {
    let payload = JSON.stringify({
      messageType: `hikvisionStatus`,
      data: {
        ip: ip,
        data: data,
      },
    });
    broadcast(payload);
  });

  ipCamAlerts.alertStream.on("alert", function (data) {
    let payload = JSON.stringify({
      messageType: `hikvisionAlert`,
      data: {
        ip: ip,
        data: data,
      },
    });
    broadcast(payload);
  });
}

export { liveVideo as liveVideo };
export { alerts as alerts };
