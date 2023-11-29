import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import VvVwLogos from '../components/VvVwLogos';
import PasswordInfo from '../components/PasswordInfo';
import { stackScreens } from '../../App';

type propsType = NativeStackScreenProps<stackScreens, 'UserDetails'>;

const UserDetails = (props: propsType) => {
    const Tab = createMaterialTopTabNavigator();
    const { navigation, route } = props;
    const user = route.params.user;

    const PasswordInfoScreen = () => {
        return PasswordInfo(user);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.middle}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <EvilIcons
                            name="arrow-left"
                            size={45}
                            backgroundColor="#fff"
                            color="#EF9A9A"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottom}>
                <NavigationContainer independent={true}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarLabelStyle: { textTransform: 'none' },
                            tabBarStyle: { backgroundColor: 'white' },
                            tabBarActiveTintColor: 'red',
                            tabBarIndicatorStyle: {
                                backgroundColor: 'red',
                                height: 2,
                            },
                        }}
                    >
                        {/*<Tab.Screen name="UserInfo" component={UserInfoScreen} />*/}
                        <Tab.Screen
                            name="Password"
                            component={PasswordInfoScreen}
                        />
                    </Tab.Navigator>
                </NavigationContainer>

                <View style={styles.logout}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                            navigation.goBack();
                        }}
                        style={styles.resetButton}
                    >
                        <Text style={styles.loginText}>Log out</Text>
                    </TouchableOpacity>
                </View>
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
    },

    logout: {
        flex: 0.1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tab: {
        flex: 1,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#EF9A9A',
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
        marginVertical: 10,
    },
});

export default UserDetails;
