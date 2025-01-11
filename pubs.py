import zmq
import time
import random
import cv2
import base64
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")
path = "1.png"
frame1 = cv2.imread(path)
camera = cv2.VideoCapture(0)
#camera1_url = "http://192.168.90.78:PORT/cam1"
#cam1 = cv2.videoCapture(camera1_url)



while True:
    try:
        # Camera frames
        ret, frame = camera.read()
        if ret:
            _, buffer = cv2.imencode('.jpg', frame1)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            socket.send_string(f"camera {frame_encoded}")
        
        
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}")

        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")


        time.sleep(0.01)

    except Exception as e:
        print(f"Unexpected error in main loop: {e}")
        time.sleep(1)  # Pause briefly on error

