import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, } from 'react-native';
import { Subheading, Paragraph } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';

const RundownTime = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp nPress={props.onSelect} useForeground>
            <View>
                <View style={styles.containerTime}>
                    <View style={styles.time}>
                        <Icon name="clock" size={20} color={Colors.primaryColor} style={{ marginRight: 10 }} />
                        <Paragraph style={{ fontWeight: 'bold', color: Colors.primaryColor }}>{props.start_time} to {props.end_time}</Paragraph>
                    </View>
                    <View style={styles.agenda}>
                        <Paragraph style={{ fontWeight: 'bold', color: 'black' }}>{props.agenda}</Paragraph>
                        <Paragraph style={{ color: 'grey' }}>{props.details}</Paragraph>
                    </View>
                </View>
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    containerTime: {
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: 'white',
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15
    },
    agenda: {
        marginLeft: 45
    }
});


export default RundownTime;