import React from 'react';
import {Text} from 'react-native';
const ErrorRenderer = ({errors}) => {
  let index = 0;
  const {errorTextStyle} = styles;
  return errors.map(error => {
    for (const [key, value] of Object.entries(error)) {
      index = index + 1;
      return (
        <Text key={index} style={errorTextStyle}>{`${key}: ${value}`}</Text>
      );
    }
  });
};

const styles = {
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
  },
};

export {ErrorRenderer};
