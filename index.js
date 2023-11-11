import cors from "cors";
import express from "express";
const app = express();
const router = express.Router();
import path from "path";
import dotenv from "dotenv";
app.use(cors());
dotenv.config({ path: "./.env" });

import {startWSS, broadcast} from "./wss.js";
import {startHeartbeat} from "./heartbeat.js";
import { generateAccessToken, verifyAccessToken } from "./jwt.js";

// START WS
startWSS();

// START PERIODIC UPDATES
startHeartbeat();

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
  broadcast(data)
});

// GET ACCESS
router.post("/get-access", cors(), function (req, res) {
  //   let query = req.query || "";
  let headers = req.headers || {};
  let body = req.body || {};

  if (process.env.PIN === body.pin) {
    let result = {
      status: "success",
      jwt: generateAccessToken(headers.origin),
    };
    res.status(200).send(result);
  } else {
    let result = {
      status: "error",
    };
    res.status(400).send(result);
  }
});


// // STATIC HTML
// router.get("/static", function (req, res) {
//   res.sendFile(path.join(__dirname + "/static.html"));
// });

// // REGEX "/butterfly" and "/dragonfly"
// router.get(/.*fly$/, (req, res) => {
//     res.send(req.url)
// })

// // ROUTER PARAMS
// router.get('/users/:userId/books/:bookId', (req, res) => {
//     res.send(req.params)
// })

// Add JSON support for POST requests (req.body, etc)
app.use(express.json());
// Add the router
app.use("/", router);
// Listen
app.listen(process.env.HTTP_PORT || 8000);
console.log(`Running at Port ${process.env.HTTP_PORT || 8000}`);
