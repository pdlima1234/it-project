import axios from 'axios';
import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { host } from '../screens/host';

const PasswordInfo = (user: string) => {
    let count = 0;

    const EMPTY_STRING = '';
    const VALID_LEN = 10;
    let [pass1, setPass1] = useState(EMPTY_STRING);
    let [pass2, setPass2] = useState(EMPTY_STRING);

    let [formComplete, setFormComplete] = useState(false);
    let [firstAttempt, setFirstAttempt] = useState(true);
    let [validPass, setValidPass] = useState(false);
    let [mismatchPass, setMismatchPass] = useState(false);
    let [failedAttempt, setFailedAttempt] = useState(false);

    let checkPass = async () => {
        setFirstAttempt(false);

        if (pass1.length > 0 && pass2.length > 0) {
            setFormComplete(true);
        } else {
            setFormComplete(false);
        }

        if (pass1.length >= VALID_LEN && pass2.length >= VALID_LEN) {
            setValidPass(true);
        } else {
            setValidPass(false);
        }

        if (pass1 === pass2) {
            setMismatchPass(false);
        } else {
            setMismatchPass(true);
        }

        console.log(
            pass1.length > 0 && pass2.length > 0,
            pass1 === pass2,
            pass1.length >= VALID_LEN && pass2.length >= VALID_LEN
        );

        if (
            (pass1.length > 0 && pass2.length > 0,
            pass1 === pass2,
            pass1.length >= VALID_LEN && pass2.length >= VALID_LEN)
        ) {
            const response = await axios
                .post('http://' + host + ':8080/volunteers/changepass', {
                    Email: user,
                    Password: pass1,
                })
                .catch((error) => {
                    setPass1(EMPTY_STRING);
                    setPass2(EMPTY_STRING);
                    setFailedAttempt(true);

                    console.error(error);
                });

            if (response) {
                setPass1(EMPTY_STRING);
                setPass2(EMPTY_STRING);
                setFailedAttempt(false);
            }
        }
    };

    return (
        <View style={styles.tab}>
            <View>
                <Text style={styles.text}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={pass1}
                    onChangeText={(pass) => setPass1(pass)}
                />
            </View>

            <View>
                <Text style={styles.text}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={pass2}
                    onChangeText={(pass) => setPass2(pass)}
                />
            </View>

            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                    checkPass();
                    setPass1(EMPTY_STRING);
                    setPass2(EMPTY_STRING);
                }}
            >
                <Text style={styles.loginText}>Update</Text>
            </TouchableOpacity>

            <View>
                {!firstAttempt &&
                    !formComplete &&
                    [''].map((idle) => {
                        return (
                            <Text key={count++} style={styles.text}>
                                Incomplete form
                            </Text>
                        );
                    })}

                {!firstAttempt &&
                    formComplete &&
                    mismatchPass &&
                    [''].map((idle) => {
                        return (
                            <Text key={count++} style={styles.text}>
                                Passwords don't match
                            </Text>
                        );
                    })}

                {!firstAttempt &&
                    formComplete &&
                    !mismatchPass &&
                    !validPass &&
                    [''].map((idle) => {
                        return (
                            <Text key={count++} style={styles.text}>
                                Invalid password
                            </Text>
                        );
                    })}

                {!firstAttempt &&
                    formComplete &&
                    !mismatchPass &&
                    validPass &&
                    !failedAttempt &&
                    [''].map((idle) => {
                        return (
                            <Text key={count++} style={styles.text}>
                                Successfully reset password
                            </Text>
                        );
                    })}

                {failedAttempt && (
                    <Text
                        style={[
                            styles.text,
                            { marginTop: 40, fontWeight: 'bold' },
                        ]}
                    >
                        Unexpected error occurred
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tab: {
        backgroundColor: 'white',
        padding: 25,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },

    text: {
        //fontSize: 18,
        color: '#C62828',
        marginTop: 15,
        marginBottom: 5,
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
        fontWeight: 'bold',
        //width: 150,
        textAlign: 'center',
    },

    resetButton: {
        //width: 'auto',
        paddingVertical: 2.5,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        backgroundColor: '#FFEBEE',
        alignSelf: 'center',
        marginTop: 30,
    },
});

export default PasswordInfo;
