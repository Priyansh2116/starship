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

# Receiver socket for spectroscopy requests
receiver_socket = context.socket(zmq.REP)
receiver_socket.bind("tcp://*:5556")
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
