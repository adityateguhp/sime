import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, } from 'react-native';
import { Paragraph, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';

const RundownTime = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
            <View style={styles.containerTime}>
                <View>
                    <View style={styles.time}>
                        <Icon name="clock" size={20} color={Colors.primaryColor} style={{ marginRight: 10 }} />
                        <Paragraph style={{ fontWeight: 'bold', color: Colors.primaryColor }}>{props.start_time} to {props.end_time}</Paragraph>
                    </View>
                    <View style={styles.agenda}>
                        <Paragraph style={{ fontWeight: 'bold', color: 'black' }}>{props.agenda}</Paragraph>
                        <Paragraph style={{ color: 'grey' }}>{props.details}</Paragraph>
                    </View>
                </View>
                <Divider />
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    containerTime: {
        marginHorizontal: 10,
        elevation: 3,
        backgroundColor: 'white'
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10
    },
    agenda: {
        marginLeft: 41,
        marginRight: 10,
        marginBottom: 10
    }
});


export default RundownTime;