import React from 'react';
import {Button, Text} from 'react-native-paper';
import deviceStorage from '../../services/deviceStorage';
const LogoutButton = ({context}) => {
  const {logout} = styles;
  return (
    <Button
      mode="contained"
      style={logout}
      icon="logout"
      onPress={() => {
        deviceStorage.deleteJWT(context);
      }}>
      <Text>Logout</Text>
    </Button>
  );
};

const styles = {
  logout: {
    width: '50%',
  },
};

export {LogoutButton};
