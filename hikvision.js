import net from "net";
import events from "events";
import {parseString} from "xml2js";
import rtsp from "rtsp-ffmpeg";

/// *** ALERTS ***
// API DOCUMENTATION: https://tpp.hikvision.com/Wiki/ISAPI/Access%20Control%20on%20Person/GUID-6144822A-26D3-40AE-925B-24F75F847006.html

class HikvisionAlerts {
  constructor(options) {
    // set an emitter
    this.alertStream = new events.EventEmitter();

    // set heartbeat
    this.healthIntervalMs = 5000;
    this.heartbeat = () => {
      setInterval(() => {
        let now = new Date();
        let differenceMs = now - this.lastheartbeat;
        let online = differenceMs < this.healthIntervalMs * 2 ? true : false; // considered offline if last two hartbeats were missed
        let status = online ? "online" : "offline";
        if (this.cameraOnline !== online) {
          this.alertStream.emit("statusChange", {
            ip: options.ip,
            label: options.label,
            status: status,
          });
        }
        // save new online value
        this.cameraOnline = online;
      }, this.healthIntervalMs);
    };
    this.lastheartbeat = "";
    this.cameraOnline = false;

    this.connect = function (options) {
      // Start heartbeat
      this.heartbeat();

      // Connect
      let authHeader =
        "Authorization: Basic " +
        Buffer.from(options.user + ":" + options.pass).toString("base64");

      let client = net.connect({ host: options.ip, port: options.port }, () => {
        let header =
          "GET /ISAPI/Event/notification/alertStream HTTP/1.1\r\n" +
          "Host: " +
          options.ip +
          ":" +
          options.port +
          "\r\n" +
          authHeader +
          "\r\n" +
          "Accept: multipart/x-mixed-replace\r\n\r\n";
        client.write(header);
        client.setKeepAlive(true, 1000);
      });

      client.on("close", () => {
        this.alertStream.emit("statusChange", {
          ip: options.ip,
          label: options.label,
          status: "disconected",
        });
        // reconnect
        try {
          setTimeout(() => {
            this.connect(options);
            this.alertStream.emit("statusChange", {
              ip: options.ip,
              label: options.label,
              status: "reconnecting",
            });
          }, 10000);
        } catch (error) {
          this.alertStream.emit("statusChange", {
            ip: options.ip,
            label: options.label,
            status: "failedToReconnect",
          });
        }
      });

      client.on("error", () => {
        this.alertStream.emit("statusChange", {
          ip: options.ip,
          label: options.label,
          status: "connectionError",
        });
      });

      client.on("data", (data) => {
        let parseOptions = {
          strict: false,
          normalizeTags: true,
        };

        parseString(data, parseOptions, (err, result) => {
          if (result) {
            let notification = result["eventnotificationalert"] || null;
            if (notification) {
              /*
            <EventNotificationAlert version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
                <ipv6Address><!--dep, xs:string, device IPv6 address--></ipv6Address>
                <portNo><!--opt, xs:integer, device port number--></portNo>
                <protocol><!--opt, xs:string, protocol type for uploading alarm/event information, "HTTP,HTTPS"--></protocol>
                <macAddress><!--opt, xs:string, MAC address--></macAddress>
                <channelID><!--dep, xs:string, device channel No., starts from 1--></channelID>
                <dateTime><!--req, heartbeat uploaded time, format: 2017-07-19T10:06:41+08:00--></dateTime>
                <activePostCount><!--req, xs:integer, heartbeat frequency, starts from 1--></activePostCount>
                <eventType><!--req, xs:string, for heartbeat, it is "videoloss"--></eventType>
                <eventState>
                  <!--req, xs:string, for heartbeat, it is "inactive"-->
                </eventState>
                <eventDescription><!--req, xs: string, description--></eventDescription>
            </EventNotificationAlert>
            */

              let label = options.label || "IP Camera";
              let channelId = notification["channelid"][0] || "";
              let datetime = notification["datetime"][0] || "";
              let activePostCount = notification["activepostcount"][0] || "";
              let eventType = notification["eventtype"][0] || "";
              let eventState = notification["eventstate"][0] || "";
              let eventDescription = notification["eventdescription"][0] || "";
              let detectionRegionList =
                typeof notification["detectionregionlist"] === "object"
                  ? notification["detectionregionlist"]
                  : [];

              let data = {
                label: label,
                channelId: channelId,
                datetime: datetime,
                activePostCount: activePostCount,
                eventType: eventType,
                eventState: eventState,
                eventDescription: eventDescription,
                detectionRegionList: detectionRegionList,
              };

              // set heartbeat
              let date = datetime.split("T")[0];
              let time = datetime.split("T")[1].replace("-", "-0");
              this.lastheartbeat = new Date(`${date}T${time}`);

              // ignore heartbeat message and send status only
              if (eventType !== "videoloss" && eventState !== "inactive") {
                this.alertStream.emit("alert", data);
              }
            }
          }
        });
      });
    };

    this.client = this.connect(options);
  }
}

// *** STREAM RTSP ***
class HikvisionStream {
  constructor(options) {
    let auth = Buffer.from(options.user + ":" + options.pass).toString(
      "base64"
    );

    // set an emitter
    this.alertStream = new events.EventEmitter();
    this.connect = function (options) {
      let stream = new rtsp.FFMpeg({
        input: `rtsp://${options.ip}:${options.port}/ISAPI/streaming/channels/${options.channel}?auth=${auth}`,
        resolution: options.resolution,
      });

      stream.on("data", (chunk) => {
        this.alertStream.emit("data", chunk);
      });
    };
    this.client = this.connect(options);
  }
}

export { HikvisionAlerts as HikvisionAlerts };
export { HikvisionStream as HikvisionStream };