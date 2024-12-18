import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

// Get device width and height for responsive design
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    // State variables for managing form data, error messages, and loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Enhanced input change handler to reset error messages on input change
    const handleInputChange = useCallback((setter) => (value) => {
        setErrorMessage('');  // Clear error message on input change
        setter(value);        // Set the new input value
    }, []);

    // Email validation function to provide real-time feedback
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to handle the login process
    const handleLogin = useCallback(async () => {
        // Validate email format
        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // Ensure password length is adequate
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true); // Show loading indicator while processing login

        try {
            // Sending login credentials to the API
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL || ''}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            console.log('Login response data:', data); // Log API response for debugging

            if (response.ok && data.success) {
                // Prepare and store user token data in AsyncStorage
                const userTokenData = {
                    user_id: data.user_id || '',
                    customer_id: data.customer_id || null,
                    courier_id: data.courier_id || null,
                };

                await AsyncStorage.setItem('userToken', JSON.stringify(userTokenData));

                // Navigation based on the user role (customer or courier)
                if (userTokenData.customer_id && userTokenData.courier_id) {
                    console.log('Navigating to AccountSelection'); // Debug log
                    navigation.navigate('AccountSelection');
                } else if (userTokenData.customer_id) {
                    console.log('Navigating to CustomerApp'); // Debug log
                    navigation.navigate('App', { screen: 'CustomerApp' });
                } else if (userTokenData.courier_id) {
                    console.log('Navigating to CourierApp'); // Debug log
                    navigation.navigate('App', { screen: 'CourierApp' });
                } else {
                    setErrorMessage('Unexpected error: No valid account type found.');
                }

                // Reset form fields on successful login
                setEmail('');
                setPassword('');
                setErrorMessage('');
            } else {
                // Provide specific error feedback based on response status
                if (response.status === 401) {
                    setErrorMessage('Invalid email or password.');
                } else {
                    setErrorMessage('Login failed: An unexpected error occurred.');
                }
            }
        } catch (error) {
            console.error('Login failed due to an error:', error);
            setErrorMessage('Login failed: An error occurred. Please try again.');
            Alert.alert("Error", "An error occurred while trying to log in. Please check your connection and try again.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    }, [email, password, navigation]);

    return (
        // KeyboardAvoidingView ensures the input fields are not obscured by the keyboard
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* TouchableWithoutFeedback dismisses the keyboard when tapping outside of input fields */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"  // Prevents keyboard dismissal when interacting with other elements
                >
                    <View style={styles.container}>
                        {/* App logo */}
                        <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Welcome Back</Text>
                            <Text style={styles.cardSubtitle}>Login to begin</Text>

                            {/* Email Input */}
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={handleInputChange(setEmail)}
                                onSubmitEditing={handleLogin}
                                returnKeyType="next"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Enter your primary email here"
                                placeholderTextColor="#ccc"
                                secureTextEntry={false}
                                accessibilityLabel="Email"
                                accessibilityHint="Enter your email address"
                            />

                            {/* Password Input */}
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                secureTextEntry={true}  // Secure text entry for passwords
                                onChangeText={handleInputChange(setPassword)}
                                onSubmitEditing={handleLogin}
                                returnKeyType="done"
                                placeholder="***********"
                                placeholderTextColor="#ccc"
                                accessibilityLabel="Password"
                                accessibilityHint="Enter your password"
                            />

                            {/* Display error message if any */}
                            {errorMessage ? (
                                <Text style={styles.errorText} accessibilityLiveRegion="assertive">
                                    {errorMessage}
                                </Text>
                            ) : null}

                            {/* Loading Indicator */}
                            {loading ? <ActivityIndicator size="large" color="#DA583B" /> : null}

                            {/* Login Button */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleLogin}
                                accessible={true}
                                accessibilityRole="button"
                                accessibilityLabel="Log in"
                                accessibilityHint="Tap to log in to your account"
                            >
                                <Text style={styles.buttonText}>LOG IN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

// Styles for the LoginScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,  // Occupies full screen height
        justifyContent: 'flex-start',  // Aligns content to the top of the container
        alignItems: 'center',  // Centers content horizontally
        backgroundColor: '#FFFFFF',  // White background for the entire screen
    },
    logo: {
        width: width * 0.8,  // Responsive width for the logo
        height: height * 0.4,  // Responsive height for the logo
        resizeMode: 'contain',  // Ensures the image fits within its bounds
        marginBottom: height * -0.05,  // Overlap effect for the logo
    },
    card: {
        width: '80%',  // Card width relative to the screen width
        padding: height * 0.04,  // Responsive padding inside the card
        borderRadius: 8,  // Rounded corners for the card
        backgroundColor: '#fff',  // White background color for the card
        shadowColor: '#000',  // Shadow color
        shadowOffset: { width: 0, height: height * 0.002 },  // Slight shadow effect
        shadowOpacity: 0.1,  // Subtle shadow opacity
        shadowRadius: height * 0.006,  // Radius of the shadow
        elevation: 5,  // Elevation for Android shadow
        alignItems: 'center',  // Center content horizontally within the card
    },
    cardTitle: {
        fontSize: width * 0.064,  // Responsive font size
        marginBottom: height * 0.012,  // Space below the title
        fontWeight: 'normal',  // Normal font weight
        color: '#222126',  // Dark text color
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Font selection based on platform
        alignSelf: 'flex-start',  // Align text to the start of the card
    },
    cardSubtitle: {
        fontSize: width * 0.04,  // Responsive font size for the subtitle
        marginBottom: height * 0.024,  // Space below the subtitle
        color: '#222126',  // Dark text color
        fontWeight: 'bold',  // Bold font weight
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Font selection based on platform
        alignSelf: 'flex-start',  // Align text to the start of the card
    },
    label: {
        fontSize: width * 0.032,  // Responsive font size for labels
        color: '#222126',  // Dark text color
        marginTop: height * 0.012,  // Top margin for spacing
        marginBottom: height * 0.006,  // Bottom margin for spacing
        fontFamily: 'Arial',  // Default font family for labels
        alignSelf: 'flex-start',  // Align labels to the start of the card
    },
    input: {
        width: '100%',  // Input field occupies full width of the card
        padding: height * 0.015,  // Responsive padding inside input field
        marginBottom: height * 0.010,  // Space below the input field
        fontSize: width * 0.033,  // Responsive font size for input text
        borderRadius: 8,  // Match the card's border-radius
        backgroundColor: '#fff',  // Match the card's background color
        shadowColor: '#000',  // Match the card's shadow color
        shadowOffset: { width: 0, height: height * 0.002 },  // Match the card's shadow offset
        shadowOpacity: 0.1,  // Match the card's shadow opacity
        shadowRadius: height * 0.006,  // Match the card's shadow radius
        elevation: 5,  // Match the card's elevation for Android
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),  // Platform-specific font family for input fields
    },
    button: {
        backgroundColor: '#DA583B',  // Primary button background color
        padding: height * 0.010,  // Responsive padding for the button
        borderRadius: height * 0.007,  // Border radius relative to screen height
        alignItems: 'center',  // Center align button text horizontally
        marginTop: height * 0.012,  // Space above the button
        width: '100%',  // Button occupies full width of the card
    },
    buttonText: {
        color: '#FFFFFF',  // White text color for the button
        fontSize: width * 0.04,  // Responsive font size for button text
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Platform-specific font family for button text
        textTransform: 'uppercase',  // Uppercase text for button
    },
    errorText: {
        color: '#851919',  // Error text color
        fontSize: width * 0.037,  // Responsive font size for error message
        marginBottom: height * 0.012,  // Space below the error message
        alignSelf: 'flex-start',  // Align error message to the start of the card
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),  // Platform-specific font family for error text
    },
});

export default LoginScreen;
