import asyncio
import websockets
import json
import time
import tarfile
import os
import requests
import io
import subprocess

from config import Config
import device
import iot


program_process = None

async def stats(ws):
    while True:
        st = time.time()
        await ws.send(json.dumps(iot.stats_data()))
        sleep_time = 1 - (time.time() - st)
        await asyncio.sleep(max(0, sleep_time))

def download_program_data(url, program_path, bitstream_path):
    print(url)
    os.system("rm -rf /tmp/*.bin /tmp/*.elf")
    os.system("wget -O /tmp/download.tar.gz {}".format(url))
    os.system("tar -xvf /tmp/download.tar.gz -C /tmp")
    os.system("mv /tmp/$(ls /tmp | grep '.bin$') {}".format(bitstream_path))
    os.system("mv /tmp/$(ls /tmp | grep '.elf$') {}".format(program_path))
    return True

def flash_bitstream(bitstream_path):
    os.system("cp {} /lib/firmware/bitstream.bin".format(bitstream_path))
    os.system("echo 0 > /sys/class/fpga_manager/fpga0/flags")
    os.system("echo bitstream.bin > /sys/class/fpga_manager/fpga0/firmware")
    return True

async def recv(ws):
    loop = asyncio.get_event_loop()
    while True:
        data = json.loads(await ws.recv())
        rpc = data['rpc']

        if rpc == 'flash':
            stop_program()

            tar_path = data['url']
            ok = await loop.run_in_executor(
                    None, 
                    download_program_data, 
                    tar_path, 
                    '/tmp/program.elf', 
                    '/tmp/bitstream.bin')

            if not ok:
                await ws.send(json.dumps(iot.status("tarball_failure")))
                continue

            ok = await loop.run_in_executor(
                    None,
                    flash_bitstream,
                    '/tmp/bitstream.bin')

            if not ok:
                await ws.send(json.dumps(iot.status("flash_failure")))
                continue

            run_program('/tmp/program.elf')
            await ws.send(json.dumps(iot.status("program_started")))

            
        elif rpc == 'reboot':
            pass
        else:
            continue

def get_program_output(process):
    return process.stdout.readline().decode('utf-8')

async def program_output(ws):
    global program_process

    while True:
        if program_process is None:
            await asyncio.sleep(0.1)
            continue
        
        poll = program_process.poll()
        if poll is not None:
            stdout, _ = program_process.communicate()
            await ws.send(json.dumps(iot.program_output(stdout.decode('utf-8'))))
            await ws.send(json.dumps(iot.program_done(poll)))
            program_process = None
            await ws.send(json.dumps(iot.status("online")))
            continue
               
        stdout = await loop.run_in_executor(
                None, 
                get_program_output, 
                program_process)
            
        await ws.send(json.dumps(iot.program_output(stdout)))


def stop_program():
    global program_process
    if program_process is not None:
        program_process.kill()
        program_process = None


def run_program(program_path):
    global program_process
    program_process = subprocess.Popen([program_path], stdout=subprocess.PIPE)

async def init(conf):
    async with websockets.connect(conf.WS_SERVER) as ws:

        device_id = iot.get_device_id(conf.DEVICE_ID_FILE)

        registration_data = iot.registration_data(
                id=device_id,
                model=conf.DEVICE_MODEL,
                cpu_cores=device.cpu_cores(),
                memory=device.memory_total())

        await ws.send(json.dumps(registration_data))

        reg_recv = json.loads(await ws.recv())
        
        if device_id is None:
            iot.save_device_id(reg_recv['device_id'], conf.DEVICE_ID_FILE)
        await ws.send(json.dumps(iot.status("online")))
        stats_task = asyncio.ensure_future(
                stats(ws))

        recv_task = asyncio.ensure_future(
                recv(ws))

        program_output_task = asyncio.ensure_future(
                program_output(ws))

        await asyncio.gather(
                stats_task,
                recv_task,
                program_output_task)


if __name__ == '__main__':
    conf = Config()
    try:
        asyncio.get_event_loop().run_until_complete(init(conf))
    except KeyboardInterrupt:
        pass
