import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Paragraph, Portal, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PositionName = props => {
    if (props.division_name === "Core Comitee") {
        return (
            <Paragraph style={{ color: 'grey', marginTop: 0, marginLeft: 13 }}>{props.position_name}</Paragraph>
        )
    } else {
        return (
            <Paragraph style={{ color: 'grey', marginTop: 0, marginLeft: 13 }}>{props.position_name} of {props.division_name}</Paragraph>
        )
    }
}

const ModalProfile = props => {
    const editButton = props.editButton;
    const comiteeModal = props.comiteeModal;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    if (comiteeModal === true) {
        return (
            <Portal>
                <View style={styles.centeredView}>
                    <Modal
                        useNativeDriver={true}
                        isVisible={props.visible}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                        onBackButtonPress={props.onBackButtonPress}
                        onBackdropPress={props.onBackdropPress}
                        statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image style={styles.picture} source={{ uri: props.picture }} />
                                <View style={styles.edit}>
                                    <Title style={{ marginTop: 2, marginLeft: 13 }}>{props.name}</Title>
                                    <TouchableCmp onPress={props.onPressEdit} useForeground>
                                        <Icon name="pencil" size={18} color='grey' style={{ marginLeft: 6, opacity: 0.5 }} />
                                    </TouchableCmp>
                                </View>
                                <PositionName position_name={props.position_name} division_name={props.division_name} />
                                <Paragraph style={{ marginTop: 10, marginLeft: 13 }}>
                                    <Icon name="email" size={14} color='black' /> {props.email}
                                </Paragraph>
                                <Paragraph style={{ marginLeft: 13 }}>
                                    <Icon name="phone" size={14} color='black' /> {props.phone_number}
                                </Paragraph>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Portal>
        )
    } else if (editButton === true) {
        return (
            <Portal>
                <View style={styles.centeredView}>
                    <Modal
                        useNativeDriver={true}
                        isVisible={props.visible}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                        onBackButtonPress={props.onBackButtonPress}
                        onBackdropPress={props.onBackdropPress}
                        statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image style={styles.picture} source={{ uri: props.picture }} />
                                <View style={styles.edit}>
                                    <Title style={{ marginTop: 2, marginLeft: 13 }}>{props.name}</Title>
                                    <TouchableCmp onPress={props.onPressEdit} useForeground>
                                        <Icon name="pencil" size={18} color='grey' style={{ marginLeft: 6, opacity: 0.5 }} />
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
                        </View>
                    </Modal>
                </View>
            </Portal>
        )
    } else {
        return (
            <Portal>
                <View style={styles.centeredView}>
                    <Modal
                        useNativeDriver={true}
                        isVisible={props.visible}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                        onBackButtonPress={props.onBackButtonPress}
                        onBackdropPress={props.onBackdropPress}
                        statusBarTranslucent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image style={styles.picture} source={{ uri: props.picture }} />
                                <Title style={{ marginTop: 2, marginLeft: 13 }}>{props.name}</Title>
                                <Paragraph style={{ color: 'grey', marginTop: 0, marginLeft: 13 }}>{props.position_name}</Paragraph>
                                <Paragraph style={{ marginTop: 10, marginLeft: 13 }}>
                                    <Icon name="email" size={14} color='black' /> {props.email}
                                </Paragraph>
                                <Paragraph style={{ marginLeft: 13 }}>
                                    <Icon name="phone" size={14} color='black' /> {props.phone_number}
                                </Paragraph>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Portal>
        )
    }
}

const modalWidth = wp(77);
const modalHeight = hp(100) > 550 ? wp(107) : wp(115);
const modalMargin = hp(10);


const styles = StyleSheet.create({
    picture: {
        width: modalWidth,
        height: modalWidth
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: 'white',
        height: modalHeight,
        width: modalWidth,
        alignSelf: 'center',
        marginBottom: modalMargin,
        justifyContent: 'flex-start'
    },
    edit: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});


export default ModalProfile;