import AsyncStorage from '@react-native-async-storage/async-storage'; // Importing AsyncStorage for local storage operations
import React, { useState } from 'react'; // Importing React and useState hook
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Importing necessary components from react-native

const { width, height } = Dimensions.get('window');

// Functional component definition for the login screen
const LoginScreen = ({ navigation }) => {
    // State hooks for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle login button press
    const handleLogin = async () => {
        // Check if the entered username and password are correct
        if (username === 'user' && password === 'pass') {
            try {
                // Store a dummy auth token in AsyncStorage
                await AsyncStorage.setItem('userToken', 'dummy-auth-token');
                // Navigate to the Restaurants screen inside the App navigator
                navigation.navigate('App', {
                    screen: 'Restaurants'
                });
            } catch (e) {
                // Display an alert if there's an error while storing the token
                Alert.alert('Login failed', 'An error occurred while logging in');
            }
        } else {
            // Display an alert if the entered credentials are invalid
            Alert.alert('Login failed', 'Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
            {/* Displaying the logo */}
            <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />
            {/* Card container for the login form */}
            <View style={styles.card}>
                {/* Welcome text */}
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>Login to begin</Text>
                {/* Email input field */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your primary email here"
                    placeholderTextColor={styles.placeholderText.color} // Apply placeholder text color
                    value={username}
                    onChangeText={setUsername} // Update username state on text change
                />
                {/* Password input field */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={styles.placeholderText.color} // Apply placeholder text color
                    value={password}
                    secureTextEntry // Secure text entry for password
                    onChangeText={setPassword} // Update password state on text change
                />
                {/* Login button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: width * 0.8,
        height: height * 0.4,
        resizeMode: 'contain',
        marginBottom: -50,
    },
    card: {
        width: '80%',
        padding: 30,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'normal',
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        alignSelf: 'flex-start',
    },
    cardSubtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 14,
        color: '#222126',
        marginBottom: 5,
        fontFamily: 'Oswald-Regular',
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#F5F5F5',
        fontFamily: 'Oswald-Regular',
    },
    button: {
        backgroundColor: '#DA583B',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Oswald-SemiBold',
        textTransform: 'uppercase',
    },
    placeholderText: {
        color: '#A9A9A9',
        fontSize: 16,
        fontFamily: 'Oswald-Light',
    },
});

export default LoginScreen;
