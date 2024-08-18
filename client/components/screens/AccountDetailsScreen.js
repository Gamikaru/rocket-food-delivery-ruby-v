import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// ACCOUNT DETAILS SCREEN COMPONENT: Manages user account information display and update
const AccountDetailsScreen = () => {
    // STATE MANAGEMENT: Store user account details and user type
    const [primaryEmail, setPrimaryEmail] = useState('');
    const [accountEmail, setAccountEmail] = useState('');
    const [accountPhone, setAccountPhone] = useState('');
    const [userType, setUserType] = useState(null);

    // EFFECT: Fetch user details when the component mounts
    useEffect(() => {
        fetchUserDetails();
    }, []);

    // FUNCTION: Fetches user details from AsyncStorage and API
    const fetchUserDetails = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const { customer_id, courier_id } = JSON.parse(userToken);

            const selectedUserType = await AsyncStorage.getItem('selectedUserType');
            setUserType(selectedUserType);

            // Determine the endpoint based on the user type and fetch the data
            if (selectedUserType) {
                const userId = selectedUserType === 'customer' ? customer_id : courier_id;
                if (userId) {
                    await fetchData(`${process.env.EXPO_PUBLIC_URL}/api/account/${userId}?type=${selectedUserType}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'Unable to fetch account details. Please try again later.');
        }
    };

    // FUNCTION: Fetches account data from the API
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setPrimaryEmail(data.primary_email);
            setAccountEmail(data.account_email);
            setAccountPhone(formatPhoneNumber(data.account_phone));
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
        }
    };

    // FUNCTION: Formats a phone number into a standard format (e.g., 123-456-7890)
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : phoneNumber;
    };

    // FUNCTION: Handles phone number input change and applies formatting
    const handlePhoneChange = (text) => {
        const formattedPhoneNumber = formatPhoneNumber(text);
        setAccountPhone(formattedPhoneNumber);
    };

    // RENDER GUARD: Prevent rendering until userType is determined
    if (!userType) {
        return null;
    }

    // FUNCTION: Handles saving the updated account details
    const handleSave = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const { customer_id, courier_id } = JSON.parse(userToken);

            const rawPhoneNumber = accountPhone.replace(/\D/g, ''); // Remove non-digit characters

            const body = {
                account_email: accountEmail,
                account_phone: rawPhoneNumber,
                account_type: userType,
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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                {/* TITLE SECTION */}
                <Text style={styles.title}>MY ACCOUNT</Text>
                <Text style={styles.subTitle}>Logged In As: {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>

                {/* PRIMARY EMAIL INPUT (READ-ONLY) */}
                <Text style={styles.label}>Primary Email (Read Only)</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={primaryEmail}
                    editable={false}
                />
                <Text style={styles.helperText}>Email used to login to the application.</Text>

                {/* ACCOUNT EMAIL INPUT */}
                <Text style={styles.label}>{userType === 'customer' ? 'Customer Email' : 'Courier Email'}</Text>
                <TextInput
                    style={styles.input}
                    value={accountEmail}
                    onChangeText={setAccountEmail}
                />
                <Text style={styles.helperText}>Email used for your {userType.charAt(0).toUpperCase() + userType.slice(1)} account.</Text>

                {/* ACCOUNT PHONE INPUT */}
                <Text style={styles.label}>{userType === 'customer' ? 'Customer Phone' : 'Courier Phone'}</Text>
                <TextInput
                    style={[styles.input, styles.phoneInput]}
                    value={accountPhone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                />
                <Text style={styles.helperText}>Phone number for your {userType.charAt(0).toUpperCase() + userType.slice(1)} account.</Text>

                {/* UPDATE ACCOUNT BUTTON */}
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>UPDATE ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// STYLES: Defines styles for various components used in the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,  // Ensures the container takes up the full screen height
        padding: width * 0.05,  // Padding set as a percentage of the screen width for consistency across devices
        backgroundColor: '#FFFFFF',  // White background color for the screen
    },
    scrollViewContent: {
        flexGrow: 1,  // Ensures the ScrollView content expands to fill the viewport
    },
    title: {
        fontSize: width * 0.07,  // Font size scaled according to screen width
        fontWeight: 'bold',  // Bold font weight for emphasis
        color: '#222126',  // Dark grey text color
        marginBottom: height * 0.02,  // Bottom margin relative to screen height
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',  // Uses 'Oswald-Regular' on iOS
            android: 'Roboto-Bold',  // Uses 'Roboto-Bold' on Android
            default: 'sans-serif',  // Fallback font for other platforms
        }),
    },
    subTitle: {
        fontSize: width * 0.045,  // Slightly smaller font size for subtitles
        color: '#222126',  // Consistent text color
        marginBottom: height * 0.025,  // Bottom margin relative to screen height
        fontFamily: Platform.select({
            ios: 'Arial-MT',  // Uses 'Arial-MT' on iOS
            android: 'sans-serif',  // Uses default sans-serif on Android
            default: 'Arial',  // Fallback font for other platforms
        }),
    },
    label: {
        fontSize: width * 0.035,  // Smaller font size for labels
        color: '#222126',  // Consistent text color
        marginBottom: height * 0.01,  // Bottom margin relative to screen height
        fontFamily: Platform.select({
            ios: 'Arial-MT',  // Uses 'Arial-MT' on iOS
            android: 'sans-serif',  // Uses default sans-serif on Android
            default: 'Arial',  // Fallback font for other platforms
        }),
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
    readOnlyInput: {
        color: '#888888',  // Grey color for the read-only text
    },
    phoneInput: {
        fontSize: width * 0.035,  // Slightly larger font size for phone input
    },
    helperText: {
        fontSize: width * 0.025,  // Smaller font size for helper text
        color: '#666666',  // Grey color for less emphasis
        marginBottom: height * 0.025,  // Bottom margin for spacing relative to screen height
        fontFamily: Platform.select({
            ios: 'Arial',  // Uses 'Arial' on iOS
            android: 'Roboto',  // Uses 'Roboto' on Android
            default: 'sans-serif',  // Fallback font for other platforms
        }),
        marginTop:  - height * 0.005,  // Negative margin to pull it closer to the input field above
    },
    button: {
        backgroundColor: '#DA583B',  // Custom orange color for the button
        paddingVertical: height * 0.010,  // Vertical padding for the button
        paddingHorizontal: width * 0.05,  // Horizontal padding for the button
        borderRadius: height * 0.006,  // Rounded corners for the button relative to screen height
        alignItems: 'center',  // Center-aligns text inside the button
        marginTop: height * 0.025,  // Top margin relative to screen height
    },
    buttonText: {
        color: '#FFFFFF',  // White color for button text
        fontSize: width * 0.04,  // Font size adjusted based on screen width
        textTransform: 'uppercase',  // Transforms the text to uppercase
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',  // Uses 'Oswald-Regular' on iOS
            android: 'Roboto-Bold',  // Uses 'Roboto-Bold' on Android
            default: 'sans-serif',  // Fallback font for other platforms
        }),
    },
});

// EXPORT: Make AccountDetailsScreen available for import in other files
export default AccountDetailsScreen;
