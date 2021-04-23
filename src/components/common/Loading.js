import React from 'react';
import {ActivityIndicator, Colors} from 'react-native-paper';

const Loading = ({size}) => {
  return (
      <ActivityIndicator size={size} animating={true} color={Colors.red800} />
  );
};

export {Loading};
