import serial
import time
import math
import random
import ctypes
from cobs import cobs

class Joint(ctypes.Structure):
    _fields_ = [
        ("accel", ctypes.c_double * 3),
        ("gyro", ctypes.c_double * 3),
        ("pitch", ctypes.c_double),
        ("roll", ctypes.c_double),
        ("prev_time", ctypes.c_uint64),
        ("gyro_offset", ctypes.c_double * 3)
    ]

class InverseMsg(ctypes.Structure):
    _fields_ = [
        ("turn_table", ctypes.c_double),
        ("first_link", ctypes.c_double),
        ("second_link", ctypes.c_double),
        ("pitch", ctypes.c_double),
        ("roll", ctypes.c_double),
        ("x", ctypes.c_double),
        ("y", ctypes.c_double),
        ("z", ctypes.c_double)
    ]

class Rover_data(ctypes.Structure):
    _fields_ = [
        ("joint", Joint),
        ("inverse", InverseMsg),
        ("channel", ctypes.c_uint16 * 16)
    ]

class FakeSerialDevice:
    def __init__(self, port="/dev/pts/2", baud=115200):
        self.serial = serial.Serial(port, baud)
        self.t = 0  # Time variable for generating smooth motion
        
    def generate_fake_data(self):
        """Generate fake but realistic-looking rover data"""
        rover_data = Rover_data()
        
        # Generate smooth sinusoidal motion for accelerometer
        rover_data.joint.accel[0] = math.sin(self.t * 0.5) * 0.1  # X acceleration
        rover_data.joint.accel[1] = math.cos(self.t * 0.3) * 0.15  # Y acceleration
        rover_data.joint.accel[2] = 9.81 + math.sin(self.t * 0.2) * 0.05  # Z acceleration with gravity
        
        # Generate gyroscope data
        rover_data.joint.gyro[0] = math.sin(self.t * 0.8) * 0.5  # X angular velocity
        rover_data.joint.gyro[1] = math.cos(self.t * 0.7) * 0.4  # Y angular velocity
        rover_data.joint.gyro[2] = math.sin(self.t * 0.6) * 0.3  # Z angular velocity
        
        # Generate pitch and roll
        rover_data.joint.pitch = math.sin(self.t * 0.2) * 15  # -15 to 15 degrees
        rover_data.joint.roll = math.cos(self.t * 0.15) * 10  # -10 to 10 degrees
        
        # Set timestamp
        rover_data.joint.prev_time = int(time.time() * 1000)  # milliseconds
        
        # Generate gyro offset (usually constant in real life)
        rover_data.joint.gyro_offset[0] = 0.01
        rover_data.joint.gyro_offset[1] = -0.015
        rover_data.joint.gyro_offset[2] = 0.008
        
        # Generate inverse kinematics data
        rover_data.inverse.turn_table = math.sin(self.t * 0.1) * 90  # -90 to 90 degrees
        rover_data.inverse.first_link = 45 + math.sin(self.t * 0.15) * 30  # 15 to 75 degrees
        rover_data.inverse.second_link = 30 + math.cos(self.t * 0.12) * 20  # 10 to 50 degrees
        
        # Copy pitch and roll from joint data with small variations
        rover_data.inverse.pitch = rover_data.joint.pitch + random.uniform(-0.1, 0.1)
        rover_data.inverse.roll = rover_data.joint.roll + random.uniform(-0.1, 0.1)
        
        # Generate x, y, z position
        rover_data.inverse.x = math.cos(self.t * 0.05) * 100  # Position in mm
        rover_data.inverse.y = math.sin(self.t * 0.05) * 100
        rover_data.inverse.z = 150 + math.sin(self.t * 0.08) * 30
        
        # Generate random channel data (PWM values typically 1000-2000)
        for i in range(16):
            rover_data.channel[i] = int(1500 + math.sin(self.t * 0.1 + i) * 500)
        
        return rover_data
    
    def send_packet(self, data):
        """Convert structure to bytes, encode with COBS, and send"""
        # Convert structure to bytes
        data_bytes = bytes(data)
        
        # Encode with COBS
        encoded_data = cobs.encode(data_bytes)
        
        # Add delimiter
        packet = encoded_data + b'\x00'
        
        # Send over serial
        self.serial.write(packet)
    
    def run(self):
        """Main loop to generate and send fake data"""
        print("Starting fake serial device...")
        try:
            while True:
                # Generate and send fake data
                rover_data = self.generate_fake_data()
                self.send_packet(rover_data)
                
                # Increment time variable
                self.t += 0.1
                
                # Wait a bit to simulate realistic data rate
                time.sleep(0.1)
                
        except KeyboardInterrupt:
            print("\nShutting down...")
        finally:
            self.serial.close()

if __name__ == "__main__":
    # Create a virtual serial port pair first using socat:
    # socat -d -d pty,raw,echo=0 pty,raw,echo=0
    
    # Use the first port created by socat
    fake_device = FakeSerialDevice("/dev/pts/2")  # Change this to match your virtual port
    fake_device.run()
