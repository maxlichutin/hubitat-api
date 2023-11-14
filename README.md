# hubitat-api

Communicate with Hubitat Elevation via WebSocket.
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
POST: /get-access
BODY: { pin: 1234 }
```
### Start new WS connection using your JWT
```ws://ip:port?token=jwt```

### Features: 
    - Get devic status 
    - Get a list of rooms 
    - Live triggers 
    - Heartbeat monitor
    - Control devices over WS

### Send commands:
```
ws.send({
    id: {device id},
    command: {on, off, setLevel, ...},
    secondaryValue: {optional},
})
```
