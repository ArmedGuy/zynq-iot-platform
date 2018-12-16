#!/usr/bin/env python

import asyncio
import websockets
import json
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb://130.240.200.99:27017/")
db = client.iot_platform
stats_c = db.stats
devices_c = db.devices
output_c = db.output
files_c = db.files

async def register(websocket, data):
    device_id = data["id"]
    del data["id"]
    if device_id is None:
        device_id = devices_c.insert_one(data).inserted_id
    else:
        print("registering existing device!")
        print(data)
        devices_c.update({"_id": ObjectId(device_id)}, {"$set": data})
    websocket._device_id = str(device_id)
    print("registered device {}".format(device_id))
    await websocket.send(json.dumps({"status": "OK", "device_id": websocket._device_id}))

async def stats(websocket, stats):
    stats["device_id"] = websocket._device_id
    print("got stats for {}".format(stats["device_id"]))
    stats_c.update({"device_id": websocket._device_id}, stats, upsert=True)

async def output(websocket, output):
    output["device_id"] = websocket._device_id
    print("got output for {}".format(output["device_id"]))
    output_c.update({"device_id": websocket._device_id}, output, upsert=True)

async def status(websocket, status):
    print("got status for {}, is now {}".format(str(websocket._device_id), status))
    devices_c.update({"_id": ObjectId(websocket._device_id)}, {"$set": {"status": status}})

async def do_stuff_timer():
    while True:
        queued = devices_c.find({"status": "flash_queued"})
        for device in queued:
            devices_c.update({"_id": device["_id"]}, {"$set": {"status": "flashing"}})
            await wslist[str(device['_id'])].send(json.dumps({"rpc": "flash", "url": "http://130.240.200.99/api/file/" + str(device["_id"]) + ".tar.gz"}))
        await asyncio.sleep(10)
    pass

wslist = {}
async def handle(websocket, path):
    async for message in websocket:
        print(message)
        decoded = json.loads(message)
        if decoded["rpc"] == "stats":
            await stats(websocket, decoded["stats"])
        elif decoded["rpc"] == "register":
            await register(websocket, decoded["data"])
            wslist[str(websocket._device_id)] = websocket
        elif decoded["rpc"] == "output":
            await output(websocket, decoded["output"])
        elif decoded["rpc"] == "status":
            await status(websocket, decoded["status"])
        else:
            pass

try:
    print("starting server!")
    asyncio.get_event_loop().run_until_complete(
        asyncio.gather(
            websockets.serve(handle, '0.0.0.0', 5000), 
            do_stuff_timer()
        )
    )
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Exiting")
