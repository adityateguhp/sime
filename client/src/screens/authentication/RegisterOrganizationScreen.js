import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { List } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CommonActions } from "@react-navigation/native";

import Paragraph from '../../components/common/Paragraph';
import Background from '../../components/common/Background';
import Logo from '../../components/common/Logo';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import { theme } from '../../constants/Theme';
import { REGISTER_STAFF, ADD_ORGANIZATION, ADD_ORGANIZATION_STAFF_MUTATION, ADD_COMMITTEE_MUTATION, ADD_POSITION_MUTATION } from '../../util/graphql';

const RegisterOrganizationScreen = ({ route, navigation }) => {
    const [errors, setErrors] = useState({});

    const [values, setValues] = useState({
        name: '',
        email: '',
        description: '',
        picture: '',
        address: '',
        phone_number: ''
    });

    const [committeeValues, setCommitteeValues] = useState([
        {
            name: 'Panitia Inti',
            core: true,
            organizationId: ''
        },
        {
            name: 'Sie Keuangan',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Acara & Lomba ',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Perlengkapan & Transportasi',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Konsumsi & Penerima Tamu',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Humas, Dokumentasi & Publikasi',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Sponsorship dan Kerjasama',
            core: false,
            organizationId: ''
        },
        {
            name: 'Sie Keamanan',
            core: false,
            organizationId: ''
        },
    ]);


    const [positionValues, setPositionValues] = useState([
        {
            name: 'Penanggung Jawab',
            core: true,
            organizationId: '',
            order: '0'
        },
        {
            name: 'Ketua',
            core: true,
            organizationId: '',
            order: '1'
        },
        {
            name: 'Wakil Ketua',
            core: true,
            organizationId: '',
            order: '2'
        },
        {
            name: 'Sekretaris',
            core: true,
            organizationId: '',
            order: '3'
        },
        {
            name: 'Bendahara',
            core: true,
            organizationId: '',
            order: '4'
        },
        {
            name: 'Wakil Bendahara',
            core: true,
            organizationId: '',
            order: '5'
        },
        {
            name: 'Koordinator',
            core: false,
            organizationId: '',
            order: '6'
        },
        {
            name: 'Wakil Koordinator',
            core: false,
            organizationId: '',
            order: '7'
        },
        {
            name: 'Anggota',
            core: false,
            organizationId: '',
            order: '8'
        },
    ]);

    const [organizationStaffValue, setOrganizationStaffValue] = useState({
        staffId: route.params?.staff_id,
        organizationId: ''
    });

    const onChange = (key, val) => {
        setValues({ ...values, [key]: val });
        setErrors('')
    };

    const [addOrganization, { loading: loading3 }] = useMutation(ADD_ORGANIZATION, {
        update(_, result) {
            updateCommitteeFieldChanged('organizationId', result.data.addOrganization.id);
            updatePositionFieldChanged('organizationId', result.data.addOrganization.id);
            setOrganizationStaffValue({ ...organizationStaffValue, organizationId: result.data.addOrganization.id });
            addOrganizationStaff();
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    const [addCommittee, { loading: loading2 }] = useMutation(ADD_COMMITTEE_MUTATION);

    const updateCommitteeFieldChanged = (name, value) => {
        let newArr = committeeValues.map((item) => {
            return { ...item, [name]: value };
        });
        setCommitteeValues(newArr);
        newArr.map((data) => {
            addCommittee(({ variables: data }))
        })
    };

    const [addPosition, { loading: loading5 }] = useMutation(ADD_POSITION_MUTATION);

    const updatePositionFieldChanged = (name, value) => {
        let newArr = positionValues.map((item) => {
            return { ...item, [name]: value };
        });
        setPositionValues(newArr);
        newArr.map((data) => {
            addPosition(({ variables: data }))
        })
    };

    const [addOrganizationStaff, { loading: loading4 }] = useMutation(ADD_ORGANIZATION_STAFF_MUTATION, {
        update() {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Register Completed" }],
                })
            );
        },
        variables: organizationStaffValue
    });

    const onSubmit = (event) => {
        event.preventDefault();
        addOrganization();
    };

    return (
        <Background>
            <ScrollView>
                <View style={styles.container}>
                    <Header>One More Step...</Header>
                    <Paragraph>
                        Please fill out the form below with your organization information
                    </Paragraph>
                <TextInput
                    label="Organization Name"
                    returnKeyType="next"
                    value={values.name}
                    error={errors.name ? true : false}
                    onChangeText={(val) => onChange('name', val)}
                />

                <TextInput
                    label="Email Address"
                    returnKeyType="next"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChangeText={(val) => onChange('email', val)}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />

                <TextInput
                    label='Phone Number'
                    returnKeyType="done"
                    value={values.phone_number}
                    onChangeText={(val) => onChange('phone_number', val, '')}
                    keyboardType="phone-pad"
                />

                <TextInput
                    label='Address'
                    returnKeyType="done"
                    multiline={true}
                    value={values.address}
                    onChangeText={(val) => onChange('address', val, '')}
                />

                <TextInput
                    label='Description'
                    returnKeyType="done"
                    multiline={true}
                    value={values.description}
                    onChangeText={(val) => onChange('description', val, '')}
                />

                {Object.keys(errors).length > 0 && (
                    <View style={styles.errorContainer}>
                        <List.Section style={styles.errorSection}>
                            {Object.values(errors).map((value) => (
                                <List.Item
                                    key={value}
                                    title={value}
                                    titleStyle={styles.errorItem}
                                    titleNumberOfLines={2}
                                    left={() => <List.Icon color={theme.colors.error} style={{ margin: 0 }} icon="alert-circle" />}
                                />
                            ))}
                        </List.Section>
                    </View>
                )}

                <Button mode="contained" onPress={onSubmit} style={styles.button} loading={loading3 ? true : false} >
                    Submit
                    </Button>
                </View>
            </ScrollView>
        </Background >

    );
};

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 12,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    container: {
        flex: 1,
        padding: 10,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center'
    },
    errorSection: {
        borderStyle: 'solid',
        borderWidth: 1,
        width: wp(100),
        maxWidth: 320,
        borderRadius: 5,
        borderColor: theme.colors.error,
        marginTop: 12
    },
    errorHeader: {
        fontSize: wp(3.89),
        color: theme.colors.error,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 5
    },
    errorItem: {
        fontSize: wp(3.4),
        color: theme.colors.error
    }
});

export default memo(RegisterOrganizationScreen);
