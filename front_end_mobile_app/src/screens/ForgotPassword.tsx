import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import WeConnectLogoLarge from '../components/WeConnectLogoLarge';
import VvVwLogos from '../components/VvVwLogos';
import { stackScreens } from '../../App';
import { host } from './host';

type propsType = NativeStackScreenProps<stackScreens, 'ForgotPassword'>;

const ForgotPassword = (props: propsType) => {
    const { navigation } = props;
    const EMPTY_STRING = '';

    let [username, setUsername] = useState(EMPTY_STRING);
    let [failedAttempt, setFailedAttempt] = useState(false);

    const resetPass = async (user: string) => {
        const response = await axios
            .post('http://' + host + ':8080/volunteers/resetpass', {
                Email: user,
            })
            .catch((error) => {
                setUsername(EMPTY_STRING);
                setFailedAttempt(true);
                console.error(error);
            });

        if (response) {
            setUsername(EMPTY_STRING);
            setFailedAttempt(true);
            navigation.goBack();
        }

        console.log(username);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.bottom}>
                <WeConnectLogoLarge />
                {/* Form start */}
                <View>
                    <Text style={styles.heading}>Forgot Password</Text>
                    <Text style={styles.text}>E-mail Address</Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={username}
                        onChangeText={(user) => setUsername(user)}
                    />

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            resetPass(username);
                        }}
                    >
                        <Text style={styles.loginText}>Reset Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Text style={styles.loginText}>Return to login</Text>
                    </TouchableOpacity>

                    {failedAttempt && (
                        <Text
                            style={[
                                styles.loginText,
                                { marginTop: 40, fontWeight: 'bold' },
                            ]}
                        >
                            Invalid email address
                        </Text>
                    )}
                </View>
                {/* Form end */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    top: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFEBEE',
    },

    bottom: {
        flex: 10,
        backgroundColor: '#fff',
        padding: 25,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    heading: {
        fontSize: 20,
        color: '#C62828',
        fontWeight: 'bold',
        marginBottom: 0,
        textAlign: 'center',
    },

    text: {
        //fontSize: 18,
        color: '#C62828',
        marginTop: 15,
        marginBottom: 5,
    },

    forgotPassword: {
        //fontSize: 15,
        color: '#EF9A9A',
        //marginTop: 75,
        textAlign: 'center',
    },

    input: {
        width: Dimensions.get('window').width / 1.75,
        backgroundColor: '#FFEBEE',
        //fontSize: 12,
        //padding: 7.5,
        paddingHorizontal: 7.5,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        //marginBottom: 7.5,
    },

    loginText: {
        //fontSize: 18,
        color: '#C62828',
        //fontWeight: 'bold',
        //width: 150,
        textAlign: 'center',
    },

    resetButton: {
        //width: 'auto',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        marginTop: 20,
        marginBottom: 50,
        backgroundColor: '#FFEBEE',
        alignSelf: 'center',
    },
});

export default ForgotPassword;
