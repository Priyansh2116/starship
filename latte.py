import struct
import serial
from pyubx2 import UBXReader
from cobs import cobs
import zlib
import zmq
import ctypes

context=zmq.Context()
socket=context.socket(zmq.PUB)
socket.bind("tcp://*:5556")

class BaseStationData(ctypes.Structure):
    _fields_  = [
            ("gps_msg", ctypes,c_char*100),
            ("accel",ctypes.c_double),
            ("compass",ctypes.c_double),
            ("msg_status",ctypes.c_uint32),
            ("crc",ctypes.c_uint32),
        ]

def gpsubx(ubx_data):
    try:
        stream = UBXReader.parse(ubx_data)
        return stream
    error Exception as e:
        print(f"error publishing:{e]")


def calccrc(data):
    return zlib.crc32(data) & 0xFFFFFFFF


def chmsg(status):
    if error_mssg_flag & 0x0001:
        print("Error: Corrupt SBUS Packet")
    if error_mssg_flag & 0x0002:
        print("Error: COBS Decode Failed")
    if error_mssg_flag & 0x0003:
        print("Error: Message from Latte Panda is corrupt")
    if error_mssg_flag & 0x0004:
        print("Error: COBS Encoding Failed")
    if error_mssg_flag & 0x0008:
        print("Error: Unable to write PWM pulse to Left Motor")
    if error_mssg_flag & 0x0010:
        print("Error: Unable to write PWM pulse to Right Motor")
    if error_mssg_flag & 0x0020:
        print("Error: Unable to write Linear Actuator (Channel 2)")
    if error_mssg_flag & 0x0040:
        print("Error: Unable to write Linear Actuator (Channel 3)")
    if error_mssg_flag & 0x0080:
        print("Error: Unable to write Gripper/Bio-Arm")
    if error_mssg_flag & 0x0100:
        print("Error: Unable to write Mini-Actuator/Ogger")
    if error_mssg_flag & 0x0200:
        print("Error: Unable to write Cache-Box Servo")
    if error_mssg_flag & 0x0300:
        print("Error: Unable to write Microscope Servo")
    if error_mssg_flag & 0x0400:
        print("Error: Unable to write Pan Servo")
    if error_mssg_flag & 0x0800:
        print("Error: Unable to write Tilt Servo")
    if error_mssg_flag & 0x1000:
        print("Error: No data from IMU Pitch Roll")
    if error_mssg_flag & 0x2000:
        print("Error: No data from Magnetometer Turn Table")
    if error_mssg_flag == 0:
        print("No errors detected.")

def process(encoded_msg):

    decoded_msg = cobs.decode(encoded_msg)
    crc = struct.unpack('<I', decoded_msg[-4:])[0]
    if(crc!= calccrc(decoded_msg[-4])):
        raise ValueError("crc didnt matched")
    gps_msg  = decoded_msg[:100]
    accel, compass, msg_status, _ = struct.unpack('<ddII', decoded_msg[100:128])
    decoded_gps=gpsubx(gps_msg)
    chmsg(msg_status)

    return {
            "gps_msg":decoded_gps,
            "accel":accel,
            "compass":compass,
            "msg_status":msg_status,
            "crc":True
        }

def main():
    ser=serial.Serial('PORT',baudrate=9600,timeout=1)
    raw_data = ser.read(64)
    if raw_data:
        try:
            result=process(raw_data)
            print("Decoded msg")
            print(result)
            socket.send_string(result)
        except Exception as e:
            print(f"error publishing:{e}")

if __name__ == "__main__":
    main()

