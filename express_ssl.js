import express from "express";
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/lichutin.net/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/lichutin.net/fullchain.pem"),
};

const app = express();
const router = express.Router();

import cors from "cors";
app.use(cors());

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { generateAccessToken } from "./jwt.js";
import { broadcast } from "./wss.js";


async function startExpress() {
  // DEVICE STATUS CHANGE POST FROM HUB
  router.post("/device-status", cors(), function (req, res) {
    let query = req.query || "";
    let headers = req.headers || {};
    let body = req.body || {};
    res.status(400).send("ok");

    let data = {
      messageType: "hubitatUpdate",
      data: body,
    };
    broadcast(data);
  });

  // GET ACCESS
  router.post("/get-access", cors(), function (req, res) {
    //   let query = req.query || "";
    let headers = req.headers || {};
    let body = req.body || {};

    if (process.env.PIN === body.pin) {
      let result = {
        status: "success",
        message: "Access granted successfully.",
        jwt: generateAccessToken(headers.origin),
      };
      res.status(200).send(result);
    } else {
      let result = {
        status: "error",
        message: "Invalid PIN. Please provide a valid PIN.",
      };
      res.status(400).send(result);
    }
  });

  // Add JSON support for POST requests (req.body, etc)
  app.use(express.json());
  // Add the router
  app.use("/", router);

  // Listen
  https.createServer(options, app).listen(process.env.HTTP_PORT || 8000);
  console.log(`Running at Port ${process.env.HTTP_PORT || 8000}`);
}

export { startExpress as startExpress };
