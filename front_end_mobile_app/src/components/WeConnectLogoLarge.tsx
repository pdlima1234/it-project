import React, { Component } from 'react';

import { StyleSheet, View, Image } from 'react-native';

export default class WeConnectLogoLarge extends Component {
    render() {
        return (
            <View>
                <Image
                    source={require('../images/we-connect-logo.jpg')}
                    style={styles.image}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        height: 100,
        width: 250,
        marginBottom: 7.5,
    },
});
