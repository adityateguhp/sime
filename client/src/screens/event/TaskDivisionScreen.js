import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { DIVISIONS } from '../../data/dummy-data';
import DivisionCard from '../../components/project/DivisionCard';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';

const TaskDivisionScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const division = DIVISIONS.filter(
        div => div.project_id.indexOf(sime.project_id) >= 0
    );
    const selectItemHandler = (division_name, _id) => {
        navigation.navigate('Task', {
            divisionName: division_name,
            divisionId: _id
        });

        sime.setDivision_name(division_name);
    };

    const deleteHandler = () => {
        setVisible(false);
        Alert.alert('Are you sure?', 'Do you really want to delete this client?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive'
            }
        ]);
    };

    if (DIVISIONS.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No comitee found, let's add comitee!</Text>
            </View>
        );
    }

    return (
            <FlatList
                style={styles.screen}
                data={division}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <DivisionCard
                        division_name={itemData.item.division_name}
                        onSelect={() => { selectItemHandler(itemData.item.division_name, itemData.item._id) }}
                    >
                    </DivisionCard>
                )}
            />
    );
}

const styles = StyleSheet.create({
    screen: {
        marginTop: 5
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});



export default TaskDivisionScreen;