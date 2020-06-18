import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Button, Appbar, Portal, TextInput, Text } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const FormDivision = props => {

    const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [departmentName, setDepartmentName] = useState('');

    //for get keyboard height
    Keyboard.addListener('keyboardDidShow', (frames) => {
       if (!frames.endCoordinates) return;
         setKeyboarSpace(frames.endCoordinates.height);
     });
     Keyboard.addListener('keyboardDidHide', (frames) => {
         setKeyboarSpace(0);
     });
    const safeArea = useSafeArea();

    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.visibleForm}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackButtonPress={props.closeModalForm}
                onBackdropPress={props.closeModalForm}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                    top: keyboardSpace ? -10 -keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Department" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={() => console.log('Pressed mail')} />
                        </Appbar>
                            <ScrollView>
                                <View style={styles.formViewStyle}>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Department Name'
                                            value={departmentName}
                                            onChangeText={departmentName => setDepartmentName(departmentName)}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                    </View>
                </View>
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(34);

const styles = StyleSheet.create({
    appbar: {
        
    },
    formView: {
        backgroundColor: 'white',
        height: modalFormHeight,
        width: modalFormWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    formViewStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 25,
        justifyContent: 'flex-start',
    },
    inputStyle: {
        marginBottom: 10
    },
    input: {
        backgroundColor: 'white'
    }
});


export default FormDivision;