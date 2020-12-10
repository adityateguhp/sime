import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DepartmentPositionList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const label = props.name.substring(0,2).toUpperCase();

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.position}>
                    <Card.Title
                        title={props.name}
                        left={() => <Avatar.Text size={45} label={label} style={{backgroundColor: Colors.primaryColor}}/>}
                    />
                </Card >
            </TouchableCmp>
        </View>

    );
};

const styles = StyleSheet.create({
    position: {
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 3
    },
    wrap: {
        marginTop: 1
    }
});


export default DepartmentPositionList;