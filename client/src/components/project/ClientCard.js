import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const ClientCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [visibleSetting, setVisibleSetting] = useState(false);

    const openMenuSetting = () => {
        setVisibleSetting(true);
    }

    const closeMenuSetting = () => {
        setVisibleSetting(false);
    }


    return (
        <View>
            <TouchableCmp onPress={props.onSelect} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.name}
                        subtitle={
                            <Caption>
                                <Icon name="email" size={13} color='black' /> {props.email}
                            </Caption>}
                        left={(props) => <Avatar.Image {...props} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSAJcAMlCEFH0M9cxc4uVmG9UJ5i-fWGfvCF7ErAu9zsZq0TRKb' }} />}
                        right={() => (
                            <Menu
                                visible={visibleSetting}
                                onDismiss={closeMenuSetting}
                                anchor={
                                    <IconButton icon="dots-vertical" size={18} color='black' onPress={openMenuSetting} />
                                }
                            >
                                <Menu.Item icon="pencil" onPress={props.onEdit} title="Edit" />
                                <Divider />
                                <Menu.Item icon="delete" onPress={props.onDelete} title="Delete" />
                            </Menu>
                        )}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <Caption>
                                <Icon name="office-building" size={13} color='black' /> {props.address}
                            </Caption>
                            <Caption>
                                <Icon name="phone" size={13} color='black' /> {props.phoneNumber}
                            </Caption>
                        </View>
                    </Card.Content>
                </Card >
            </TouchableCmp>
        </View>

    );
};

const styles = StyleSheet.create({
    event: {
        margin: 10,
        elevation: 5
    },
    task: {
        display: "flex"
    },
    status: {
        fontSize: 11
    }
});


export default ClientCard;