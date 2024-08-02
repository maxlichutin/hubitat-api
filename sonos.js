import { DeviceDiscovery } from "sonos";
import { broadcast } from "./wss_ssl.js";

let cashedState = {
  devices: [],
  groups: [],
};

function startSonos() {
  DeviceDiscovery((device) => {
    // Save each device ID
    let deviceExist = cashedState.devices.find((obj) => {
      return obj.host === device.host;
    });
    if (!deviceExist) {
      cashedState.devices.push({
        host: device.host,
        port: device.port,
      });
    }

    device.getAllGroups().then((groups) => {
      groups.forEach((group) => {
        // Save each group
        let groupExist = cashedState.groups.find((obj) => {
          return obj.host === group.host;
        });

        if (!groupExist) {
          cashedState.groups.push({
            host: group.host,
            port: group.port,
            name: group.Name,
            state: {},
          });
        }
      });
    });

    device.on("PlayState", (data) => {
      let group = cashedState.groups.find((obj) => {
        return obj.host === device.host;
      });
      group.state.playState = data;

      broadcast(
        JSON.stringify({
          messageType: `sonos`,
          data: cashedState,
        })
      );
    });

    device.on("Volume", (data) => {
      let group = cashedState.groups.find((obj) => {
        return obj.host === device.host;
      });
      group.state.volume = data;
      broadcast(
        JSON.stringify({
          messageType: `sonos`,
          data: cashedState,
        })
      );
    });

    device.on("CurrentTrack", (data) => {
      let group = cashedState.groups.find((obj) => {
        return obj.host === device.host;
      });
      let track = {
        title: data.title,
        artist: data.artist,
        album: data.album,
        albumArtist: data.albumArtist,
        albumArtURI: data.albumArtURI,
        duration: data.duration,
        queuePosition: data.queuePosition,
      };
      group.state.track = track;
      broadcast(
        JSON.stringify({
          messageType: `sonos`,
          data: cashedState,
        })
      );
    });
  });
}

export { startSonos as startSonos };
