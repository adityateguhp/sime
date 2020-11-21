import React from 'react';
import { FAB, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const FABbutton = props => {
    const safeArea = useSafeAreaInsets();
    return (
        <FAB
            style={{
                position: 'absolute',
                bottom: safeArea.bottom + 15,
                right: 15,
                backgroundColor: Colors.secondaryColor
            }}
            icon={props.Icon}
            onPress={props.onPress}
        />
    );
};

export default FABbutton;