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

import { AuthContext } from '../../context/auth';
import { SimeContext } from '../../context/SimePovider';


const DrawerContent = props => {
    const { logout } = useContext(AuthContext);
    const paperTheme = useTheme();

    const translateX = Animated.interpolate(props.progress, {
        inputRange: [0, 0.5, 0.7, 0.8, 1],
        outputRange: [-100, -85, -70, -45, 0],
    });

    const sime = useContext(SimeContext);
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        picture: ''
    })

    useEffect(() => {
        if (sime.user) {
            setUserData({
                id: sime.user.id,
                name: sime.user.name,
                email: sime.user.email,
                picture: sime.user.picture
            })

        }
        return () => {
            console.log("This will be logged on unmount drawer");
        }
    }, [sime.user])


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
                                source={userData.picture === null || userData.picture === '' ? require('../../assets/avatar.png') : { uri: userData.picture }}
                                size={60}
                            />
                        </TouchableOpacity>
                        <Title style={styles.title}>{userData.name}</Title>
                        <Caption>{userData.email}</Caption>
                    </View>
                </Drawer.Section>

                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="account-outline" color={color} size={size} />
                    )}
                    label="Profile"
                    onPress={() => {
            
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
                        <Icon name="tune" color={color} size={size} />
                    )}
                    label="Preferences"
                    onPress={() => { }}
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
        fontWeight: 'bold',
    },
    drawerSection: {
        marginTop: 5,
    },
});

export default DrawerContent;