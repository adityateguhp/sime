import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import Status from '../../components/common/Status';
import { Percentage, StatusProgressDays, StatusProgressBar } from '../../components/common/StatusProgressBar'
import { SimeContext } from '../../context/SimePovider';

const EventCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const startDate = moment(props.start_date).format('ll');
    const endDate = moment(props.end_date).format('ll');

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={sime.user_type === "Organization" || sime.order === '1' || sime.order === '2' || sime.order === '3' ? props.onLongPress : null} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.name}
                        subtitle={
                            <Caption>
                                <Icon name="calendar" size={13} color='black' /> {startDate} - {endDate}
                            </Caption>}
                        left={() => <Avatar.Image size={50} source={props.picture ? { uri: props.picture } : require('../../assets/calendar.png')}
                        />}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <StatusProgressDays start_date={props.start_date} end_date={props.end_date} />
                            <View style={{ flexDirection: 'row' }}>
                                <Percentage start_date={props.start_date} end_date={props.end_date} />
                                <Caption style={styles.caption}>%</Caption>
                            </View>
                        </View>
                        <StatusProgressBar start_date={props.start_date} end_date={props.end_date} />
                    </Card.Content>

                    <View>
                        <Card.Actions style={styles.cardAction}>
                            <Status start_date={props.start_date} end_date={props.end_date} fontSize={11} />
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