import React from 'react';
import {StatusBar, View} from 'react-native';
import Colors from '../../constants/Colors';

const AppStatusBar = () => {
    return (
        <View>
            <StatusBar backgroundColor={Colors.primaryColor} barStyle="light-content" />
        </View>
    );
};

export default AppStatusBar;