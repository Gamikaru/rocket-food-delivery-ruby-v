import { faTaxi, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

const AccountSelectionScreen = ({ navigation }) => {
    const handleAccountSelect = async (accountType) => {
        await AsyncStorage.setItem('selectedUserType', accountType);
        navigation.navigate('App', {
            screen: accountType === 'customer' ? 'CustomerApp' : 'CourierApp',
        });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />
            <Text style={styles.title}>Select Account Type</Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleAccountSelect('customer')}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} size={100} />
                    <Text style={styles.optionText}>Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => handleAccountSelect('courier')}>
                    <FontAwesomeIcon icon={faTaxi} style={styles.icon} size={100} color='black' />
                    <Text style={styles.optionText}>Courier</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Shift content towards the top
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.select({
            ios: height * 0.05,
            android: height * 0.05,
            default: height * 0.05, // Default for web
        }),
    },
    logo: {
        width: '80%',
        height: Platform.select({
            ios: '35%',
            android: '35%',
            default: '40%', // Adjusting height based on the platform
        }),
        resizeMode: 'contain',
        marginBottom: Platform.select({
            ios: height * 0.005,
            android: height * 0.005,
            default: height * 0.01, // Slightly more margin for web
        }),
    },
    title: {
        fontSize: Platform.select({
            ios: 24,
            android: 24,
            default: 24,
        }),
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT', // Default for web if Oswald is not available
        }),
        color: '#222126',
        marginTop: Platform.select({
            ios: -20,
            android: -20,
            default: -15, // Slightly less negative margin for web
        }),
        marginBottom: Platform.select({
            ios: height * 0.02,
            android: height * 0.02,
            default: height * 0.025, // Slightly more margin for web
        }),
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        marginTop: Platform.select({
            ios: height * 0.03,
            android: height * 0.03,
            default: height * 0.04, // More margin for web
        }),
    },
    optionButton: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 12, // More padding for web
        }),
        paddingHorizontal: 15,
        width: '40%',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    icon: {
        color: '#DA583B',
        marginBottom: 15,
        marginTop: 15,
    },
    optionText: {
        fontSize: Platform.select({
            ios: 22,
            android: 22,
            default: 24, // Larger text size for web
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial-MT',
            android: 'Arial-MT',
            default: 'Arial-BoldMT', // Default for web
        }),
        marginBottom: 15,
    },
});

export default AccountSelectionScreen;
