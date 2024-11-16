import zmq
import time
import random
import cv2
import base64
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")
camera = cv2.VideoCapture(0)
lastspeed = time.time()
lastcompassupdate = time.time()
lastgasupdate = time.time()
while True:

    ret, frame = camera.read()
    if ret:
        _, buffer = cv2.imencode('.jpg', frame)
        frame_encoded = base64.b64encode(buffer).decode('utf-8')
        print("Publishing camera frame")
        socket.send_string(f"camera {frame_encoded}")

    currenttime = time.time()

 
    if currenttime-lastspeed >= 0.5:
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}")
        lastspeed = currenttime

    
    if currenttime-lastcompassupdate >= 0.5:
        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")
        lastcompassupdate = currenttime

    if currenttime-lastgasupdate >= 0.5:
        gasvalue = random.randint(0, 60)
        print(f"Publishing gasvalue: {gasvalue}")
        socket.send_string(f"gasvalue {gasvalue}")
        lastgasupdate = currenttime

    time.sleep(0.01)
