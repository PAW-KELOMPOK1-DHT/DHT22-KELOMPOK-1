#!/usr/bin/env python3
"""
Raspberry Pi Humidity Monitoring System
Script untuk membaca data sensor DHT22 dan mengirim ke backend API
"""

import time
import board
import adafruit_dht
import requests
from datetime import datetime

# ========== KONFIGURASI ==========
API_URL = "http://100.96.103.85:5000/api/sensor-data"
API_TOKEN = "your_sensor_api_token_here"  # Ganti dengan API Token dari admin
SEND_INTERVAL = 60  # Kirim data setiap 60 detik
# ==================================

# Initialize DHT22 sensor on GPIO 23
dht = adafruit_dht.DHT22(board.D23)

print("=" * 50)
print("  RASPBERRY PI HUMIDITY MONITORING")
print("=" * 50)
print(f"Server: {API_URL}")
print(f"Interval: {SEND_INTERVAL} seconds")
print("Press Ctrl+C to stop\n")

def send_to_server(temperature, humidity):
    """Kirim data ke backend API"""
    try:
        headers = {
            "Content-Type": "application/json",
            "X-API-Token": API_TOKEN
        }
        data = {
            "temperature": round(temperature, 2),
            "humidity": round(humidity, 2)
        }
        
        response = requests.post(API_URL, json=data, headers=headers, timeout=10)
        
        if response.status_code == 201:
            print("✓ Data sent to server successfully")
            return True
        else:
            print(f"✗ Server error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error sending data: {e}")
        return False

# Main loop
try:
    while True:
        try:
            temperature = dht.temperature
            humidity = dht.humidity
            
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n[{timestamp}]")
            print(f"Suhu: {temperature:.1f}°C")
            print(f"Kelembaban: {humidity:.1f}%")
            
            # Kirim ke server
            send_to_server(temperature, humidity)
            
        except RuntimeError as e:
            print(f"✗ Reading error: {e}")
        
        time.sleep(SEND_INTERVAL)

except KeyboardInterrupt:
    print("\n\nStopping...")
    dht.exit()
    print("✓ Stopped gracefully")
