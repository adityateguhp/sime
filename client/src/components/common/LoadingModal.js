import React from 'react';
import { Portal } from 'react-native-paper';
import Modal from "react-native-modal";
import CenterSpinner from './CenterSpinner';

const LoadingModal = props => {
    return (
        <Portal>
            <Modal
                useNativeDriver={true}
                isVisible={props.loading}
                backdropOpacity={0.3}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                    // top: keyboardSpace ? -10 -keyboardSpace : 0,
                }}
                statusBarTranslucent>
                <CenterSpinner />
            </Modal>
        </Portal>
    )
}

export default LoadingModal;