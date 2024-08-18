import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigating between screens
import React from 'react'; // Import React
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Import necessary React Native components

const { width, height } = Dimensions.get('window'); // Get the dimensions of the window to make styling responsive

// Check if the device is an iPad based on the aspect ratio
const isTablet = Platform.OS === 'ios' && (height / width) < 1.6;

const Header = () => {
    const navigation = useNavigation(); // Access navigation prop for screen transitions

    return (
        <View style={styles.header}>
            {/* App Logo */}
            <Image source={require('../assets/images/AppLogoV1.png')} style={styles.headerLogo} />

            {/* Log Out Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.logoutButtonText}>LOG OUT</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles for the Header component
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', // Arrange children in a row
        justifyContent: 'space-between', // Space out children evenly with space between them
        alignItems: 'center', // Align children to the center vertically
        backgroundColor: '#FFFFFF', // Set header background color to white
        paddingTop: Platform.select({ ios: 20, android: 18, default: 20 }), // Top padding adjusted for different platforms
        paddingLeft: Platform.select({ ios: 10, android: 8, default: 10 }), // Left padding adjusted for different platforms
        shadowColor: '#000', // Set shadow color to black
        shadowOffset: { width: 0, height: 2 }, // Set shadow offset
        shadowOpacity: 0.1, // Set shadow opacity
        shadowRadius: 5, // Set shadow radius
        elevation: 3, // Set elevation for Android to create shadow
    },
    headerLogo: {
        width: isTablet ? width * 0.35 : width * 0.5, // Adjust logo width for iPad
        height: isTablet ? height * 0.1 : height * 0.14, // Adjust logo height for iPad
        resizeMode: 'contain', // Ensure logo maintains its aspect ratio
        marginLeft: Platform.select({ ios: 10, android: 8, default: 10 }), // Left margin adjusted for different platforms
        marginTop: Platform.select({ ios: 5, android: 3, default: 5 }), // Top margin adjusted for different platforms
    },
    logoutButton: {
        backgroundColor: '#DA583B', // Set button background color to a custom orange
        paddingVertical: Platform.select({ ios: 12, android: 12, default: 12 }), // Vertical padding adjusted for different platforms
        paddingHorizontal: Platform.select({ ios: 25, android: 22, default: 25 }), // Horizontal padding adjusted for different platforms
        borderRadius: 8, // Round the corners of the button
        marginRight: Platform.select({ ios: 25, android: 20, default: 25 }), // Right margin adjusted for different platforms
        marginTop: Platform.select({ ios: 8, android: 5, default: 5 }), // Top margin adjusted for different platforms
    },
    logoutButtonText: {
        color: '#FFFFFF', // Set text color to white
        fontSize: Platform.select({ ios: 15, android: 14, default: 15 }), // Font size adjusted for different platforms
        fontWeight: 'bold', // Make the text bold
        fontFamily: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Oswald-Medium' : 'Arial-MT', // Platform-specific font family
        textTransform: 'uppercase', // Make the text uppercase
        letterSpacing: 1.2, // Increase space between letters for readability
    },
});

export default Header;
