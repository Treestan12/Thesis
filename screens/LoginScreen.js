import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../Firebase'; 
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; 

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async () => {
    if (username && password) {
      try {
        const userRef = await addDoc(collection(db, 'users'), {
          username: username,
          password: password,
        });

        Alert.alert('User added with ID:', userRef.id);
        navigation.navigate('Home');

      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }
    }
  };

  const handleLogin = async () => {
    if (username && password) {
      try {
        const q = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Invalid Credentials', 'Username or password is incorrect. Please try again.');
        }
      } catch (error) {
        console.error('Error querying Firestore:', error);
      }
    }
  };

  return (
    <ImageBackground source={require('../assets/loginbackground.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>{'ECHOFISH'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000000"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={isSignUp ? handleSignUp : handleLogin}>
          <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Login"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchText} onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    marginVertical: 50,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#000000',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchText: {
    color: '#ffffff',
    fontSize: 16,
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
