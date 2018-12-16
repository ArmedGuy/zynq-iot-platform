#!/usr/bin/env python

import asyncio
import websockets
import json

ws = None

async def send_stuff():
    global ws
    await asyncio.sleep(10)
    while True:
        print("Sending stuff")
        await ws.send(json.dumps({
            "rpc": "stats",
            "stats": {
                "cpu": 30,
                "ram": 12,
                "net_up": 2,
                "net_down": 16
            }
        }))
        await ws.send(json.dumps({
            "rpc": "output",
            "output": {
                "stdout": "KASDJASDJASD",
                "stderr": ""
            }
        }))
        await ws.send(json.dumps({
            "rpc": "status",
            "status": "online"
        }))
        await asyncio.sleep(30)

async def controller(uri):
    global ws
    async with websockets.connect(uri) as websocket:
        print("connected, sending!")
        ws = websocket
        await websocket.send(json.dumps({
            "rpc": "register",
            "data": {
                "id": "5c1661657f7d235160689d23",
                "model": "Zynq 700 Swag",
                "cpu": 8,
                "ram": 2048,
                "status": "online"
            }
        }))
        print("sent, awaiting response!")
        register_response = await websocket.recv()
        print("this is response", register_response)
        while True:
            msg = json.loads(await websocket.recv())
            print(msg)

asyncio.get_event_loop().run_until_complete(
    asyncio.gather(
        controller('ws://localhost:5000'),
        send_stuff()
    )
)