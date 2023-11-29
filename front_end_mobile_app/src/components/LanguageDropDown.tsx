import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
const WINDOW_WIDTH = Dimensions.get('window').width;

const data = [
    { label: 'English', value: '1' },
    { label: 'Chinese', value: '2' },
    { label: 'Hindi', value: '3' },
    { label: 'Spanish', value: '4' },
    { label: 'French', value: '5' },
    { label: 'Arabic', value: '6' },
    { label: 'Bengali', value: '7' },
    { label: 'Russian', value: '8' },
    { label: 'Portuguese', value: '9' },
    { label: 'Indonesian', value: '10' },
    { label: 'Urdu', value: '11' },
    { label: 'German', value: '12' },
    { label: 'Japanese', value: '13' },
    { label: 'Swahili', value: '14' },
    { label: 'Marathi', value: '15' },
    { label: 'Telugu', value: '16' },
    { label: 'Turkish', value: '18' },
    { label: 'Korean', value: '19' },
    { label: 'Tamil', value: '20' },
    { label: 'Italian', value: '21' },
    { label: 'Filipino', value: '22' },
    { label: 'Vietnamese', value: '23' },
    { label: 'Polish', value: '24' },
    { label: 'Ukrainian', value: '25' },
    { label: 'Malay', value: '26' },
    { label: 'Dutch', value: '27' },
    { label: 'Romanian', value: '28' },
    { label: 'Burmese', value: '29' },
    { label: 'Thai', value: '30' },
    { label: 'Persian', value: '31' },
    { label: 'Sindhi', value: '32' },
    { label: 'Yoruba', value: '33' },
    { label: 'Sudanese Arabic', value: '34' },
    { label: 'Pashto', value: '36' },
    { label: 'Serbian', value: '37' },
    { label: 'Nepali', value: '38' },
    { label: 'Malayalam', value: '39' },
    { label: 'Sinhala', value: '40' },
    { label: 'Uzbek', value: '41' },
    { label: 'Odia', value: '42' },
    { label: 'Amharic', value: '43' },
    { label: 'Kurdish', value: '44' },
    { label: 'Gujarati', value: '45' },
    { label: 'Azerbaijani', value: '46' },
    { label: 'Bavarian', value: '47' },
    { label: 'Fula', value: '48' },
    { label: 'Slovak', value: '49' },
    { label: 'Greek', value: '50' },
    { label: 'Other', value: '51' },
];

const LanguageDropDown = () => {
    let g: string[] = [];
    const [selected, setSelected] = useState(g);

    const renderItem = (item: { label: string; value: string }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select language"
                value={selected}
                search
                searchPlaceholder="Search..."
                onChange={(item) => {
                    setSelected(item);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                        onPress={() => unSelect && unSelect(item)}
                    >
                        <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>
                                {item.label}
                            </Text>
                            <AntDesign color="black" name="delete" size={17} />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default LanguageDropDown;

const styles = StyleSheet.create({
    container: { padding: 16, alignItems: 'center' },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        width: WINDOW_WIDTH / 2,
        elevation: 2,
        alignSelf: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
});
