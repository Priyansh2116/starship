import serial
import time
from pyubx2 import UBXReader
from cobs import cobs
import zlib
import zmq
import ctypes
import json

context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5556")

class BaseStation(ctypes.Structure):
    _fields_ = [
        ("gps", ctypes.c_char*100),
        ("error_mssg_flag", ctypes.c_uint16),
        ("crc", ctypes.c_uint32),
    ]

def chmsg(error_mssg_flag):
    mssg = ""
    if error_mssg_flag & 0x0001 == 0x0001:
        mssg = mssg+"Error: Corrupt SBUS Packet"
    if error_mssg_flag & 0x0002 == 0x0002:
        mssg = mssg+"Error: COBS Decode Failed"
    if error_mssg_flag & 0x0004 == 0x0004:
        mssg = mssg+"Error: Message from Latte Panda is corrupt"
    if error_mssg_flag & 0x0008 == 0x0008:
        mssg = mssg+"Error: COBS Encoding Failed"
    if error_mssg_flag & 0x0010 == 0x0010:
        mssg = mssg+"Error: Unable to write PWM pulse to Left Motor"
    if error_mssg_flag & 0x0020 == 0x0020:
        mssg = mssg+"Error: Unable to write PWM pulse to Right Motor"
    if error_mssg_flag & 0x0040 == 0x0040:
        mssg = mssg+"Error: Unable to write to Gripper/Bio-Arm"
    if error_mssg_flag & 0x0080 == 0x0080:
        mssg = mssg+"Error: Unable to write to Tilt Servo"
    if error_mssg_flag & 0x0100 == 0x0100:
        mssg = mssg+"Error: Unable to write to Pan Servo"
    if error_mssg_flag & 0x0200 == 0x0200:
        mssg = mssg+"Error: Unable to write to Linear Actuator 1"
    if error_mssg_flag & 0x0400 == 0x0400:
        mssg = mssg+"Error: Unable to write to Linear Actuator 2"
    if error_mssg_flag & 0x0800 == 0x0800:
        mssg = mssg+"Error: Unable to write to to Mini-Acc/ABox"
    if error_mssg_flag & 0x1000 == 0x1000:
        mssg = mssg+"Error: No data from imu_lower_joint"
    if error_mssg_flag & 0x2000 == 0x2000:
        mssg = mssg+"Error: No data from imu_upper_joint"
    if error_mssg_flag & 0x4000 == 0x4000:
        mssg = mssg+"Error: No data from imu_pitch_roll"
    if error_mssg_flag & 0x8000 == 0x8000:
        mssg = mssg+"Error: No data from Magnetometer Turn Table"
    if error_mssg_flag == 0x0000:
        mssg = mssg+"No errors detected"
    return mssg

def process(encoded_msg, ser):
    lat = None
    lon = None
    height = None
    numSV = None
    
    try:
        if 0 not in encoded_msg:
            additional_data = ser.read(ser.in_waiting or 1)
            if additional_data:
                encoded_msg = encoded_msg + additional_data
        try:
            msg_end = encoded_msg.index(0)
            actual_msg = encoded_msg[:msg_end]
        except ValueError:
            print("No delimiter found in message")
            return None

        # Decode COBS
        try:
            decoded_msg = cobs.decode(actual_msg)
        except Exception as e:
            print(f"COBS decode error: {e}")
            return None

        # Verify message length
        if len(decoded_msg) < (100 + 2 + 4):  # GPS + error flag + CRC
            print(f"Message too short: {len(decoded_msg)} bytes")
            return None

        # Create BaseStation structure
        base_station_mssg = BaseStation.from_buffer_copy(decoded_msg)

        # Check CRC
        calculated_crc = zlib.crc32(decoded_msg[:-4])
        if calculated_crc != base_station_mssg.crc:
            print("CRC mismatch")
            return None

        # Process GPS data
        try:
            gps_msg = UBXReader.parse(bytes(base_station_mssg.gps))
            if gps_msg.identity == "NAV-PVT":
                lat = gps_msg.lat
                lon = gps_msg.lon
                height = gps_msg.hMSL
                numSV = gps_msg.numSV
            else:
                print(f"Unexpected message type: {gps_msg.identity}")
        except Exception as e:
            print(f"GPS parsing error: {e}")
            return None

        # Get error message
        error_mssg = chmsg(base_station_mssg.error_mssg_flag)

        return {
            "latitude": lat,
            "longitude": lon,
            "height": height,
            "numSV": numSV,
            "msg_status": error_mssg,
        }

    except Exception as e:
        print(f"Processing error: {e}")
        return None

def main():
    ser = serial.Serial(
        "/dev/serial/by-id/usb-ZEPHYR_Team_RUDRA_Tarzan_3339511100350023-if00",
        baudrate=9600,
        timeout=1
    )
    
    while True:
        try:
            raw_data = ser.read(110)
            if raw_data:
                result = process(raw_data, ser)
                if result:
                    print("result is : ", result)
                    socket.send_string(json.dumps(result))
                time.sleep(0.001)
        except Exception as e:
            print(f"Main loop error: {e}")
            time.sleep(1)  # Wait before retrying

if __name__ == "__main__":
    main()
