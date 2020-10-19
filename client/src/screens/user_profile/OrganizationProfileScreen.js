import React, { useState, useLayoutEffect, useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider, Menu, Snackbar } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormEditStaff from '../../components/user_management/FormEditStaff';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import HeaderButton from '../../components/common/HeaderButton';
import FormEditOrganizationProfile from '../../components/user_profile/FormEditOrganizationProfile';
import FormChangePasswordOrganization from '../../components/user_profile/FormChangePasswordOrganization';

const OrganizationProfileScreen = ({ route, navigation }) => {
    const sime = useContext(SimeContext);

    const { data: organization, error: error1, loading: loading1 } = useQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: sime.user.id
        },
        onCompleted: () => {
            setOrganizationVal(organization.getOrganization)
        }
    });

    
    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);

    const [organizationVal, setOrganizationVal] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);
    const [visibleFormPassword, setVisibleFormPassword] = useState(false);

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

    const updateOrganizationStateUpdate = (e) => {
        setOrganizationVal(e);
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

    if (loading1) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView style={styles.screen}>
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={150} source={organization.getOrganization.picture === null || organization.getOrganization.picture === '' ? require('../../assets/avatar.png') : { uri: organization.getOrganization.picture }} />
                    <Headline>{organization.getOrganization.name}</Headline>
                </View>
                <Divider />
                <View style={styles.profileDetails}>
                    <Title style={styles.titleInfo}>
                        Email Address
                </Title>
                    <Paragraph>
                        {organization.getOrganization.email}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        description
                </Title>
                    <Paragraph>
                        {organization.getOrganization.description}
                    </Paragraph>
                </View>
                <Divider style={{ marginBottom: 20 }} />
            </ScrollView>
            {/* <FormEditStaff
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                staff={staffVal}
                deleteButtonVisible={false}
                closeButton={closeModalFormEdit}
            /> */}
            <FormEditOrganizationProfile
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                closeButton={closeModalFormEdit}
                organization={organizationVal}
                updateOrganizationStateUpdate={updateOrganizationStateUpdate}
            />
            <FormChangePasswordOrganization
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

export default OrganizationProfileScreen;