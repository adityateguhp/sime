import React from 'react';
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
import {ORGANIZATIONS} from '../../data/dummy-data'

const DrawerContent = props => {
    const paperTheme = useTheme();

    const translateX = Animated.interpolate(props.progress, {
        inputRange: [0, 0.5, 0.7, 0.8, 1],
        outputRange: [-100, -85, -70, -45, 0],
    });

    const organizationLog = ORGANIZATIONS.find(org => org._id === 'o1') 

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
                                source={{
                                    uri:
                                        organizationLog.picture,
                                }}
                                size={60}
                            />
                        </TouchableOpacity>
                        <Title style={styles.title}>{organizationLog.organization_name}</Title>
                        <Caption>{organizationLog.email}</Caption>
                    </View>
                </Drawer.Section>
              
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="account-group-outline" color={color} size={size}/>
                        )}
                        label="Departments"
                        onPress={() => {  
                            props.navigation.navigate('Departments')}}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="tune" color={color} size={size} />
                        )}
                        label="Preferences"
                        onPress={() => { }}
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