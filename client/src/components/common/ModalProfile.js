import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Paragraph, Portal, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ModalProfile = props => {
    const positionName = props.positionName;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    if (positionName === true) {
        return (
            <Portal>
                <Modal
                    useNativeDriver={true}
                    isVisible={props.visible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    onBackButtonPress={props.onBackButtonPress}
                    onBackdropPress={props.onBackdropPress}
                    statusBarTranslucent>
                    <View style={styles.modalViewTall}>
                        <Image style={styles.picture} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />
                        <View style={styles.info}>
                            <Title style={{ marginTop: 5, marginLeft: 13 }}>{props.name}</Title>
                            <TouchableCmp onPress={props.onPressInfo} onPressIn={props.onPressIn} useForeground>
                                <Icon name="information" size={23} color='grey' style={{ marginTop: 5, marginRight: 13, opacity: 0.5 }} />
                            </TouchableCmp>
                        </View>
                        <Paragraph style={{ color: 'grey', marginTop: 0, marginLeft: 13 }}>{props.position_name}</Paragraph>
                        <Paragraph style={{ marginTop: 10, marginLeft: 13 }}>
                            <Icon name="email" size={14} color='black' /> {props.email}
                        </Paragraph>
                        <Paragraph style={{ marginLeft: 13 }}>
                            <Icon name="phone" size={14} color='black' /> {props.phone_number}
                        </Paragraph>
                    </View>
                </Modal>
            </Portal>
        )
    } else {
        return (
            <Portal>
                <Modal
                    useNativeDriver={true}
                    isVisible={props.visible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    onBackButtonPress={props.onBackButtonPress}
                    onBackdropPress={props.onBackdropPress}
                    statusBarTranslucent>
                    <View style={styles.modalViewShort}>
                        <Image style={styles.picture} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />
                        <View style={styles.info}>
                            <Title style={{ marginTop: 5, marginLeft: 13 }}>{props.name}</Title>
                            <TouchableCmp onPress={props.onPressInfo} onPressIn={props.onPressIn} useForeground>
                                <Icon name="information" size={23} color='grey' style={{ marginTop: 5, marginRight: 13, opacity: 0.5 }} />
                            </TouchableCmp>
                        </View>
                        <Paragraph style={{ marginTop: 10, marginLeft: 13 }}>
                            <Icon name="email" size={14} color='black' /> {props.email}
                        </Paragraph>
                        <Paragraph style={{ marginLeft: 13 }}>
                            <Icon name="phone" size={14} color='black' /> {props.phone_number}
                        </Paragraph>
                    </View>
                </Modal>
            </Portal>
        )
    }
}

const modalWidth = wp(77);
const modalHeightTall = hp(100) > 550 ? wp(107) : wp(115);
const modalHeightShort = hp(100) > 550 ? wp(102) : wp(110);
const modalMargin = hp(0);


const styles = StyleSheet.create({
    picture: {
        width: modalWidth,
        height: modalWidth
    },
    modalViewTall: {
        backgroundColor: 'white',
        height: modalHeightTall,
        width: modalWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    modalViewShort: {
        backgroundColor: 'white',
        height: modalHeightShort,
        width: modalWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});


export default ModalProfile;