# hubitat-api

Communicate with Hubitat Elevation via WebSocket.

Use /get-access endpoint to exchnage your pin for a JWT
``` { pin: 1234 }```
Start new WS connection using your JWT
```ws://ip:port?token=jwt```

Features: 
    - Get devices 
    - Live triggers 
    - Heartbeat monitor

Send commands:
```
ws.send({
    id: {device id},
    command: {on, off, setLevel, ...},
    secondaryValue: {optional},
})
```
