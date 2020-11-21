import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const IlustrationOnCard = props => {
    if(props.name === 'Guests'){
        return <Image source={require('../../assets/speaker.png')} style={styles.picture}/>
    }else if(props.name === 'Sponsors'){
        return <Image source={require('../../assets/sponsor.png')} style={styles.picture}/>
    }else if(props.name === 'Volunteers'){
        return <Image source={require('../../assets/volunteer.png')} style={styles.picture}/>
    }else if(props.name === 'Media Partners'){
        return <Image source={require('../../assets/media.png')} style={styles.picture}/>
    }
}

const ExternalCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.card}>
                    <Card.Title
                        title={props.name}
                        left={() => <IlustrationOnCard name={props.name}/> }
                    />
                </Card >
            </TouchableCmp>
        </View>

    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 3
    },
    picture: {
        width: wp(10),
        height: wp(10)
    }
});


export default ExternalCard;