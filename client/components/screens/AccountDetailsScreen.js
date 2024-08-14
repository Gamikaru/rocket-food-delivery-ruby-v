import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, PixelRatio, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const AccountDetailsScreen = () => {
    const [primaryEmail, setPrimaryEmail] = useState('');
    const [accountEmail, setAccountEmail] = useState('');
    const [accountPhone, setAccountPhone] = useState('');
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const { customer_id, courier_id } = JSON.parse(userToken);

            const selectedUserType = await AsyncStorage.getItem('selectedUserType'); // Fetch the selected user type
            setUserType(selectedUserType);

            if (selectedUserType === 'customer' && customer_id) {
                await fetchData(`${process.env.EXPO_PUBLIC_URL}/api/account/${customer_id}?type=customer`);
            } else if (selectedUserType === 'courier' && courier_id) {
                await fetchData(`${process.env.EXPO_PUBLIC_URL}/api/account/${courier_id}?type=courier`);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'Unable to fetch account details. Please try again later.');
        }
    };

    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setPrimaryEmail(data.primary_email); // Mapping primary email
            setAccountEmail(data.account_email); // Mapping account-specific email
            setAccountPhone(formatPhoneNumber(data.account_phone)); // Mapping account-specific phone number
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
        }
    };

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    };

    const handlePhoneChange = (text) => {
        const formattedPhoneNumber = formatPhoneNumber(text);
        setAccountPhone(formattedPhoneNumber);
    };

    if (!userType) {
        return null; // Prevent rendering until userType is determined
    }

    const handleSave = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const { customer_id, courier_id } = JSON.parse(userToken);

            const rawPhoneNumber = accountPhone.replace(/\D/g, ''); // Remove non-digit characters

            const body = {
                account_email: accountEmail, // Ensure this matches the API field
                account_phone: rawPhoneNumber, // Send the raw, unformatted phone number
                account_type: userType, // Send the user type to the API
            };

            const endpoint = `${process.env.EXPO_PUBLIC_URL}/api/account/${userType === 'customer' ? customer_id : courier_id}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert('Success', 'Account details updated successfully.');
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to update account details. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating account details:', error);
            Alert.alert('Error', 'Unable to update account details. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MY ACCOUNT</Text>
            <Text style={styles.subTitle}>Logged In As: {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>
            <Text style={styles.label}>Primary Email (Read Only)</Text>
            <TextInput
                style={styles.input}
                value={primaryEmail}
                editable={false}
            />
            <Text style={styles.helperText}>Email used to login to the application.</Text>
            <Text style={styles.label}>{userType === 'customer' ? 'Customer Email' : 'Courier Email'}</Text>
            <TextInput
                style={styles.input}
                value={accountEmail}
                onChangeText={setAccountEmail}
            />
            <Text style={styles.helperText}>Email used for your {userType.charAt(0).toUpperCase() + userType.slice(1)} account.</Text>
            <Text style={styles.label}>{userType === 'customer' ? 'Customer Phone' : 'Courier Phone'}</Text>
            <TextInput
                style={[styles.input, styles.phoneInput]} // Apply additional styling for phone number
                value={accountPhone}
                onChangeText={handlePhoneChange} // Apply formatting as the user types
                keyboardType="phone-pad"
            />
            <Text style={styles.helperText}>Phone number for your {userType.charAt(0).toUpperCase() + userType.slice(1)} account.</Text>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>UPDATE ACCOUNT</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: '#F7F7F7',
    },
    title: {
        fontSize: PixelRatio.roundToNearestPixel(width * 0.055), // Adjusting for screen size and density
        fontWeight: 'bold',
        color: '#222126',
        marginBottom: 15,
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Roboto-Bold',
            default: 'sans-serif',
        }),
    },
    subTitle: {
        fontSize: PixelRatio.roundToNearestPixel(width * 0.04),
        color: '#222126',
        marginBottom: 20,
        fontFamily: Platform.select({
            ios: 'Arial-MT',
            android: 'sans-serif',
            default: 'Arial',
        }),
    },
    label: {
        fontSize: PixelRatio.roundToNearestPixel(width * 0.035),
        color: '#222126',
        marginBottom: 8,
        fontFamily: Platform.select({
            ios: 'Arial-MT',
            android: 'sans-serif',
            default: 'Arial',
        }),
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Roboto',
            default: 'sans-serif',
        }),
    },
    phoneInput: {
        fontSize: PixelRatio.roundToNearestPixel(width * 0.04), // Adjusting for phone input font size
    },
    helperText: {
        fontSize: PixelRatio.roundToNearestPixel(width * 0.025),
        color: '#666666',
        marginBottom: 20,
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Roboto',
            default: 'sans-serif',
        }),
        marginTop: -8,
    },
    button: {
        backgroundColor: '#DA583B',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: PixelRatio.roundToNearestPixel(width * 0.045),
        textTransform: 'uppercase',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Roboto-Bold',
            default: 'sans-serif',
        }),
    },
});

export default AccountDetailsScreen;
