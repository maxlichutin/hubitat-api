# hubitat-api
Communicate with Hubitat Elevation via WebSocket. https://hubitat.com

## Features: 
    - Get device status 
    - Get rooms 
    - Live status update over WS
    - Control devices over WS
    - Heartbeat monitor

### Set your pin, key and ports in .ENV 
```
HTTP_PORT=
WS_PORT=
PIN=
JWT_SECRET=
HUBITAT_KEY = 
```
### Your Hubitat should POST device events to
``` http://SERVER_IP:HTTP_PORT/device-status```

### Use this endpoint to exchnage your pin for a JWT.
```
POST /get-access
```
Body
pin (integer, required)
```
{
  "pin": 1234
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
