import subprocess

import device

def registration_data(id=None, model="", cpu_cores=2, memory=2048):
    return {
            "rpc": "register",
            "data": {
                "id": id,
                "model": model,
                "cpu": cpu_cores,
                "ram": memory
            }
    }

def save_device_id(dev_id, location):
    with open(location, 'w') as f:
        f.write(dev_id)

def get_device_id(location):
    ret = None 
    try:
        with open(location, 'r') as f:
            ret = f.read().strip()
    except FileNotFoundError:
        pass

    return ret

def stats_data():
    return {
            "rpc": "stats",
            "stats": {
                "cpu": device.cpu_usage(),
                "ram": device.memory_usage(),
                "net_in": 0,
                "net_out": 0
            }
    }

def status(stat):
    return {
            "rpc": "status",
            "status": stat,
    }

def program_output(stdout):
    return {
            "rpc": "output",
            "output": {
                "stdout": stdout
            }
    }

def program_done(status):
    return {
            "rpc": "program_done",
            "status": status
    }


def flash_bitstream(bitstream_path):
   pass 

