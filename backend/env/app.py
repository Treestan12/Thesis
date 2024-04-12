from flask import Flask, jsonify, request
import cv2
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)

cred = credentials.Certificate('/thesis/admin.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/api/segment-image', methods=['POST'])
def segment_image():

    image = request.files['image'].read()

    image_array = np.frombuffer(image, np.uint8)

    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)[1]
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    cnts = cv2.findContours(opening, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    fish_count = 0

    for c in cnts:

        area = cv2.contourArea(c)

        if area > 0:  
            fish_count += 1
            cv2.drawContours(image, [c], -1, (0, 255, 0), 2)  

    font = cv2.FONT_HERSHEY_SI