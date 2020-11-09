import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Provider, Portal } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_EXTERNAL_QUERY } from '../../util/graphql';
import ModalProfile from '../../components/common/ModalProfile';
import { theme } from '../../constants/Theme';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';

const ExternalList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const { data: externalData, error: errorExternalData, loading: loadingExternalData } = useQuery(
        FETCH_EXTERNAL_QUERY, {
        variables: {
            externalId: props.id
        },
        notifyOnNetworkStatusChange: true,
    });

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

    if (errorExternalData) {
        console.error(errorExternalData);
        return <Text>errorExternalData</Text>;
    }

    if (loadingExternalData) {
        return <CenterSpinnerSmall />;
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp onPress={openModal} onPressIn={props.onPressIn} onLongPress={props.onLongPress} useForeground>
                <View style={styles.wrap}>
                    <List.Item
                        style={props.style}
                        title={props.name}
                        left={() => <Avatar.Image size={props.size} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />}
                    />
                </View>
            </TouchableCmp>
            <Portal>
                <ModalProfile
                    visible={visible}
                    onBackButtonPress={closeModal}
                    onBackdropPress={closeModal}
                    name={externalData.getExternal.name}
                    email={externalData.getExternal.email}
                    phone_number={externalData.getExternal.phone_number}
                    picture={externalData.getExternal.picture}
                    positionName={false}
                    onPressInfo={() => { selectInfoHandler(externalData.getExternal.id) }}
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