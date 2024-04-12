import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Button, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const regions = [
    { name: 'Region I - Ilocos Region', provinces: [
      { name: 'Ilocos Norte', cities: ['Laoag', 'Batac', 'Paoay', 'Pagudpud'] },
      { name: 'Ilocos Sur', cities: ['Vigan', 'Candon', 'Narvacan'] },
      { name: 'La Union', cities: ['San Fernando', 'Agoo', 'Bauang'] },
      { name: 'Pangasinan', cities: ['Lingayen', 'Urdaneta', 'Dagupan'] }
    ] },
    { name: 'Region II - Cagayan Valley', provinces: [
      { name: 'Cagayan', cities: ['Tuguegarao', 'Aparri', 'Bayombong'] },
      { name: 'Isabela', cities: ['Ilagan', 'Cauayan', 'Santiago'] },
      { name: 'Nueva Vizcaya', cities: ['Bayombong', 'Solano'] },
      { name: 'Quirino', cities: ['Cabarroguis'] }
    ] },
    { name: 'Region III - Central Luzon', provinces: [
      { name: 'Aurora', cities: ['Baler', 'Casiguran', 'Dilasag'] },
      { name: 'Bataan', cities: ['Balanga', 'Orani', 'Mariveles'] },
      { name: 'Bulacan', cities: ['Malolos', 'Meycauayan', 'San Jose del Monte'] },
      { name: 'Nueva Ecija', cities: ['Palayan', 'Cabanatuan', 'San Jose City'] },
      { name: 'Pampanga', cities: ['San Fernando', 'Angeles', 'Mabalacat'] },
      { name: 'Tarlac', cities: ['Tarlac City', 'Paniqui', 'Capas'] },
      { name: 'Zambales', cities: ['Iba', 'Olongapo', 'Masinloc'] }
    ] },
    { name: 'Region IV-A - CALABARZON', provinces: [
      { name: 'Batangas', cities: ['Batangas City', 'Lipa', 'Tanauan'] },
      { name: 'Cavite', cities: ['Tagaytay', 'Cavite City', 'Dasmarinas'] },
      { name: 'Laguna', cities: ['Santa Cruz', 'San Pablo', 'Calamba'] },
      { name: 'Quezon', cities: ['Lucena', 'Tayabas', 'Pagbilao'] },
      { name: 'Rizal', cities: ['Antipolo', 'Cainta', 'Rodriguez'] }
    ] },
    { name: 'Region IV-B - MIMAROPA', provinces: [
      { name: 'Marinduque', cities: ['Boac', 'Gasan', 'Sta. Cruz'] },
      { name: 'Occidental Mindoro', cities: ['Mamburao', 'San Jose', 'Sablayan'] },
      { name: 'Oriental Mindoro', cities: ['Calapan', 'Roxas', 'Puerto Galera'] },
      { name: 'Palawan', cities: ['Puerto Princesa', 'Coron', 'El Nido'] },
      { name: 'Romblon', cities: ['Romblon', 'San Agustin', 'Magdiwang'] }
    ] },
    { name: 'Region V - Bicol Region', provinces: [
      { name: 'Albay', cities: ['Legazpi', 'Ligao', 'Tabaco'] },
      { name: 'Camarines Norte', cities: ['Daet', 'Vinzons', 'Mercedes'] },
      { name: 'Camarines Sur', cities: ['Naga', 'Iriga', 'Pili'] },
      { name: 'Catanduanes', cities: ['Virac', 'San Andres', 'Baras'] },
      { name: 'Masbate', cities: ['Masbate City', 'Mandaon', 'Cataingan'] },
      { name: 'Sorsogon', cities: ['Sorsogon City', 'Bulan', 'Matnog'] }
    ] },
    { name: 'Region VI - Western Visayas', provinces: [
      { name: 'Aklan', cities: ['Kalibo', 'Banga', 'Batan'] },
      { name: 'Antique', cities: ['San Jose', 'Sibalom', 'Culasi'] },
      { name: 'Capiz', cities: ['Roxas City', 'Panay', 'Pilar'] },
      { name: 'Guimaras', cities: ['Jordan', 'Buenavista', 'Nueva Valencia'] },
      { name: 'Iloilo', cities: ['Iloilo City', 'Passi', 'Miagao'] },
      { name: 'Negros Occidental', cities: ['Bacolod', 'Bago', 'Cadiz'] }
    ] },
    { name: 'Region VII - Central Visayas', provinces: [
      { name: 'Bohol', cities: ['Tagbilaran', 'Talibon', 'Balilihan'] },
      { name: 'Cebu', cities: ['Cebu City', 'Mandaue', 'Lapu-Lapu'] },
      { name: 'Negros Oriental', cities: ['Dumaguete', 'Guihulngan', 'Bais','San Jose'] },
      { name: 'Siquijor', cities: ['Siquijor', 'Larena', 'Lazi'] }
    ] },
    { name: 'Region VIII - Eastern Visayas', provinces: [
      { name: 'Biliran', cities: ['Naval', 'Biliran', 'Kawayan'] },
      { name: 'Eastern Samar', cities: ['Borongan', 'Guiuan', 'Dolores'] },
      { name: 'Leyte', cities: ['Tacloban', 'Ormoc', 'Baybay'] },
      { name: 'Northern Samar', cities: ['Catarman', 'Calbayog', 'Laoang'] },
      { name: 'Samar', cities: ['Catbalogan', 'Calbayog', 'Basey'] },
      { name: 'Southern Leyte', cities: ['Maasin', 'Sogod', 'Limasawa'] }
    ] },
    { name: 'Region IX - Zamboanga Peninsula', provinces: [
      { name: 'Zamboanga del Norte', cities: ['Dipolog', 'Dapitan', 'Liloy'] },
      { name: 'Zamboanga del Sur', cities: ['Pagadian', 'Dinas', 'Dumalinao'] },
    ]},

];

const HomeScreen = () => {
    const navigation = useNavigation(); 
    const [selectedRegion, setSelectedRegion] = useState(regions[0].name);
    const [selectedProvince, setSelectedProvince] = useState(regions[0].provinces[0].name);
    const [selectedCity, setSelectedCity] = useState(regions[0].provinces[0].cities[0]);
    const [modalVisible, setModalVisible] = useState(false);
  
    const handleExplore = () => {
      setModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);

      navigation.navigate('DataScreen');
    };
  
    return (
      <ImageBackground source={require('../assets/loginbackground.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to EcoFish</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={handleExplore}>
            <Text style={styles.buttonText}>Explore</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Region, Province, and City</Text>
            <Picker
              selectedValue={selectedRegion}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedRegion(itemValue)}
            >
              {regions.map((region, index) => (
                <Picker.Item key={index} label={region.name} value={region.name} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedProvince}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedProvince(itemValue)}
            >
              {selectedRegion && regions.find(region => region.name === selectedRegion)?.provinces.map((province, index) => (
                <Picker.Item key={index} label={province.name} value={province.name} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedCity}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
            >
              {selectedProvince && regions.find(region => region.name === selectedRegion)?.provinces.find(province => province.name === selectedProvince)?.cities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            <Button title="Enter" onPress={handleCloseModal} />
          </View>
        </Modal>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 30,
    },
    exploreButton: {
      backgroundColor: '#3498db',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 20,
    },
    picker: {
      width: '20%',
      backgroundColor: '#ffffff',
      marginBottom: 20,
    },
  });
  
  export default HomeScreen;