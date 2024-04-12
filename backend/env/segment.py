import cv2
import numpy as np
from google.cloud import firestore

db = firestore.Client()

def get_image_from_firestore(collection_name, document_name):
    doc = db.collection(collection_name).document(document_name).get()
    if doc.exists:
        return np.array(bytearray(doc.data()['image_data']), dtype='uint8')
    return None

image_data = get_image_from_firestore('images', 'image_document_name')

if image_data is not None:
    image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)

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

    cv2.imshow('Segmented Image (Fish Count: {})'.format(fish_count), image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()