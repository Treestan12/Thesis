from google.cloud import firestore

db = firestore.Client()

def get_gps_data(collection_name, document_name):
    doc = db.collection(collection_name).document(document_name).get()
    if doc.exists:
        gps_data = doc.to_dict()['gps_data']
        return gps_data['latitude'], gps_data['longitude']
    return None

if __name__ == '__main__':
    latitude, longitude = get_gps_data('locations', 'location_document_name')
    print(f'GPS Data: {latitude}, {longitude}')