# zynq-iot-platform
The Zynq IoT Platform consists of several different applications that work together.

### fpga-app
The fpga-app directory contains the frontend application and web API for the IoT platform.
It is responsible for displaying device data and present controls to the user.

##### Building the web API.
Browse to the fpga-app folder, set GOPATH to the current folder.
Then run `go get` to fetch all dependencies, then run go build to build the server.

##### Building the frontend app
In the fpga-app folder, run `npm install` to install dependencies (you need npm and nodejs).
To build for release, run `npm run build`, and copy the contents of the build folder (that appears) into a folder exposed by a web server.


### controllerd
Controllerd is responsible for keeping connections with IoT devices. It exposes a webserver that talks using websockets.

##### Running controllerd
Install the dependencies by running `pip3 install -r requirements.txt`, then run the application with `python3 server.py`.
A dummy client is included with the controllerd for testing purposes.

### agentd
Agentd is ran on IoT devices and is responsible for flashing programmable logic, sending statistics and program output, and starting applications.
It is installed on an IoT device by dropping the files in an appropriate directory, and running `python3 install -r requirements.txt`.

## Installing an IoT device to connect to the platform
Two binares are included in the binaries folder.
`Image` is a precompiled Linux 4.9 kernel image based on Xilinx Linux, with the xlnk-apf kernel module.
`system.dtb` is a device tree for Avnet:s Ultra96 development board with the xlnk device added.

Together they enable an Avnet Ultra96 board to run Xilinx SDSoC applications compiled for the platform as a Linux application (not standalone).
