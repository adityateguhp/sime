import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Button } from 'react-native-paper';
import { EVENTS } from '../../data/dummy-data';

import HeaderButton from '../../components/common/HeaderButton';

const EditEventScreen = ({ route, navigation }) => {
    const eventId = route.params?.eventId;
    const editedEvent = EVENTS.find(evnt => evnt.id === eventId);

    const [name, setName] = useState(
        editedEvent ? editedEvent.name : '');
    const [description, setDescription] = useState(
        editedEvent ? editedEvent.description : ''
    );
    const [startDate, setStartDate] = useState(
        editedEvent ? editedEvent.startDate : ''
    );
    const [endDate, setEndDate] = useState(
        editedEvent ? editedEvent.endDate : ''
    );

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <TextInput
                        style={styles.input}
                        mode='outlined'
                        label='Name'
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        mode='outlined'
                        label='Description'
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                </View>

                <View style={styles.formControl}>
                    <Button style={styles.date} mode="outlined" onPress={() => {navigation.navigate('DatePicker')}}>
                        Select Date
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

EditEventScreen.setParams = () => {
    return {
        title: route.params?.eventId
            ? 'Edit Event'
            : 'Add Event',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={
                        'check'
                    }
                    onPress={() => { }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    formControl: {
        width: '100%'
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 7,
        backgroundColor: 'white'
    },
    date: {
        paddingHorizontal: 2,
        paddingVertical: 7,
        backgroundColor: 'white'
    },
    screen: {
        backgroundColor: 'white'
    }
});

export default EditEventScreen;
