#!/usr/bin/env python

import asyncio
import websockets
import json

async def controller(uri):
    async with websockets.connect(uri) as websocket:
        print("connected, sending!")
        await websocket.send(json.dumps({
            "rpc": "register",
            "data": {
                "id": "bla",
                "model": "bla",
                "cpus": 2,
                "ram": 2048
            }
        }))
        print("sent, awaiting response!")
        register_response = await websocket.recv()
        print("this is response", register_response)

asyncio.get_event_loop().run_until_complete(
    controller('ws://localhost:8765'))