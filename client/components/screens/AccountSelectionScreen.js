import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const AccountSelectionScreen = ({ navigation }) => {
    const handleAccountSelect = async (accountType) => {
        await AsyncStorage.setItem('selectedUserType', accountType); // Store the selected user type
        navigation.navigate('App', {
            screen: accountType === 'customer' ? 'CustomerApp' : 'CourierApp',
        });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Account</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAccountSelect('customer')}>
                <Text style={styles.buttonText}>Customer Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleAccountSelect('courier')}>
                <Text style={styles.buttonText}>Courier Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#222126',
    },
    button: {
        backgroundColor: '#DA583B',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AccountSelectionScreen;
