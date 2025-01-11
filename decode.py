import serial
import zmq
import json
import time
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

class RoverData(ctypes.Structure):
    _fields_ = [
        ("joint", Joint),
        ("inverse", InverseMsg),
        ("channel", ctypes.c_uint16 * 16)
    ]

class Decoder:
    def __init__(self, port="/dev/pts/3", baudrate=115200):
        self.ser = serial.Serial(port, baudrate)
        self.context = zmq.Context()
        self.publisher = self.context.socket(zmq.PUB)
        self.publisher.bind("tcp://*:5555")
        self.packet_size = ctypes.sizeof(RoverData)

    def to_dict(self, struct_obj):
        result = {}
        for field, _ in struct_obj._fields_:
            value = getattr(struct_obj, field)
            if isinstance(value, ctypes.Array):
                result[field] = list(value)
            elif isinstance(value, (Joint, InverseMsg)):
                result[field] = self.to_dict(value)
            else:
                result[field] = value
        return result

    def get_packet(self):
        packet = bytearray()
        while True:
            byte = self.ser.read()
            if byte == b'\x00':
                break
            packet.extend(byte)
        try:
            decoded = cobs.decode(packet)
            rover_data = RoverData()
            ctypes.memmove(ctypes.byref(rover_data), decoded, min(len(decoded), self.packet_size))
            data_dict = self.to_dict(rover_data)
            self.publisher.send_string("rover_data", zmq.SNDMORE)
            self.publisher.send_json(data_dict)
            return data_dict
        except Exception as e:
            print(f"Error processing packet: {e}")
            return None

    def start(self):
        print("Starting decoder...")
        while True:
            try:
                data = self.get_packet()
                if data:
                    print("Received and published data")
                time.sleep(0.001)
            except KeyboardInterrupt:
                print("\nStopping decoder...")
                break
            except Exception as e:
                print(f"Error in main loop: {e}")
        self.stop()

    def stop(self):
        self.ser.close()
        self.publisher.close()
        self.context.term()

if __name__ == "__main__":
    decoder = Decoder()
    decoder.start()

