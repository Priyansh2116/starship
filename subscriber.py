import zmq
import time
import random
import cv2
import base64
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")
camera = cv2.VideoCapture(0)
last_speed_update = time.time()
last_compass_update = time.time()
last_gas_update = time.time()
while True:

    ret, frame = camera.read()
    if ret:
        _, buffer = cv2.imencode('.jpg', frame)
        frame_encoded = base64.b64encode(buffer).decode('utf-8')
        print("Publishing camera frame")
        socket.send_string(f"camera {frame_encoded}")

    current_time = time.time()

 
    if current_time - last_speed_update >= 0.5:
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}")
        last_speed_update = current_time

    
    if current_time - last_compass_update >= 0.5:
        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")
        last_compass_update = current_time

    if current_time - last_gas_update >= 0.5:
        gasvalue = random.randint(0, 60)
        print(f"Publishing gasvalue: {gasvalue}")
        socket.send_string(f"gasvalue {gasvalue}")
        last_gas_update = current_time

    time.sleep(0.01)
