#!/usr/bin/env python

import asyncio
import websockets
import json

ws = None

async def send_stuff():
    while True:
        await websocket.send(json.dumps({
            "rpc": "stats",
            "stats": {
                "cpu": 30,
                "ram": 200
            }
        }))
        await websocket.send(json.dumps({
            "rpc": "output",
            "output": {
                "stdout": "KASDJASDJASD",
                "stderr": ""
            }
        }))
        asyncio.sleep(30)

async def controller(uri):
    async with websockets.connect(uri) as websocket:
        print("connected, sending!")
        ws = websocket
        await websocket.send(json.dumps({
            "rpc": "register",
            "data": {
                "id": None,
                "model": "Zynq 700 Swag",
                "cpu": 2,
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
        controller('ws://localhost:8765'),
        send_stuff()
    )