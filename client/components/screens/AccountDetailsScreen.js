import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
            setAccountPhone(data.account_phone); // Mapping phone number
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
        }
    };

    if (!userType) {
        return null; // Prevent rendering until userType is determined
    }

    const handleSave = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const { customer_id, courier_id } = JSON.parse(userToken);
            const body = {
                account_email: accountEmail, // Ensure this matches the API field
                account_phone: accountPhone, // Ensure this matches the API field
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
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MY ACCOUNT</Text>
            <Text style={styles.subTitle}>Logged In As: {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>
            <Text style={styles.label}>Primary Email (Read Only)</Text>
            <TextInput
                style={styles.input}
                value={primaryEmail} // Use correct state variable
                editable={false}
            />
            <Text style={styles.helperText}>Email used to login to the application.</Text>
            <Text style={styles.label}>{userType === 'customer' ? 'Customer Email' : 'Courier Email'}</Text>
            <TextInput
                style={styles.input}
                value={accountEmail} // Use correct state variable
                onChangeText={setAccountEmail}
            />
            <Text style={styles.helperText}>Email used for your {userType.charAt(0).toUpperCase() + userType.slice(1)} account.</Text>
            <Text style={styles.label}>{userType === 'customer' ? 'Customer Phone' : 'Courier Phone'}</Text>
            <TextInput
                style={styles.input}
                value={accountPhone} // Use correct state variable
                onChangeText={setAccountPhone}
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
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#222126',
        marginBottom: height * 0.02,
    },
    subTitle: {
        fontSize: width * 0.045,
        color: '#222126',
        marginBottom: height * 0.03,
    },
    label: {
        fontSize: width * 0.04,
        color: '#222126',
        marginBottom: height * 0.01,
        fontFamily: 'Oswald-Regular',
    },
    input: {
        width: '100%',
        padding: width * 0.03,
        marginBottom: height * 0.015,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    helperText: {
        fontSize: width * 0.035,
        color: '#666666',
        marginBottom: height * 0.02,
    },
    button: {
        backgroundColor: '#DA583B',
        padding: height * 0.02,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default AccountDetailsScreen;
