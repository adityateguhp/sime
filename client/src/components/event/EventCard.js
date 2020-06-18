import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Colors from '../../constants/Colors';
import Status from '../../components/common/Status';

const EventCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const startDate = moment(props.event_start_date).format('ll');
    const endDate = moment(props.event_end_date).format('ll');

    let progress = 0;

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.event_name}
                        subtitle={
                            <Caption>
                                <Icon name="calendar" size={13} color='black' /> {startDate} - {endDate}
                            </Caption>}
                        left={() => <Avatar.Image size={50} source={{ uri: props.picture }} />}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <Caption>{progress.toFixed(2) * 100}% Completed</Caption>
                        </View>
                        <ProgressBar progress={progress} color={Colors.primaryColor} />
                    </Card.Content>

                    <View>
                        <Card.Actions style={styles.cardAction}>
                            <Status start_date={props.event_start_date} end_date={props.event_end_date} cancel={props.cancel} fontSize={11} />
                        </Card.Actions>
                    </View>
                </Card >
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    event: {
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 3
    },
    task: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardAction: {
        flexDirection: "row",
        margin: 8

    }
});


export default EventCard;