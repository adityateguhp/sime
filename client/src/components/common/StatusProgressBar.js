import React from "react";
import { StyleSheet, View } from 'react-native';
import {
    ProgressBar,
    Caption
} from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';

import Colors from '../../constants/Colors';

export function Percentage(props) {
    const today = new Date();
    const start_date = new Date(props.start_date);
    const end_date = new Date(props.end_date);

    const isToday = (someDate) => {
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }

    const activeDays = Math.ceil(moment.duration(moment(today).diff(moment(start_date))).asDays());
    const totalActiveDays = Math.ceil(moment.duration(moment(end_date).diff(moment(start_date))).asDays());

    return (
        <Caption style={styles.caption}>
            {
                props.cancel ?
                    0
                    : today < start_date ?
                        0
                        :
                        today < end_date ?
                            Math.round(((activeDays) / (totalActiveDays + 1)) * 100)
                            :
                            isToday(start_date) && isToday(end_date) ?
                                0
                                :
                                100
            }
        </Caption>
    );
}

export function StatusProgressDays(props) {
    const today = new Date();
    const start_date = new Date(props.start_date);
    const end_date = new Date(props.end_date);

    const isToday = (someDate) => {
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }
    const plannedDays = Math.ceil(moment.duration(moment(start_date).diff(moment(today))).asDays());
    const activeDays = Math.ceil(moment.duration(moment(today).diff(moment(start_date))).asDays());
    const completedDays = Math.ceil(moment.duration(moment(today).diff(moment(end_date))).asDays());
    const totalActiveDays = Math.ceil(moment.duration(moment(end_date).diff(moment(start_date))).asDays());

    return (
        <Caption style={styles.caption}>
            {
                props.cancel ?
                    null
                    : today < start_date ?
                        plannedDays + " Days to go"
                        :
                        today < end_date ?
                            "Days " + activeDays + " of " + (totalActiveDays + 1)
                            :
                            isToday(start_date) && isToday(end_date) ?
                                "Days " + activeDays + " of " + (totalActiveDays + 1)
                                :
                                completedDays + " Days ago"
            }
        </Caption>
    );
}

export function StatusProgressBar(props) {
    const today = new Date();
    const start_date = new Date(props.start_date);
    const end_date = new Date(props.end_date);

    const isToday = (someDate) => {
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }

    const activeDays = Math.ceil(moment.duration(moment(today).diff(moment(start_date))).asDays());
    const totalActiveDays = Math.ceil(moment.duration(moment(end_date).diff(moment(start_date))).asDays());

    return (
        <View>
            <ProgressBar
                progress={
                    props.cancel ?
                        0
                        : today < start_date ?
                            0
                            :
                            today < end_date ?
                                (activeDays) / (totalActiveDays + 1)
                                :
                                isToday(start_date) && isToday(end_date) ?
                                    0
                                    :
                                    1
                }
                color={Colors.primaryColor}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    caption: {
        fontSize: wp(2.6),
    }
});
