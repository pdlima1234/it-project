import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import axios from 'axios';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import VvVwLogos from '../components/VvVwLogos';
import WeConnectLogoLarge from '../components/WeConnectLogoLarge';
import { stackScreens } from '../../App';
import { host } from './host';

type propsType = NativeStackScreenProps<stackScreens, 'Login'>;

const Login = (props: propsType) => {
    const { navigation } = props;
    const EMPTY_STRING = '';

    let [failedLogin, setFailedLogin] = useState(false);
    let [username, setUsername] = useState(EMPTY_STRING);
    let [password, setPassword] = useState(EMPTY_STRING);

    const validateLogin = async (user: string, pass: string) => {
        console.log(user, pass);
        const login = await axios
            .post('http://' + host + ':8080/volunteers/login', {
                Email: user,
                Password: pass,
            })
            .catch((error) => {
                setUsername(EMPTY_STRING);
                setPassword(EMPTY_STRING);
                setFailedLogin(true);

                console.error(error);
            });

        if (login) {
            setUsername(EMPTY_STRING);
            setPassword(EMPTY_STRING);
            setFailedLogin(false);

            let id = login.data;

            const surveysToDo = await axios
                .get('http://' + host + ':8080/volunteers/surveysToDo/' + id)
                .catch((error) => {
                    console.error(error);
                });

            if (surveysToDo) {
                console.log(surveysToDo.data.SurveysToDo);
                navigation.navigate('Welcome', {
                    user: user,
                    id: id,
                    toDo: surveysToDo.data.SurveysToDo,
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.bottom}>
                <WeConnectLogoLarge />

                {/* Login form start */}
                <Text style={styles.heading}>Login</Text>
                <Text style={styles.text}>E-mail Address</Text>
                <TextInput
                    style={styles.inputBox}
                    value={username}
                    onChangeText={(user) => setUsername(user)}
                />

                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.inputBox}
                    value={password}
                    onChangeText={(pass) => setPassword(pass)}
                    secureTextEntry={true}
                />

                <TouchableOpacity style={styles.loginButton}>
                    <Text
                        style={styles.text}
                        onPress={() => {
                            validateLogin(username, password);
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ForgotPassword');
                    }}
                >
                    <Text style={styles.text}>Forgot password</Text>
                </TouchableOpacity>

                {failedLogin && (
                    <Text
                        style={[
                            styles.text,
                            { marginTop: 40, fontWeight: 'bold' },
                        ]}
                    >
                        Invalid credentials
                    </Text>
                )}

                {/* Login form end */}
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
        marginBottom: 15,
        textAlign: 'center',
    },

    text: {
        color: '#C62828',
    },

    inputBox: {
        width: Dimensions.get('window').width / 1.75,
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 7.5,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        marginTop: 5,
        marginBottom: 20,
    },

    loginButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginBottom: 50,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#FFEBEE',
        borderColor: '#EF9A9A',
    },
});

export default Login;
