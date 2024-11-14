import zmq
import time
import random
import cv2
import base64
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")
camera = cv2.VideoCapture(0) 
while True:
        ret, frame = camera.read()
        if ret:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            print("Publishing camera frame")
            socket.send_string(f"camera {frame_encoded}") 

while True:
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}") 
        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")


        time.sleep(1)
