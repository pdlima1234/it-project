import React, { Component } from 'react';

import { StyleSheet, View, Image } from 'react-native';

export default class WeConnectLogoSmall extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../images/we-connect-logo.jpg')}
                    style={styles.image}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        resizeMode: 'contain',
        height: 50,
        width: 100,
        //borderWidth: 1,
        //borderColor: 'black',
    },
});
