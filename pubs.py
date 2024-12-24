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

# Receiver socket for spectroscopy requests
receiver_socket = context.socket(zmq.REP)
receiver_socket.bind("tcp://*:5556")
path = "1.png"
frame1 = cv2.imread(path)
camera = cv2.VideoCapture(0)
#camera1_url = "http://192.168.90.78:PORT/cam1"
#cam1 = cv2.videoCapture(camera1_url)

def genspec(frame):
    try:
        plt.close('all')
        grayscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        spectrum = np.sum(grayscale, axis=0)
        spectrum = spectrum / np.max(spectrum)
        plt.figure(figsize=(10, 5), dpi=100)
        plt.plot(spectrum, color="cyan", linewidth=2)
        plt.title("Spectroscopy Data", fontsize=15)
        plt.xlabel("Pixel Column", fontsize=12)
        plt.ylabel("Normalized Intensity", fontsize=12)
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.tight_layout()
        buf = BytesIO()
        plt.savefig(buf, format="png", bbox_inches='tight')
        buf.seek(0)
        plt.close()
        img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return img_base64
    except Exception as e:
        print(f"Error generating spectroscopy image: {e}")
        return None


pull = zmq.Poller()
pull.register(receiver_socket, zmq.POLLIN)


while True:
    try:
        # Camera frames
        ret, frame = camera.read()
        if ret:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            socket.send_string(f"camera {frame_encoded}")
        
        
        speed = random.randint(0, 180)
        print(f"Publishing speed: {speed}")
        socket.send_string(f"speed {speed}")

        compass = random.uniform(0, 360)
        print(f"Publishing compass: {compass:.2f}")
        socket.send_string(f"compass {compass:.2f}")

        gasvalue = random.randint(0, 60)
        print(f"Publishing gasvalue: {gasvalue}")
        socket.send_string(f"gasvalue {gasvalue}")

        
        socks = dict(pull.poll(10))
        if receiver_socket in socks and socks[receiver_socket] == zmq.POLLIN:
            try:
                request = receiver_socket.recv_string()
                print(f"Receiving {request}")

                if request == "REQUEST_SPECTROSCOPY":
                    print("Wait for spectroscopy...")

                    if ret:
                        spectroscopy_img = genspec(frame1)

                        if spectroscopy_img:
                            receiver_socket.send_string(spectroscopy_img)
                            print("Sent spectroscopy image")
                            socket.send_string(f"spectroscopy {spectroscopy_img}")
                            print("Also sent to PUB socket")
                        else:
                            receiver_socket.send_string("ERROR")
                            print("Failed to generate spectroscopy image")
                    else:
                        receiver_socket.send_string("ERROR")
                        print("No frame captured for spectroscopy")
                else:
                    receiver_socket.send_string("ERROR: Unknown request")
                    print(f"Unknown request: {request}")
            except zmq.ZMQError as e:
                print(f"ZMQ Error in request handling: {e}")

        time.sleep(0.01)

    except Exception as e:
        print(f"Unexpected error in main loop: {e}")
        time.sleep(1)  # Pause briefly on error

