import React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native';
import { Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const OptionModal = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.visible}
                animationIn="zoomIn"
                animationOut="zoomOut"
                onBackButtonPress={props.closeModal}
                onBackdropPress={props.closeModal}
                statusBarTranslucent>
                <View style={styles.modalView}>
                    <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{props.title}</Title>
                    <TouchableCmp onPress={props.openFormEdit}>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Edit</Text>
                        </View>
                    </TouchableCmp>
                    <TouchableCmp onPress={props.deleteHandler}>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Delete</Text>
                        </View>
                    </TouchableCmp>
                </View>
            </Modal>
        </Portal>
    )
}


const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    }
});

export default OptionModal;