import { StatusBar } from 'expo-status-bar';
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
import WeConnectLogoSmall from '../components/WeConnectLogoSmall';
import { stackScreens } from '../../App';

type propsType = NativeStackScreenProps<stackScreens, 'Welcome'>;

// To pull from backend.
import axios from 'axios';

const Welcome = (props: propsType) => {
    const EMPTY_STRING = '';
    const { navigation, route } = props;
    const { user } = route.params;
    const { toDo } = route.params;
    const { id } = route.params;

    const renderOption = (option: string) => {
        let optionID: number;

        if (option === 'baseline') {
            optionID = 1;
        } else if (option === 'main') {
            optionID = 2;
        } else {
            optionID = 3;
        }

        return (
            <View key={optionID}>
                <TouchableOpacity
                    style={[styles.item, styles.survey]}
                    onPress={() => {
                        navigation.navigate('Survey', {
                            user: user,
                            id: id,
                            survey: option,
                            iteration: optionID,
                        });
                    }}
                >
                    <Text style={[styles.text]}>{option}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.middle}>
                <WeConnectLogoSmall />
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('UserDetails', {
                                user: user,
                                id: id,
                            });
                        }}
                    >
                        <EvilIcons
                            name="user"
                            size={45}
                            backgroundColor="#fff"
                            color="#EF9A9A"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottom}>
                {/* <Text>{username}</Text> */}
                <Text style={[styles.heading, { marginBottom: 30 }]}>
                    Welcome
                </Text>

                {/* To do list start */}
                <View style={styles.toDoList}>
                    <Text style={[styles.heading, { marginBottom: 10 }]}>
                        To Do
                    </Text>

                    {/* There are survey(s) to do */}
                    {toDo.map((survey) => {
                        return renderOption(survey);
                    })}

                    {/* There are no survey(s) to do */}
                    {toDo.length === 0 && (
                        <View style={styles.item}>
                            <Text style={styles.text}>No assigned tasks</Text>
                        </View>
                    )}
                </View>
                {/* To do list end */}
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

    item: {
        margin: 5,
        paddingVertical: 10,
        width: Dimensions.get('window').width / 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    survey: {
        borderWidth: 1,
        borderColor: '#EF9A9A',
        borderRadius: 10,
    },

    toDoList: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        borderColor: '#EF9A9A',
    },
});

export default Welcome;
