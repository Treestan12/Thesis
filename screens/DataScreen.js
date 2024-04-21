import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

class MapContainer extends Component {
  state = {
    data: [],
    showLocalMap: false,
    localData: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'gpsdata'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        latitude: doc.data().gpsdata.latitude,
        longitude: doc.data().gpsdata.longitude,
        timestamp: doc.data().timestamp,
        fishCount: doc.data().fishcount,
      });
    });
    this.setState({ data });
  };

  handleCircleClick = (item) => {
    alert(`GPS Location: (${item.latitude}, ${item.longitude}), Timestamp: ${item.timestamp}, Fish Count: ${item.fishCount}`);
  };

  handleToggleLocalMap = () => {
    this.setState({ showLocalMap: !this.state.showLocalMap });
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      const localData = this.parseFileContent(fileContent);
      this.setState({ localData });
    };
    reader.readAsText(file);
  };

  parseFileContent = (fileContent) => {
    const lines = fileContent.split('\n');
    const localData = [];
    let lastDetectStart = null;
    let lastDetectStop = null;

    lines.forEach((line) => {
      const parts = line.split(':');
      if (parts[0] === 'Route') {
        const timestamp = parts[1];
        const lat = parseFloat(parts[2].split(' ')[1]);
        const lon = parseFloat(parts[2].split(' ')[2]);
        localData.push({ type: 'Route', timestamp, lat, lon });
      } else if (parts[0] === 'DetectStart') {
        lastDetectStart = line;
      } else if (parts[0] === 'DetectStop') {
        if (lastDetectStart && !lastDetectStop) {
          const latStart = parseFloat(lastDetectStart.split(' ')[1].split(':')[1]);
          const lonStart = parseFloat(lastDetectStart.split(' ')[2].split(':')[1]);
          const latStop = parseFloat(line.split(' ')[1].split(':')[1]);
          const lonStop = parseFloat(line.split(' ')[2].split(':')[1]);
          const dur = parseInt(line.split(' ')[3].split(':')[1]);
          const latMid = (latStart + latStop) / 2;
          const lonMid = (lonStart + lonStop) / 2;
          const timestampStart = lastDetectStart.split(':')[1] + ":" + lastDetectStart.split(':')[2] + ":" + lastDetectStart.split(':')[3];
          const timestampStop = line.split(':')[1] + ":" + line.split(':')[2] + ":" + line.split(':')[3];
          localData.push({ type: 'DetectStop', timestamp: timestampStart, timestampStop, lat: latMid, lon: lonMid, dur });
        } else {
          const latStop = parseFloat(line.split(' ')[1].split(':')[1]);
          const lonStop = parseFloat(line.split(' ')[2].split(':')[1]);
          const dur = parseInt(line.split(' ')[3].split(':')[1]);
          const timestampStop = line.split('')[3].split(':')[1] + ":" + line.split(' ')[3].split(':')[2] + ":" + line.split(' ')[3].split(':')[3];
          const timestampStart = lastDetectStop ? lastDetectStop.split(':')[1] + ":" + lastDetectStop.split(':')[2] + ":" + lastDetectStop.split(':')[3] : timestampStop;
          localData.push({ type: 'DetectStop', timestamp: timestampStart, timestampStop, lat: latStop, lon: lonStop, dur });
        }
        lastDetectStop = line;
      }
    });

    console.log('Parsed Data:', localData);
    return localData;
  };

  render() {
    const { google } = this.props;
    const { data, showLocalMap, localData } = this.state;

    const mapStyles = {
      width: '100%',
      height: '100%',
    };

    const defaultLocation = {
      lat: 9.4141,
      lng: 123.24216,
    };

    const blobIcon = (size) => ({
      url: 'assets/blob.png', 
      scaledSize: new window.google.maps.Size(size, size), 
    });
    
    const dataPolylinePaths = data.filter(item => item.latitude && item.longitude).map(item => ({ lat: item.latitude, lng: item.longitude }));
    const localPolylinePaths = localData
      .filter(item => item.type === 'Route')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(item => ({ lat: item.lat, lng: item.lon }));


    return (
      <div>
        <button onClick={this.handleToggleLocalMap}>
          {showLocalMap ? 'View Realtime' : 'View Local'}
        </button>
        <input type="file" onChange={this.handleFileChange} />
        <Map
          google={google}
          zoom={14}
          style={mapStyles}
          initialCenter={defaultLocation}
        >
          {data.map((item) => (
            <Marker
              key={item.id}
              position={{ lat: item.latitude, lng: item.longitude }}
              icon={blobIcon(item.fishCount * 3)} 
              onClick={() => this.handleCircleClick(item)}
            />
          ))}
          <Polyline
            path={dataPolylinePaths}
            options={{
              strokeColor: '#000080',
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        </Map>
        {showLocalMap && (
          <Map
            google={google}
            zoom={14}
            style={mapStyles}
            initialCenter={defaultLocation}
          >
            {localData.map((item, index) => {
              let size;
              if (item.type === 'Route') {
                size = 20;
              } else if (item.type === 'DetectStop') {
                size = item.dur * 2;
              }
              return (
                <Marker
                  key={index}
                  position={{ lat: item.lat, lng: item.lon }}
                  icon={blobIcon(size)}
                />
              );
            })}
            <Polyline
              path={localPolylinePaths}
              options={{
                strokeColor: '#000080',
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          </Map>
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyDbhA2fS8wPqK_IJX5JqYS3O1qT5zDvE6s' })(MapContainer);