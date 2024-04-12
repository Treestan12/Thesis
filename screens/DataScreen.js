import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

class Blob extends Component {
  render() {
    const { latitude, longitude, onMouseOver } = this.props;

    const style = {
      position: 'absolute',
      top: latitude,
      left: longitude,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
      borderRadius: '50%',
    };

    return (
      <div
        style={style}
        onMouseOver={() => onMouseOver(latitude, longitude)}
      />
    );
  }
}

class MapContainer extends Component {
  state = {
    showMap: true,
    mapViewClicked: false,
    latitude: '',
    longitude: '',
    markerPosition: null,
    data: [],
  };

  onBlobMouseOver = (latitude, longitude) => {
    alert(`GPS Location: (${latitude}, ${longitude}`);
  };

  async componentDidMount() {
    const querySnapshot = await getDocs(collection(db, 'gpsdata'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        latitude: doc.data().latitude,
        longitude: doc.data().longitude,
      });
    });
    this.setState({ data });
  }

  toggleView = () => {
    this.setState((prevState) => ({
      showMap: !prevState.showMap,
      mapViewClicked: true,
    }));
  };

  render() {
    const { google } = this.props;
    const { data } = this.state;

    const mapStyles = {
      width: '100%',
      height: '100%',
    };

    const defaultLocation = {
      lat: 9.4141,
      lng: 123.24216,
    };

    return (
      <div>
        {!this.state.mapViewClicked && (
          <div>
            <button onClick={this.toggleView}>
              {this.state.showMap ? 'View Data' : 'View Map'}
            </button>
          </div>
        )}
        {this.state.showMap ? (
          <div>
            <Map
              google={google}
              zoom={14}
              style={mapStyles}
              initialCenter={defaultLocation}
            >
              {data.map((item) => (
                <Blob
                  key={`${item.latitude}-${item.longitude}`}
                  latitude={item.latitude}
                  longitude={item.longitude}
                  onMouseOver={() => this.onBlobMouseOver(item.latitude, item.longitude)}
                />
              ))}
            </Map>
            {this.state.mapViewClicked && (
              <button onClick={this.toggleView}>Back</button>
            )}
          </div>
        ) : (
          <div>
            <h2>Data Display</h2>
            <p>Data goes here...</p>
          </div>
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyDbhA2fS8wPqK_IJX5JqYS3O1qT5zDvE6s' })(
  MapContainer
);