import zmq
import time
import random
import cv2
import base64
import numpy as np
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")
pull_socket = context.socket(zmq.PULL)
pull_socket.bind("tcp://*:5556")
path = "1.png"
frame1 = cv2.imread(path)
camera = cv2.VideoCapture(0)
lastspeed = time.time()
lastcompassupdate = time.time()
lastgasupdate = time.time()
lastspectroscopyupdate = time.time()

def generate_spectroscopy(frame):
    grayscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    spectrum = np.sum(grayscale, axis=0)  # Sum pixel intensities along columns
    spectrum = spectrum / np.max(spectrum)  # Normalize to range [0, 1]
    return spectrum.tolist()
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

     
    events = pull_socket.poll(timeout=1000)
    if events:
        message = pull_socket.recv_string()
        if message == "capture_spectroscopy":
            print("Capturing frame for spectroscopy")
            spectrum = generate_spectroscopy(frame1)
            print(f"Publishing spectroscopy data: {spectrum[:10]}...")
            socket.send_string(f"spectroscopy {spectrum[:10]}")

    time.sleep(0.01)
