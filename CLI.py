#
# monitor the serial USB from Arduino and parse the received strings
# depending on the received text:
# - do nothing
# - send SMS
# - send PushOver notification
# - write to a file
# - a combination of the above

# FORMAT of received STRINGS
# nnn text1 text2 ...
# where
# nnn=100 --> parameters are CLI, time, date, +?
# nnn=101 --> parameter is ?
# nnn=010 --> and so on
# nnn=020
#
# NOTE
# the number of parameters is fixed for a given value of nnn



import serial
import httplib, urllib

# CONSTS
#pushoverUser=u5tUy693Wua7MwLQTfEQmfrbMogo6S
#MSGyellowMark="hey Bozo, RPi3 here, tonight is YELLOW bin night"
#pushoverToken_rubbishBin=aZHSqHdBfMga7mfprDX1dmDC3qsZGh

# FUNCTIONS
# these have to be declared/defined before they can be called

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

def getMessageID(message):
  # return the integer value at the start of the message
  split_message = message.split()
  result = split_message[0]
  return result;

# CONST, VAR, ...
ser = serial.Serial('/dev/ttyACM0',9600)
s = [0,1]
  
# MAIN LOOP
while True:
  # get next string from the Arduino
  # expected format: nnn:string (nnn = 0..999)
  read_serial=ser.readline()
  messageType = getMessageID(read_serial)
  split_message = read_serial.split()
  messageID = int(split_message[0])
  #s[0] = str(int(read_serial,16))
  #print s[0]
  print read_serial
  print messageID
  messageID += 1
  print messageID
    
  # parse the string and if it matches a criterion, send pushover message
  # sendMessage(read_serial)




