import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    Avatar,
    Drawer,
    Title,
    Caption,
    useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import { useLazyQuery } from '@apollo/react-hooks';

import { AuthContext } from '../../context/auth';
import { SimeContext } from '../../context/SimePovider';
import { FETCH_ORGANIZATION_QUERY } from '../../util/graphql';


const DrawerContentOrganization = props => {
    const { logout } = useContext(AuthContext);
    const paperTheme = useTheme();

    const translateX = Animated.interpolate(props.progress, {
        inputRange: [0, 0.5, 0.7, 0.8, 1],
        outputRange: [-100, -85, -70, -45, 0],
    });

    const sime = useContext(SimeContext);

    const [userId, setUserId] = useState(null)

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        picture: ''
    })

    const [loadData, { data: organization, error: error1, loading: loading1 }] = useLazyQuery(
        FETCH_ORGANIZATION_QUERY, {
        variables: {
            organizationId: userId
        }
    });

    useEffect(() => {
        if (sime.user) {
            setUserId(sime.user.id)
            sime.setUser_type(sime.user.__typename)
            loadData();
            if (organization) {
                setUserData({
                    id: organization.getOrganization.id,
                    name: organization.getOrganization.name,
                    email: organization.getOrganization.email,
                    picture: organization.getOrganization.picture
                })
                sime.setUser(organization.getOrganization)
                sime.setUser_type(organization.getOrganization.__typename)
            }
        }
        return () => {
            console.log("This will be logged on unmount drawer");
        }
    }, [sime.user, organization])


    return (
        <DrawerContentScrollView {...props}>
            <Animated.View
                //@ts-ignore
                style={[
                    styles.drawerContent,
                    {
                        backgroundColor: paperTheme.colors.surface,
                        transform: [{ translateX }],
                    },
                ]}
            >
                <Drawer.Section style={styles.drawerSection}>
                    <View style={styles.userInfoSection}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.toggleDrawer();
                            }}
                        >
                            <Avatar.Image
                                source={userData.picture? { uri: userData.picture } : require('../../assets/avatar.png')}
                                size={60}
                            />
                        </TouchableOpacity>
                        <Title style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{userData.name}</Title>
                        <Caption>{userData.email}</Caption>
                    </View>
                </Drawer.Section>

                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="account-outline" color={color} size={size} />
                    )}
                    label="Profile"
                    onPress={() => {
                        props.navigation.navigate('Organization Profile')
                    }}
                />

                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="account-group-outline" color={color} size={size} />
                    )}
                    label="Users Management"
                    onPress={() => {
                        props.navigation.navigate('Users Management')
                    }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="exit-to-app" color={color} size={size} />
                    )}
                    label="Log Out"
                    onPress={logout}
                />

            </Animated.View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        marginTop: 10,
        marginRight: 10,
        fontWeight: 'bold',
    },
    drawerSection: {
        marginTop: 5,
    },
});

export default DrawerContentOrganization;