import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';

import Colors from '../../constants/Colors';
import { FETCH_TASKS_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';

const RoadmapCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [tasksValue, setTasksValue] = useState([]);

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch, networkStatus } = useQuery(
        FETCH_TASKS_QUERY,
        {
            variables: { roadmapId: props.roadmapId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                tasks.getTasks.sort(function (x, y) {
                    return new Date(x.createdAt) - new Date(y.createdAt);
                }).reverse();
                tasks.getTasks.sort(function (x, y) {
                    return Number(x.completed) - Number(y.completed);
                });
                setTasksValue(tasks.getTasks)
            }
        }
    );

    const startDate = moment(props.start_date).format('ll');
    const endDate = moment(props.end_date).format('ll');

    let completeTask = tasksValue.filter((t) => t.completed === true);


    const percentage = Math.round((completeTask.length / tasksValue.length)*100);
    const progress = completeTask.length / tasksValue.length;


    if (errorTasks) {
        console.error(errorTasks);
        return <Text>errorTasks</Text>;
    }

    if (loadingTasks) {
        return <CenterSpinner />;
    }

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.name}
                        subtitle={
                            <Caption>
                                <Icon name="calendar" size={13} color='black' /> {startDate} - {endDate}
                            </Caption>}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <Caption>{percentage? percentage : 0}% Completed</Caption>
                        </View>
                        <ProgressBar progress={progress? progress : 0} color={Colors.primaryColor} />
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