import dotenv from "dotenv";
import axios from "axios";
dotenv.config({ path: "./.env" });

async function getRooms() {
  let url = `http://10.0.1.250/apps/api/7/devices/all?access_token=${process.env.HUBITAT_KEY}`;
  try {
    let headers = {
      headers: {},
    };
    let response = await axios.get(url, headers).then((response) => {
      return response.data;
    });

    let rooms = [];
    response.forEach((device) => {
      if (rooms.indexOf(device.room) < 0) {
        rooms.push(device.room);
      }
    });
    return rooms;
  } catch (error) {
    return error;
  }
}

async function getDevices() {
  let url = `http://10.0.1.250/apps/api/7/devices/all?access_token=${process.env.HUBITAT_KEY}`;
  try {
    let headers = {
      headers: {},
    };
    let response = await axios.get(url, headers).then((response) => {
      return response.data;
    });
    return response;
  } catch (error) {
    return error;
  }
}
async function sendCommand(deviceId, command, secondaryValue) {
  secondaryValue = secondaryValue ? `/${secondaryValue}` : "";

  let url = `http://10.0.1.250/apps/api/7/devices/${deviceId}/${command}${secondaryValue}?access_token=${process.env.HUBITAT_KEY}`;

  try {
    let headers = {
      headers: {},
    };
    let response = await axios.get(url, headers).then((response) => {
      return response.data;
    });
    console.log(response);
    return response;
  } catch (error) {
    return error;
  }
}

export { getRooms as getRooms };
export { getDevices as getDevices };
export { sendCommand as sendCommand };
