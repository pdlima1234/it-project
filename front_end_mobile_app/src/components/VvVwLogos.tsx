import React, { Component } from 'react';

import { StyleSheet, View, Image } from 'react-native';

export default class VvVwLogos extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../images/vv-logo.png')}
                    style={styles.image}
                />
                <Image
                    source={require('../images/vw-logo.png')}
                    style={styles.image}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    image: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
        marginHorizontal: 7.5,
        alignSelf: 'flex-end',
    },
});
