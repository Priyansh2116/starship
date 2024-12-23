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

class RobotData(ctypes.Structure):
    _fields_ = [
        ("joint", Joint),
        ("inverse", InverseMsg),
        ("channel", ctypes.c_uint16 * 16)
    ]
