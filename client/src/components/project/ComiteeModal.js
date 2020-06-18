import * as React from 'react';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';

const ComiteeModal = props => {
    return(
        <Provider>
         <Portal>
           <Modal visible={props.visible} onDismiss={props.onDismiss}>
             <Text>Example Modal</Text>
           </Modal>
           
         </Portal>
      </Provider>
    )
}

export default ComiteeModal;