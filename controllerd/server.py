#!/usr/bin/env python

import asyncio
import websockets
import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.iot_platform
stats_c = db.stats
devices_c = db.devices
output_c = db.output

def register(websocket, data):
    if data["id"] is None:
        data["id"] = devices_c.insert_one(data).inserted_id
    else:
        devices_c.update({"_id": data["id"]}, data)
    websocket._device_id = data["id"]
    print("registered device {}".format(data["id"]))
    await websocket.send(json.dumps({"status": "OK", "device_id": websocket._device_id}))

def stats(websocket, stats):
    stats["device_id"] = websocket._device_id
    stats_c.update({"device_id": websocket._device_id}, stats, upsert=True)

def output(websocket, output):
    output["device_id"] = websocket._device_id
    output_c.update({"device_id": websocket._device_id}, output, upsert=True)


async def handle(websocket, path):
    async for message in websocket:
        print(message)
        decoded = json.loads(message)
        if decoded["rpc"] == "ping":
            websocket.send(json.dumps({"rpc": "pong"}))
        elif decoded["rpc"] == "stats":
            stats(websocket, decoded["stats"])
        elif decoded["rpc"] == "register":
            register(websocket, decoded["data"])
        elif decoded["rpc"] == "output":
            output(websocket, decoded["output"])
        else:
            pass

asyncio.get_event_loop().run_until_complete(
    websockets.serve(handle, '0.0.0.0', 8765))
asyncio.get_event_loop().run_forever()