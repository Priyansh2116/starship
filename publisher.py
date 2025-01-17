import time
import random
import zmq
import base64
import socket
import json
import csv
from datetime import datetime

def gpsincsv():
    filename = f"gps_data_{datetime.now().strftime('%H%M%S')}.csv"
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Timestamp', 'Latitude', 'Longitude'])
    return filename

context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")

sub_socket= context.socket(zmq.SUB)
sub_socket.connect("tcp://192.168.153.96:5556")
sub_socket.setsockopt_string(zmq.SUBSCRIBE, "")

pullsensor = zmq.Poller()
pullsensor.register(sub_socket , zmq.POLLIN)

csv_filename = gpsincsv()
print(f"CSV file created: {csv_filename}")

def parse(message_str):
    try:
        message_dict = json.loads(message_str)
        return {
            'latitude': message_dict.get('latitude'),
            'longitude': message_dict.get('longitude'),
            'msg_status': message_dict.get('msg_status'),
            'height': message_dict.get('height'),
            'numSV': message_dict.get('numSV')
        }
    except Exception as e:
        print(f"Error parsing: {e}")
        return None

while True:

    try:
        current_time = datetime.now().strftime('%H:%M:%S.%f')[:-3]
        '''
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}")

        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")
        '''
        socks=dict(pullsensor.poll(1))
        if sub_socket in socks and socks[sub_socket] == zmq.POLLIN:
            message = sub_socket.recv_string()
            parsed_msg = parse(message)
        if parsed_msg:
            json_message  = json.dumps(parsed_msg)
            socket.send_string(json_message)
            lat = parsed_msg['latitude']
            lon = parsed_msg['longitude']
            print(f"Latitude: {parsed_msg['latitude']}")
            print(f"Longitude: {parsed_msg['longitude']}")
            print(f"Status: {parsed_msg['msg_status']}")
            print(f"height: {parsed_msg['height']}")
            print(f"numsv: {parsed_msg['numSV']}")

            with open(csv_filename, 'a', newline='') as file:
                        writer = csv.writer(file)
                        writer.writerow([
                            current_time,
                            lat,
                            lon
                        ])



        time.sleep(0.01)

    except Exception as e:
        print(f"error receiving:{e}")
