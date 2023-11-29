import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import VvVwLogos from '../components/VvVwLogos';
import WeConnectLogoSmall from '../components/WeConnectLogoSmall';
import { stackScreens } from '../../App';
import { host } from './host';
import axios from 'axios';

type propsType = NativeStackScreenProps<stackScreens, 'Complete'>;

const Complete = (props: propsType) => {
    // const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { navigation, route } = props;
    const { user } = route.params;
    const { id } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.middle}>
                <WeConnectLogoSmall />
            </View>

            <View style={styles.bottom}>
                <Text style={[styles.heading, { marginBottom: 30 }]}>
                    Thank you
                </Text>

                <TouchableOpacity
                    onPress={async () => {
                        console.log(user);
                        console.log(id);

                        const surveysToDo = await axios
                            .get(
                                'http://' +
                                    host +
                                    ':8080/volunteers/surveysToDo/' +
                                    id
                            )
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
                    }}
                    style={styles.returnToHomeButton}
                >
                    <Text style={styles.text}>Return to home</Text>
                </TouchableOpacity>
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

    middle: {
        flex: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#EF9A9A',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    bottom: {
        flex: 9.25,
        backgroundColor: 'white',
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },

    heading: {
        fontSize: 24,
        color: '#C62828',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    text: {
        color: '#C62828',
        fontWeight: '500',
        textAlign: 'center',
    },

    returnToHomeButton: {
        //width: 'auto',
        paddingVertical: 2.5,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        marginTop: 20,
        marginBottom: 50,
        backgroundColor: '#FFEBEE',
        alignSelf: 'center',
    },
});

export default Complete;
