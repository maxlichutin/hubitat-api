# hubitat-api
Communicate with Hubitat Elevation, Hikvision, and Sonos via WebSocket. 

https://hubitat.com

## Features: 
HUBITAT
    - Get device status 
    - Get rooms 
    - Live status update over WS
    - Control devices over WS
    - Heartbeat monitor

HIKVISION
    - liveVideo
    - Event Alerts

 SONOS
    - TBD 

### Set your pin, key and ports in .ENV 
```
HTTP_PORT=
WS_PORT=
PIN=
JWT_SECRET=
HUBITAT_KEY = 
HUBITAT_API =
```
### Your Hubitat Hub should POST device events to:
``` http://SERVER_IP:HTTP_PORT/device-status```

### Use this endpoint to exchnage your pin for a JWT.
```
POST /get-access
```
Body
pin (Integer, Required)
```
{
  "pin": Number
}
```

Success Response\ 
Status Code: 200 OK\ 
Content Type: application/json
```
{
  "status": "success",
  "message": "Access granted successfully."
  "jwt": "JWT..."
}
```

Bad Request\
Status Code: 400 Bad Request\
Content Type: application/json
```
{
  "status": "error",
  "message": "Invalid PIN. Please provide a valid PIN."
}

```
### Start new WS connection using your JWT
```ws://SERVER_IP:WS_PORT?token=JWT```

### Get devices
There are 3 message types send over WS (messageType):\

A list of devices (dispatched on initial connection)
```
{
    messageType: "hubitatInitial",
    data: ...,
}
```
Device status change (on, off, temperature, etc)
```
{
    messageType: "hubitatUpdate",
    data: ...,
}
```
A list of devices (sent periodically)
```
{
    messageType: "hubitatHeartbeat",
    data: ...,
}
```

### Send commands over WS:
```
ws.send({
    id: {device id},
    command: {on, off, setLevel, ...},
    secondaryValue: {optional},
})
```


### COPY to Ubuntu
```
scp -r  ~/Documents/github/hubitat-api/* ubuntu@10.0.1.38:/var/www/hubitat-api
```

## START PROCESS MANAGER FOR NODE.JS
https://pm2.keymetrics.io
```
sudo pm2 start index.js 
```
```
sudo pm2 status
```


## TEST FFMPEG ON SERVER
```
ffmpeg -i "rtsp://${ip}:554/ISAPI/streaming/channels/101?auth=${auth}" -s 640x480 "out.jpg"

ffprobe -show_streams -i "rtsp://${ip}:554/ISAPI/streaming/channels/101?auth=${auth}" -print_format "json"

```
