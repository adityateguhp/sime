import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider, Menu, Snackbar } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider';
import { theme } from '../../constants/Theme';
import HeaderButton from '../../components/common/HeaderButton';
import FormEditOrganizationProfile from '../../components/user_profile/FormEditOrganizationProfile';
import CenterSpinner from '../../components/common/CenterSpinner';

const OrganizationProfileScreen = ({ route, navigation }) => {
    const sime = useContext(SimeContext);

    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [organizationVal, setOrganizationVal] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    const { data: organization, error: error1, loading: loading1, refetch: refetchOrganization } = useQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: sime.user.organization_id
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setOrganizationVal(organization.getOrganization)
        }
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

    const openFormEdit = () => {
        closeMenu();
        setVisibleFormEdit(true);
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
                    <Menu.Item onPress={openFormEdit} title="Edit Organization Profile" />
                </Menu>)
        });
    }, [navigation, visibleMenu]);

    const onRefresh = () => {
        refetchOrganization();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
            >
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={150} source={organization.getOrganization.picture ? { uri: organization.getOrganization.picture } : require('../../assets/avatar.png')} />
                    <Headline style={{ marginHorizontal: 15 }} numberOfLines={1} ellipsizeMode='tail'>{organization.getOrganization.name}</Headline>
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
                        Phone Number
                </Title>
                    <Paragraph>
                        {organization.getOrganization.phone_number}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Address
                </Title>
                    <Paragraph>
                        {organization.getOrganization.address}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Description
                </Title>
                    <Paragraph>
                        {organization.getOrganization.description}
                    </Paragraph>
                </View>
                <Divider style={{ marginBottom: 20 }} />
            </ScrollView>
            <FormEditOrganizationProfile
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                closeButton={closeModalFormEdit}
                organization={organizationVal}
                updateOrganizationStateUpdate={updateOrganizationStateUpdate}
            />
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdate();
                    },
                }}>
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