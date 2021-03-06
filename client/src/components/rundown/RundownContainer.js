import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const RundownContainer = props => {

    return (
        <View style={styles.container}>
            <View style={styles.date}>
                <Icon name="calendar" size={23} color={Colors.primaryColor} style={{ marginRight: 8 }} />
                <Subheading style={{ fontWeight: 'bold', color: Colors.primaryColor }}>{props.date}</Subheading>
            </View>
            <Divider />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 3,
        backgroundColor: 'white',
        
    },
    date: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },

});


export default RundownContainer;