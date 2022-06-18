# esp32-cam-couchdb


Useful commands:
```bash
# upload compiled firmware folowing instructions on: https://lemariva.com/blog/2020/06/micropython-support-cameras-m5camera-esp32-cam-etc
esptool.py --port /dev/ttyUSB0 erase_flash
esptool.py --port /dev/ttyUSB0 --baud 460800 write_flash --flash_size=detect 0 esp8266-1m-20220616-v1.19.bin 
# upload app and open terminal using ampy tool
ampy --port /dev/ttyUSB0 put main.py ; sudo picocom /dev/ttyUSB0 -b115200
```
