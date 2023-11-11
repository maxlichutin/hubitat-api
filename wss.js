import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ server });

import url from "url";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { generateAccessToken, verifyAccessToken } from "./jwt.js";
import { getRooms, getDevices } from "./hubitat.js";

async function initNewConnection(ws, req) {
  // JWT
  const token = url.parse(req.url, true).query.token;
  let JWT = await verifyAccessToken(token);
  if (!JWT) {
    ws.close();
    console.log(`Token validation failed`);
    return;
  }
  // Add message listener to new WS connection.
  ws.on("message", function (message) {
    incomingMessage(message, this);
  });

  // Add session close listener to new WS connection.
  ws.on("close", function (data) {
    clientDropped(data);
  });

  // Display message to the connected client
  let clientData = {
    messageType: "status",
    data: "Connection established",
    connections: wss.clients.size,
  };
  sendToClient(clientData, ws);

  // Send Hubitat initial reading
  const initialHubitat = await getDevices();

  clientData = {
    messageType: "hubitatInitial",
    data: initialHubitat,
  };
  sendToClient(clientData, ws);
}

// START WSS
function startWSS() {
  // Start WS Connection
  wss.on("connection", function connection(ws, req) {
    initNewConnection(ws, req);
  });

  server.listen(process.env.WS_PORT || 3000, () => {
    console.log(`WS started on port ${server.address().port}`);
  });
}


// BROADCAST
async function broadcast(data, includeSelf, self) {
  includeSelf = includeSelf || false;
  let payload = JSON.stringify(data);
  const openState = wss.options.WebSocket.OPEN;

  wss.clients.forEach(function each(client) {
    if (client.readyState === openState) {
      client.send(payload);
    }
  });
}

// SEND MESSAGE TO A SPECIFIC CLIENT
async function sendToClient(data, client) {
  let payload = JSON.stringify(data);
  client.send(payload);
}

// INCOMING MESSAGE FROM ANY CLIENT
async function incomingMessage(data, sender) {
  let payload = JSON.parse(data);

  // do something with data....
  // ...
  console.log(payload);
}

// CLIENT DISCONECTED
async function clientDropped(data) {
//   console.log(`Client disconnected.`);
}

export { startWSS as startWSS };
export { broadcast as broadcast };
