import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
const WINDOW_WIDTH = Dimensions.get('window').width;
import axios from 'axios';

const CountryDropDown = () => {
    const [countryData, setCountryData] = useState([{ value: '', label: '' }]);
    const [value, setValue] = useState('');

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'https://api.countrystatecity.in/v1/countries',
            headers: {
                'X-CSCAPI-KEY':
                    'QnZQcWJJVmRYaXZvS1dJMFg5em5La3B0eUowRm9RVU5uTDM2c3M3Zw==',
            },
        };

        axios(config)
            .then(function (response) {
                /*console.log(JSON.stringify(response.data));*/
                var count = Object.keys(response.data).length;
                let countryArray = [];
                for (var i = 0; i < count; i++) {
                    countryArray.push({
                        value: response.data[i].iso2,
                        label: response.data[i].name,
                    });
                }
                setCountryData(countryArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={countryData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select country"
            searchPlaceholder="Search..."
            value={value}
            onChange={() => {
                setValue(value);
            }}
            renderLeftIcon={() => (
                <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                />
            )}
        />
    );
};

export default CountryDropDown;

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        width: WINDOW_WIDTH / 2,
        alignSelf: 'center',
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
