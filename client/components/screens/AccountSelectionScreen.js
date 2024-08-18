import { faTaxi, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Get the height of the window to use for responsive design
const { height, width } = Dimensions.get('window');

// Account selection screen component
const AccountSelectionScreen = ({ navigation }) => {
    // Function to handle account selection
    const handleAccountSelect = async (accountType) => {
        // Store the selected account type (customer or courier) in AsyncStorage
        await AsyncStorage.setItem('selectedUserType', accountType);
        
        // Navigate to the appropriate app screen based on the selected account type
        navigation.navigate('App', {
            screen: accountType === 'customer' ? 'CustomerApp' : 'CourierApp',
        });
    };

    return (
        <View style={styles.container}>
            {/* App logo displayed at the top */}
            <Image source={require('../../assets/images/AppLogoV2.png')} style={styles.logo} />
            <Text style={styles.title}>Select Account Type</Text>

            {/* Container for the customer and courier selection buttons */}
            <View style={styles.optionsContainer}>
                {/* Button for selecting the customer account */}
                <TouchableOpacity style={styles.optionButton} onPress={() => handleAccountSelect('customer')}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} size={100} />
                    <Text style={styles.optionText}>Customer</Text>
                </TouchableOpacity>

                {/* Button for selecting the courier account */}
                <TouchableOpacity style={styles.optionButton} onPress={() => handleAccountSelect('courier')}>
                    <FontAwesomeIcon icon={faTaxi} style={styles.iconBlack} size={100} />
                    <Text style={styles.optionText}>Courier</Text>
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
        backgroundColor: '#FFFFFF',  // Background color remains as is
        paddingTop: height * 0.05,  // Padding top relative to screen height
    },
    logo: {
        width: '80%',  // Width set to 80% of its container
        height: '35%',  // Height set to 35% of its container
        resizeMode: 'contain',  // Contain the logo within its bounds
        marginBottom: height * 0.01,  // Margin bottom relative to screen height
    },
    title: {
        fontSize: width * 0.064,  // Font size relative to screen width
        fontWeight: 'bold',  // Font weight remains bold
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Font family set based on platform
        color: '#222126',  // Text color stays the same
        marginTop: height * -0.024,  // Negative margin top relative to screen height
        marginBottom: height * 0.02,  // Margin bottom relative to screen height
    },
    optionsContainer: {
        flexDirection: 'row',  // Layout options in a row
        justifyContent: 'center',  // Center content horizontally
        width: '80%',  // Width set to 80% of its container
        marginTop: height * 0.03,  // Margin top relative to screen height
    },
    optionButton: {
        alignItems: 'center',  // Center content horizontally
        backgroundColor: '#FFFFFF',  // Background color remains white
        borderRadius: height * 0.012,  // Border radius relative to screen height
        paddingVertical: height * 0.012,  // Padding vertical relative to screen height
        paddingHorizontal: width * 0.027,  // Padding horizontal relative to screen width
        width: '40%',  // Width set to 40% of its container
        marginHorizontal: width * 0.027,  // Margin horizontal relative to screen width
        shadowColor: '#000',  // Shadow color stays black
        shadowOffset: { width: 0, height: height * 0.002 },  // Shadow offset relative to screen height
        shadowOpacity: 0.1,  // Shadow opacity remains the same
        shadowRadius: height * 0.006,  // Shadow radius relative to screen height
        elevation: 5,  // Elevation for Android shadow remains constant
    },
    icon: {
        color: '#DA583B',  // Icon color set to primary color
        marginVertical: height * 0.018,  // Margin vertical relative to screen height
    },
    iconBlack: {
        color: '#000000',  // Icon color set to black
        marginVertical: height * 0.018,  // Margin vertical relative to screen height
    },
    optionText: {
        fontSize: width * 0.059,  // Font size relative to screen width
        color: '#222126',  // Text color stays the same
        fontFamily: Platform.select({
            ios: 'Arial-MT',
            android: 'Arial-MT',
            default: 'Arial-BoldMT',
        }),  // Font family set based on platform
        marginBottom: height * 0.018,  // Margin bottom relative to screen height
        textAlign: 'center',  // Center the text within its container
        flexWrap: 'wrap',  // Ensure text wraps within its container
    },
});

export default AccountSelectionScreen;
