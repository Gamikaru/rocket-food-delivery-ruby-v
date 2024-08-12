import AsyncStorage from '@react-native-async-storage/async-storage'; // Importing AsyncStorage for storing data locally on the device
import React, { useState } from 'react'; // Importing React and the useState hook for managing component state
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Importing necessary components from React Native

// Get the dimensions of the device screen
const { width, height } = Dimensions.get('window');

// The LoginScreen component is the main component for handling user login
const LoginScreen = ({ navigation }) => {
    // useState hook for managing the state of the email, password, and error message
    const [email, setEmail] = useState(''); // State to store the user's input for email
    const [password, setPassword] = useState(''); // State to store the user's input for password
    const [errorMessage, setErrorMessage] = useState(''); // State to store any error message that occurs during login

    // Function to handle the login process when the user presses the login button
    const handleLogin = async () => {
        try {
            // Sending the login request to the backend server with the user's email and password
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/login`, {
                method: 'POST', // POST method is used to send data to the server
                headers: {
                    'Content-Type': 'application/json', // Indicating that the content type is JSON
                },
                body: JSON.stringify({ email, password }), // Sending the email and password as JSON
            });

            // Parsing the JSON response from the server
            const data = await response.json();

            // If the login is successful (response.ok) and the server indicates success (data.success)
            if (response.ok && data.success) {
                // Store user-related IDs in AsyncStorage for later use
                await AsyncStorage.setItem('userToken', JSON.stringify({
                    user_id: data.user_id,         // Storing the user's ID
                    customer_id: data.customer_id, // Storing the customer account ID (if available)
                    courier_id: data.courier_id,   // Storing the courier account ID (if available)
                }));

                // Check if the user has both a customer and a courier account
                if (data.customer_id && data.courier_id) {
                    // User has both accounts, navigate to the Account Selection screen
                    navigation.navigate('AccountSelection');
                } else if (data.customer_id) {
                    // User has only a Customer account, navigate directly to the Customer App
                    navigation.navigate('App', {
                        screen: 'CustomerApp',
                    });
                } else if (data.courier_id) {
                    // User has only a Courier account, navigate directly to the Courier App
                    navigation.navigate('App', {
                        screen: 'CourierApp',
                    });
                }

                // Clear any previous error message
                setErrorMessage('');
            } else {
                // If login fails, display an error message
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            // Handle any errors that occur during the login process
            setErrorMessage('Login failed: An error occurred. Please try again.');
            console.error('Login error:', error); // Log the error for debugging
            Alert.alert("Error", "An error occurred while trying to log in. Please check your connection and try again.");
        }
    };


    // The JSX returned by the component defines the UI of the login screen
    return (
        <View style={styles.container}>
            {/* Display the logo at the top of the screen */}
            <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />

            {/* The card container holds the login form */}
            <View style={styles.card}>
                {/* Title and subtitle of the card */}
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>Login to begin</Text>

                {/* Label and input field for the email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email here"
                    placeholderTextColor={styles.placeholderText.color} // The color of the placeholder text
                    value={email}
                    onChangeText={setEmail} // Update the email state when the user types
                    onSubmitEditing={handleLogin} // Submit the login form when the user presses "Enter"
                    returnKeyType="next" // Shows a "Next" button on the keyboard
                    keyboardType="email-address" // Use the email keyboard
                    autoCapitalize="none" // Do not capitalize email input
                />

                {/* Label and input field for the password */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={styles.placeholderText.color} // The color of the placeholder text
                    value={password}
                    secureTextEntry // Hide the text input for the password
                    onChangeText={setPassword} // Update the password state when the user types
                    onSubmitEditing={handleLogin} // Submit the login form when the user presses "Enter"
                    returnKeyType="done" // Shows a "Done" button on the keyboard
                />

                {/* Display the error message if there is one */}
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                {/* Login button that triggers the handleLogin function when pressed */}
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
    errorText: { // Style for the error message
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        alignSelf: 'flex-start',
        fontFamily: 'Oswald-Regular',
    },
});

export default LoginScreen;
