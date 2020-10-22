import React, { useState, useLayoutEffect, useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider, Snackbar, Menu } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { FETCH_DEPARTMENT_QUERY, FETCH_STAFF_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormEditStaffProfile from '../../components/user_profile/FormEditStaffProfile';
import FormChangePasswordStaff from '../../components/user_profile/FormChangePasswordStaff';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import HeaderButton from '../../components/common/HeaderButton';

const StaffIndividualProfileScreen = ({ route, navigation }) => {
    const sime = useContext(SimeContext);

    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [staffVal, setStaffVal] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);
    const [visibleFormPassword, setVisibleFormPassword] = useState(false);

    const { data: staff, error: error1, loading: loading1 } = useQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: sime.user.id
        },
        onCompleted: () => {
            setStaffVal(staff.getStaff)
        }
    });

    const { data: department, error: error2, loading: loading2 } = useQuery(
        FETCH_DEPARTMENT_QUERY, {
        variables: {
            departmentId: sime.user.department_id
        },
    });

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);

    const closeMenu = () => {
        setVisibleMenu(false);
    }

    const openMenu = () => {
        setVisibleMenu(true);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const closeModalFormPassword = () => {
        setVisibleFormPassword(false);
    }

    const openFormEdit = () => {
        closeMenu();
        setVisibleFormEdit(true);
    }

    const openFormPassword = () => {
        closeMenu();
        setVisibleFormPassword(true);
    }

    const updateStaffStateUpdate = (e) => {
        setStaffVal(e);
        onToggleSnackBarUpdate();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    anchor={
                        <HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item
                                iconName="dots-vertical"
                                onPress={openMenu}
                            />
                        </HeaderButtons>
                    }
                >
                    <Menu.Item onPress={openFormEdit} title="Edit Profile" />
                    <Menu.Item onPress={openFormPassword} title="Change Password" />
                </Menu>)
        });
    }, [navigation, visibleMenu]);

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (error2) {
        console.error(error1);
        return <Text>Error 2</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (loading2) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView style={styles.screen}>
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={150} source={staff.getStaff.picture === null || staff.getStaff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.getStaff.picture }} />
                    <Headline>{staff.getStaff.name}</Headline>
                </View>
                <Divider />
                <View style={styles.profileDetails}>
                    <Title style={styles.titleInfo}>
                        Department
                </Title>
                    <Paragraph>
                        {department.getDepartment.name}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Position
                </Title>
                    <Paragraph>
                        {staff.getStaff.position_name}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Email Address
                </Title>
                    <Paragraph>
                        {staff.getStaff.email}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Phone Number
                </Title>
                    <Paragraph>
                        {staff.getStaff.phone_number}
                    </Paragraph>
                </View>
                <Divider style={{ marginBottom: 20 }} />
            </ScrollView>
             <FormEditStaffProfile
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                closeButton={closeModalFormEdit}
                staff={staffVal}
                updateStaffStateUpdate={updateStaffStateUpdate}
            />
            <FormChangePasswordStaff
                closeModalForm={closeModalFormPassword}
                visibleForm={visibleFormPassword}
                closeButton={closeModalFormPassword}
            />
              <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Profile updated!
            </Snackbar>
        </Provider>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
    },
    profilePicture: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    profileDetails: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    titleInfo: {
        fontSize: 16,
        marginTop: 20
    }
});

export default StaffIndividualProfileScreen;