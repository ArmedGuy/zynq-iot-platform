import multiprocessing
import psutil

def cpu_cores():
    return multiprocessing.cpu_count()

def memory_total():
    return psutil.virtual_memory().total / (1024**2)

def memory_used():
    return psutil.virtual_memory().used / (1024**2)

def memory_usage():
    return psutil.virtual_memory().percent 

def cpu_usage():
    return psutil.cpu_percent(interval=1)
    
