import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Colors from '../../constants/Colors';

const RoadmapCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const startDate = moment(props.roadmap_start_date).format('ll');
    const endDate = moment(props.roadmap_end_date).format('ll');

    let progress = 0;

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.roadmap_name}
                        subtitle={
                            <Caption>
                                <Icon name="calendar" size={13} color='black' /> {startDate} - {endDate}
                            </Caption>}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <Caption>{progress.toFixed(2) * 100}% Completed</Caption>
                        </View>
                        <ProgressBar progress={progress} color={Colors.primaryColor} />
                    </Card.Content>
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


export default RoadmapCard;