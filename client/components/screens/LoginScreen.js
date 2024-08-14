import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await AsyncStorage.setItem('userToken', JSON.stringify({
                    user_id: data.user_id,
                    customer_id: data.customer_id,
                    courier_id: data.courier_id,
                }));

                if (data.customer_id && data.courier_id) {
                    navigation.navigate('AccountSelection');
                } else if (data.customer_id) {
                    navigation.navigate('App', { screen: 'CustomerApp' });
                } else if (data.courier_id) {
                    navigation.navigate('App', { screen: 'CourierApp' });
                }

                setErrorMessage('');
            } else {
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            setErrorMessage('Login failed: An error occurred. Please try again.');
            console.error('Login error:', error);
            Alert.alert("Error", "An error occurred while trying to log in. Please check your connection and try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>Login to begin</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email here"
                    placeholderTextColor={styles.placeholderText.color}
                    value={email}
                    onChangeText={setEmail}
                    onSubmitEditing={handleLogin}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={styles.placeholderText.color}
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

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
        marginBottom: Platform.select({
            ios: -50,
            android: -50,
            default: -50,
        }),
    },
    card: {
        width: '80%',
        padding: Platform.select({
            ios: 30,
            android: 30,
            default: 30,
        }),
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
        fontSize: Platform.select({
            ios: 24,
            android: 24,
            default: 24,
        }),
        marginBottom: 10,
        fontWeight: 'normal',
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        alignSelf: 'flex-start',
    },
    cardSubtitle: {
        fontSize: Platform.select({
            ios: 18,
            android: 18,
            default: 18,
        }),
        marginBottom: 20,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: Platform.select({
            ios: 14,
            android: 14,
            default: 14,
        }),
        color: '#222126',
        marginBottom: 5,
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        padding: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#F5F5F5',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),
    },
    button: {
        backgroundColor: '#DA583B',
        padding: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: Platform.select({
            ios: 18,
            android: 18,
            default: 18,
        }),
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-SemiBold',
            android: 'Oswald-SemiBold',
            default: 'Arial-BoldMT',
        }),
        textTransform: 'uppercase',
    },
    placeholderText: {
        color: '#A9A9A9',
        fontSize: Platform.select({
            ios: 16,
            android: 16,
            default: 16,
        }),
        fontFamily: Platform.select({
            ios: 'Oswald-Light',
            android: 'Oswald-Light',
            default: 'Arial',
        }),
    },
    errorText: {
        color: 'red',
        fontSize: Platform.select({
            ios: 14,
            android: 14,
            default: 14,
        }),
        marginBottom: 10,
        alignSelf: 'flex-start',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),
    },
});

export default LoginScreen;
