import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Provider, Portal } from 'react-native-paper';

import ProfileModal from '../common/ProfileModal';
import { theme } from '../../constants/Theme';

const ExternalList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [visible, setVisible] = useState(false);

    const selectInfoHandler = (id) => {
        props.navigation.navigate('External Profile', {
            externalId: id
        });
        setVisible(false);
    };

    const openModal = () => {
        setVisible(true);
    }

    const closeModal = () => {
        setVisible(false);
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp onPress={props.eventOverview? openModal : () => { selectInfoHandler(props.id) }} onPressIn={props.onPressIn} onLongPress={props.onLongPress} useForeground>
                <View style={styles.wrap}>
                    <List.Item
                        style={props.style}
                        title={props.name}
                        left={() => <Avatar.Image size={props.size} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />}
                    />
                </View>
            </TouchableCmp>
            <Portal>
                <ProfileModal
                    visible={visible}
                    onBackButtonPress={closeModal}
                    onBackdropPress={closeModal}
                    name={props.name}
                    email={props.email}
                    phone_number={props.phone_number}
                    picture={props.picture}
                    positionName={false}
                    onPressInfo={() => { selectInfoHandler(props.id) }}
                    onPressIn={closeModal}
                />
            </Portal>
        </Provider>

    );
};

const styles = StyleSheet.create({
    wrap: {
        marginTop: 1
    }
});


export default ExternalList;