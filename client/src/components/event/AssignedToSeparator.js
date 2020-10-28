import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { List, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';

import AssignedToCommitteeListContainer from './AssignedToCommitteeListContainer';
import Colors from '../../constants/Colors';

const AssignedToSeparator = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View>
                <List.Section
                    style={styles.accordion}
                    titleStyle={{ fontWeight: 'bold' }}
                    title={props.name}  
                >
                    <AssignedToCommitteeListContainer
                        divisionId={props.divisionId}
                        committees={props.committees}
                    />
                </List.Section>
                <Divider/>
        </View >
    );
};

const styles = StyleSheet.create({
    accordion: {

    },
    task: {
        display: "flex"
    },
    status: {
        fontSize: 11
    }
});


export default AssignedToSeparator;