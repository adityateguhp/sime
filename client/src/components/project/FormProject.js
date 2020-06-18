import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableNativeFeedback, Platform, } from 'react-native';
import { Button, Appbar, Portal, TextInput, Text } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const FormProject = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    //const [keyboardSpace, setKeyboarSpace] = useState(0);

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    //for get keyboard height
    // Keyboard.addListener('keyboardDidShow', (frames) => {
    //     if (!frames.endCoordinates) return;
    //     setKeyboarSpace(frames.endCoordinates.height);
    // });
    // Keyboard.addListener('keyboardDidHide', (frames) => {
    //     setKeyboarSpace(0);
    // });
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
                    // top: keyboardSpace ? -10 -keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <View style={styles.buttomView}>
                    <View style={styles.formView}>
                        <Appbar style={styles.appbar}>
                            <Appbar.Action icon="window-close" onPress={props.closeButton} />
                            <Appbar.Content title="New Project" />
                            <Appbar.Action icon="delete" onPress={props.deleteButton} />
                            <Appbar.Action icon="check" onPress={() => console.log('Pressed mail')} />
                        </Appbar>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            keyboardVerticalOffset={hp(26)}
                        >
                            <ScrollView>

                                <View style={styles.formViewStyle}>
                                    <TouchableCmp>
                                        <View style={styles.imageUpload}>
                                            <Icon name="image" size={70} color="black" />
                                            <Text>Select Project Cover Image</Text>
                                        </View>
                                    </TouchableCmp>

                                    <View style={styles.dateInputContainer}>
                                        <View style={styles.dateLabel}>
                                            <Icon name="calendar" size={25} color={Colors.primaryColor} />
                                            <Text style={styles.textDate}>
                                                Date :
                                </Text>
                                        </View>
                                        <View style={styles.dateButtonContainer}>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={() => console.log('Pressed')}
                                                mode="outlined"
                                            >
                                                FROM
                                    </Button>
                                            <Button
                                                style={styles.dateButton}
                                                labelStyle={{ color: Colors.primaryColor }}
                                                onPress={() => console.log('Pressed')}
                                                mode="outlined"
                                            >
                                                TO
                                    </Button>
                                        </View>
                                    </View>

                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Project Name'
                                            value={projectName}
                                            onChangeText={projectName => setProjectName(projectName)}
                                        />
                                    </View>
                                    <View style={styles.inputStyle}>
                                        <TextInput
                                            style={styles.input}
                                            label='Project Description'
                                            value={projectDescription}
                                            onChangeText={projectDescription => setProjectDescription(projectDescription)}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </Portal >
    );
};

const modalFormWidth = wp(100);
const modalFormHeight = hp(80);

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
        marginBottom: 15
    },
    input: {
        backgroundColor: 'white'
    },
    dateLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateInputContainer: {
        flexDirection: "row",
        marginBottom: 15
    },
    dateButton: {
        flex: 1,
        marginLeft: 10,
    },
    dateButtonContainer: {
        flex: 1,
        flexDirection: "row",
    },
    textDate: {
        fontSize: 16,
        marginLeft: 5,
        color: 'black',
        opacity: 0.6
    },
    imageUpload: {
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 5,
        height: 200,
        marginBottom: 20,
        opacity: 0.6,
        justifyContent: "center",
        alignItems: "center"

    }
});


export default FormProject;