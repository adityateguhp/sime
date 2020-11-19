import React from 'react';
import { Button } from 'react-native-paper';
import moment from 'moment';

const Status = props => {
    const nowDate = moment().format();
    const planned = moment(nowDate).isBefore(props.start_date);
    const actived = moment(nowDate).isBetween(props.start_date, props.end_date, undefined, '[]');
    const completed = moment(nowDate).isAfter(props.end_date);
    if (planned === true) {
        return (
            <Button mode="contained" labelStyle={{fontSize: props.fontSize}} color="blue">PLANNED</Button>
        )
    } else if (actived === true) {
        return (
            <Button mode="contained" labelStyle={{fontSize: props.fontSize}} color="orange">ACTIVE</Button>
        )
    } else if (completed === true) {
        return (
            <Button mode="contained" labelStyle={{fontSize: props.fontSize}} color="green">COMPLETED</Button>
        )
    } else {
        return (
            <Button mode="contained" labelStyle={{fontSize: props.fontSize}} color="white">NO STATUS</Button>
        )
    }

}


export default Status;