import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';

import CommitteeListContainer from '../../components/project/CommitteeListContainer';
import Colors from '../../constants/Colors';

const DivisionCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

    const label = props.name.substring(0, 2).toUpperCase();

    return (
        <View style={styles.container}>
            <List.Accordion
                style={styles.accordion}
                titleStyle={{ fontWeight: 'bold' }}
                title={props.name}
                expanded={expanded}
                onPress={handlePress}>
                <CommitteeListContainer
                    division_id={props.division_id}
                    onSelect={props.onSelect}
                />
            </List.Accordion>
        </View>
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
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 10,
        flex: 1,
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 4

    }
});


export default DivisionCard;