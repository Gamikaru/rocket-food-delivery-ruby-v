import React, { useState } from 'react'; // Importing React and useState hook
import { Alert, Button, Text, TextInput, View } from 'react-native'; // Importing necessary components from react-native

// Define the RegisterScreen component
const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState(''); // State hook for username
    const [password, setPassword] = useState(''); // State hook for password

    const handleRegister = async () => {
        if (username && password) {
            // Show success alert after successful registration
            Alert.alert('Registration successful', 'You can now log in.');
            // Navigate to the Login screen after successful registration
            navigation.navigate('Login');
        } else {
            // Show alert if the fields are not filled
            Alert.alert('Registration failed', 'Please fill in all fields');
        }
    };

    return (
        <View>
            <Text>Register</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

export default RegisterScreen;
