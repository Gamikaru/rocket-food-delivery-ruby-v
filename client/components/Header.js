import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const Header = ({ navigation }) => (
    <View style={styles.header}>
        <Image source={require('../assets/images/AppLogoV1.png')} style={styles.headerLogo} />
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    headerLogo: {
        width: width * 0.5,
        height: height * 0.14,
        resizeMode: 'contain',
        marginLeft: 10,
        marginTop: 5
    },
    logoutButton: {
        backgroundColor: '#DA583B',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginRight: 25,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
    },
});

export default Header;
