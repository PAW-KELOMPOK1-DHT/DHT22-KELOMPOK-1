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
import sys

# ========== KONFIGURASI ==========
# Ganti dengan URL server backend Anda
API_URL = "http://100.96.103.85:5000/api/sensor-data"

# Ganti dengan API Token yang didapat dari admin (setelah create sensor di backend)
API_TOKEN = "your_sensor_api_token_here"

# Pin GPIO untuk sensor (GPIO4 = Pin 7)
SENSOR_PIN = board.D23

# Tipe sensor (DHT22 atau DHT11)
SENSOR_TYPE = "DHT22"

# Interval pengiriman data (dalam detik)
SEND_INTERVAL = 60  # Kirim data setiap 60 detik

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 5  # detik
# ==================================


class HumidityMonitor:
    def __init__(self):
        """Initialize sensor DHT22/DHT11"""
        print(f"Initializing {SENSOR_TYPE} sensor...")
        try:
            if SENSOR_TYPE == "DHT22":
                self.dht_device = adafruit_dht.DHT22(SENSOR_PIN, use_pulseio=False)
            else:
                self.dht_device = adafruit_dht.DHT11(SENSOR_PIN, use_pulseio=False)
            print("✓ Sensor initialized successfully")
        except Exception as e:
            print(f"✗ Failed to initialize sensor: {e}")
            sys.exit(1)

    def read_sensor(self):
        """Membaca data dari sensor DHT"""
        try:
            temperature = self.dht_device.temperature
            humidity = self.dht_device.humidity
            
            if humidity is not None and temperature is not None:
                return {
                    'humidity': round(humidity, 2),
                    'temperature': round(temperature, 2)
                }
            else:
                return None
                
        except RuntimeError as error:
            # Errors happen fairly often with DHT sensors, just keep going
            print(f"✗ Sensor read error: {error.args[0]}")
            return None
        except Exception as error:
            print(f"✗ Unexpected error: {error}")
            return None

    def send_data(self, data, retry_count=0):
        """Mengirim data ke backend API"""
        headers = {
            "Content-Type": "application/json",
            "X-API-Token": API_TOKEN
        }
        
        try:
            response = requests.post(API_URL, json=data, headers=headers, timeout=10)
            
            if response.status_code == 201:
                print(f"✓ Data sent successfully: Temp={data['temperature']}°C, Humidity={data['humidity']}%")
                return True
            else:
                error_msg = response.json().get('message', 'Unknown error')
                print(f"✗ Server error ({response.status_code}): {error_msg}")
                return False
                
        except requests.exceptions.ConnectionError:
            print(f"✗ Connection error: Cannot reach server at {API_URL}")
            if retry_count < MAX_RETRIES:
                print(f"  Retrying in {RETRY_DELAY} seconds... (Attempt {retry_count + 1}/{MAX_RETRIES})")
                time.sleep(RETRY_DELAY)
                return self.send_data(data, retry_count + 1)
            return False
            
        except requests.exceptions.Timeout:
            print(f"✗ Request timeout")
            return False
            
        except Exception as e:
            print(f"✗ Error sending data: {e}")
            return False

    def run(self):
        """Main loop untuk monitoring"""
        print("\n" + "="*50)
        print("  RASPBERRY PI HUMIDITY MONITORING SYSTEM")
        print("="*50)
        print(f"Server: {API_URL}")
        print(f"Sensor: {SENSOR_TYPE} on GPIO {SENSOR_PIN}")
        print(f"Interval: {SEND_INTERVAL} seconds")
        print("="*50 + "\n")
        print("Press Ctrl+C to stop\n")
        
        consecutive_errors = 0
        max_consecutive_errors = 10
        
        try:
            while True:
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"[{timestamp}] Reading sensor...")
                
                # Baca data dari sensor
                sensor_data = self.read_sensor()
                
                if sensor_data:
                    # Reset error counter jika berhasil baca sensor
                    consecutive_errors = 0
                    
                    # Kirim data ke server
                    success = self.send_data(sensor_data)
                    
                    if not success:
                        print("  Warning: Data not sent to server")
                else:
                    consecutive_errors += 1
                    print(f"  Failed to read sensor (consecutive errors: {consecutive_errors})")
                    
                    if consecutive_errors >= max_consecutive_errors:
                        print(f"\n✗ Too many consecutive errors ({max_consecutive_errors}). Check sensor connection!")
                        print("  Restarting in 30 seconds...")
                        time.sleep(30)
                        consecutive_errors = 0
                
                # Tunggu sebelum pembacaan berikutnya
                print(f"  Next reading in {SEND_INTERVAL} seconds...\n")
                time.sleep(SEND_INTERVAL)
                
        except KeyboardInterrupt:
            print("\n\nStopping monitoring system...")
            self.cleanup()
            print("✓ System stopped gracefully")
            
        except Exception as e:
            print(f"\n✗ Unexpected error in main loop: {e}")
            self.cleanup()
            sys.exit(1)

    def cleanup(self):
        """Cleanup GPIO dan sensor"""
        try:
            self.dht_device.exit()
            print("✓ Sensor cleaned up")
        except:
            pass


def test_connection():
    """Test koneksi ke server"""
    print("Testing connection to server...")
    try:
        response = requests.get(API_URL.replace('/sensor-data', '/health'), timeout=5)
        if response.status_code == 200:
            print(f"✓ Server is reachable: {response.json()}")
            return True
        else:
            print(f"✗ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"✗ Cannot connect to server at {API_URL}")
        print("  Make sure the backend server is running!")
        return False
    except Exception as e:
        print(f"✗ Connection test failed: {e}")
        return False


if __name__ == "__main__":
    print("\n" + "="*50)
    print("  Starting Raspberry Pi Sensor Module")
    print("="*50 + "\n")
    
    # Validate configuration
    if API_TOKEN == "your_sensor_api_token_here":
        print("✗ ERROR: Please configure API_TOKEN in this script!")
        print("  1. Login as admin to the backend")
        print("  2. Create a new sensor")
        print("  3. Copy the API Token")
        print("  4. Replace API_TOKEN value in this script")
        sys.exit(1)
    
    # Test connection to server
    if not test_connection():
        print("\n⚠ Warning: Server not reachable, but starting anyway...")
        print("  Data will be queued if connection is restored\n")
        time.sleep(2)
    
    # Initialize and run monitor
    monitor = HumidityMonitor()
    monitor.run()
