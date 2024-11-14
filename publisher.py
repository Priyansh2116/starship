import zmq
import time
import random


context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5555")

while True:
    speed = random.randint(0, 180)
    print(f"Publishing speed: {speed}")
    socket.send_string(f"speed {speed}")
    time.sleep(1)
