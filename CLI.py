
import serial
import httplib, urllib

# CONSTS
#pushoverUser=u5tUy693Wua7MwLQTfEQmfrbMogo6S
#MSGyellowMark="hey Bozo, RPi3 here, tonight is YELLOW bin night"
#pushoverToken_rubbishBin=aZHSqHdBfMga7mfprDX1dmDC3qsZGh

# FUNCTIONS
# these have to be declared/defined before they are called
def sendMessage(message):
  conn = httplib.HTTPSConnection("api.pushover.net:443")
  conn.request("POST", "/1/messages.json",
    urllib.urlencode({
      "token": "aZHSqHdBfMga7mfprDX1dmDC3qsZGh",
      "user": "u5tUy693Wua7MwLQTfEQmfrbMogo6S",
      "message": message,
    }), { "Content-type": "application/x-www-form-urlencoded" })
  conn.getresponse()
  return;

# CONST, VAR, ...
ser = serial.Serial('/dev/ttyACM0',9600)
s = [0,1]

# MAIN LOOP
while True:
  # get next string from the Arduino
  # expected format: nnn:string (nnn = 0..999)
  read_serial=ser.readline()
  #s[0] = str(int(read_serial,16))
  #print s[0]
  print read_serial
  # parse the string and if it matches a criterion, send pushover message
  # sendMessage(read_serial)




