import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Dimensions } from 'react-native';
import { Card, Caption, ProgressBar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import SkeletonContent from "react-native-skeleton-content-nonexpo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Status from '../../components/common/Status';

import Colors from '../../constants/Colors';

const ProjectCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const startDate = moment(props.start_date).format('ll');
    const endDate = moment(props.end_date).format('ll');

    let progress = 0;

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.project}>
                    <SkeletonContent
                        isLoading={props.loading}
                        containerStyle={styles.SkletonContainer}
                        layout={cardCover}
                    >
                        <Card.Cover style={styles.cover}
                           source={props.picture === null || props.picture === '' ? require('../../assets/folder.png')  : { uri: props.picture }}
                        />
                    </SkeletonContent>

                    <SkeletonContent
                        isLoading={props.loading}
                        containerStyle={styles.SkletonContainer}
                        layout={cardTitle}
                    >
                        <Card.Title
                            title={props.name}
                            titleStyle={styles.titleStyle}
                            subtitle={
                                <Caption style={styles.caption}>
                                    <Icon name="calendar" size={10.5} color='black' /> {startDate} - {endDate}
                                </Caption>}
                            subtitleNumberOfLines={2}
                        />
                    </SkeletonContent>

                    <SkeletonContent
                        isLoading={props.loading}
                        containerStyle={styles.SkletonContainer}
                        layout={cardContent}
                    >
                        <Card.Content>
                            <View style={styles.task}>
                                <Caption style={styles.caption}>{progress.toFixed(2) * 100}% Completed</Caption>
                            </View>
                            <ProgressBar progress={progress} color={Colors.primaryColor} />
                        </Card.Content>
                    </SkeletonContent>

                    <SkeletonContent
                        isLoading={props.loading}
                        containerStyle={styles.SkletonContainer}
                        layout={cardAction}
                    >
                        <View>
                            <Card.Actions style={styles.cardAction}>
                                <Status start_date={props.start_date} end_date={props.end_date} cancel={props.cancel} fontSize={wp(2.18)} />
                            </Card.Actions>
                        </View>
                    </SkeletonContent>
                </Card >
            </TouchableCmp>
        </View>
    );
};

const cardWidth = wp(45);

const cardCover = [
    {
        width: cardWidth,
        height: wp(20),
        borderRadius: 5
    }
];
const cardTitle = [
    {
        width: cardWidth * 0.8,
        height: wp(3.8),
        marginTop: 20,
        marginLeft: 16,
        marginBottom: 10
    },
    {
        width: cardWidth * 0.75,
        height: wp(2.9),
        marginLeft: 16
    },
];
const cardContent = [
    {
        width: cardWidth * 0.8,
        height: wp(5),
        marginLeft: 16,
        marginTop: 25
    },
];
const cardAction = [
    {
        width: cardWidth * 0.5,
        height: cardWidth * 0.15,
        marginLeft: 16,
        marginTop: 8
    }
];


const styles = StyleSheet.create({
    project: {
        width: wp(45),
        height: wp(100) > 350 ? wp(57.5) : wp(66),
        margin: 7,
        elevation: 3

    },
    task: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardAction: {
        flexDirection: "row",
        marginLeft: 8,
        marginBottom: 8
    },
    cover: {
        height: wp(20),
        borderRadius: 5
    },
    titleStyle: {
        fontSize: wp(3.5),
        marginRight: 12,
    },
    caption: {
        fontSize: wp(2.6),
    },
    SkletonContainer: {
        width: '100%',
    },
});


export default ProjectCard;