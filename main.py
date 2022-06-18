import usocket as socket
import utime as time
import ujson
from config import jwt
from boot import do_connect
import ussl as ssl
from machine import Pin
from machine import I2C
import dht
import mpu6050

def make_id():
  return ''.join([str(x) if x > 9 else '0' + str(x) for x in time.localtime()[0:6]])

# temp and humidity dht22sensor
dht22sensor = dht.DHT22(Pin(14))

# mpu
accelI2c = I2C(scl=Pin(5), sda=Pin(4))
mpu = mpu6050.accel(accelI2c)
mpu.get_values()


while True:
  try:
    # set couchdb addr
    print('getaddrinfo...')
    ai = socket.getaddrinfo("couchdatabase.xyz", 443)
    print("Address infos:", ai)
    addr = ai[0][-1]
        
    # start socket
    s = socket.socket()
    s.connect(addr)
    s.settimeout(10)
    s = ssl.wrap_socket(s)

    # wrap with ssl
    socket_cmd_non_ssl = socket.socket()
    socket_cmd_non_ssl.connect(addr)
    socket_cmd = ssl.wrap_socket(socket_cmd_non_ssl)
    socket_cmd_non_ssl.settimeout(0.1)
    time.sleep(0.1)

    while True:
      try:
        # data buffer
        buf = dict({
          't': []
        })

        start_time_ns = time.time_ns()
        doc_id = 'data_sens001_'+make_id()

        # create array buffer for mpu data
        mpu_values = mpu.get_values()
        for k in mpu_values.keys():
          buf[k] = []

        # get data from mpu
        for x in range(10):
          mpu_values = mpu.get_values()
          buf['t'].append(time.time_ns() - start_time_ns)
          for k in mpu_values.keys():
            buf[k].append(mpu_values[k])
            time.sleep(0.1)

        # read temperatura and humidity
        dht22sensor.measure()
        temp = dht22sensor.temperature()
        hum = dht22sensor.humidity()
        # print("temp: {}, humidity: {}\n".format(temp, hum))
        
        buf['temp'] = [temp]
        buf['hum'] = [hum]
        
        # create doc id

        buf_str = ujson.dumps(buf)
        # print(buf_str)

        # build and send payload
        payload = bytes('PUT /_couch/desafio/{}?batch=ok HTTP/1.1\r\nHost: couchdatabase.xyz\r\nAuthorization: Bearer {}\r\nContent-Type: application/json\r\nContent-Length: {}\r\n\r\n'.format(doc_id, jwt, len(buf_str)), 'utf-8')+buf_str
        print('sending data...')
        s.write(payload)
        print('send done.')

        print('waiting ok response...')
        while True:
          buf = s.readline()
          if '"ok":true' in buf:
            #print(buf)
            break
        print('waiting ok done.')
      except Exception as e:
        print('error sending data')
        print(e)
        s.close()
        socket_cmd.close()
        do_connect()
        break
  
  except Exception as e:
    print(e)
    pass
