import React, {Component, Fragment} from 'react';
import {View, Text} from 'react-native';
import {Loading, ErrorRenderer} from '../components/common';
import axios from 'axios';
import {useState} from 'react';
import Snackbar from 'react-native-snackbar';
import {TextInput, Button} from 'react-native-paper';

const Registration = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setLoading(true);
    setErrors([]);

    axios({
      method: 'post',
      url: 'http://10.0.2.2:8000/auth/register',
      params: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        password: password,
      },
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => {
        Snackbar.show({
          text: 'Registration successful',
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.navigate('Login');
      })
      .catch(error => {
        Snackbar.show({
          text: 'Registration failed',
          duration: Snackbar.LENGTH_SHORT,
        });
        setErrors(error.response.data.errors);
        setLoading(false);
      });
  };

  const {section, container} = styles;

  return (
    <View style={container}>
      <View style={section}>
        <TextInput
          mode="outlined"
          placeholder="John"
          label="First name"
          value={firstName}
          onChangeText={first_name => setFirstName(first_name)}
        />

        <TextInput
          mode="outlined"
          placeholder="Doe"
          label="Last name"
          value={lastName}
          onChangeText={last_name => setLastName(last_name)}
        />

        <TextInput
          mode="outlined"
          placeholder="+37061111111"
          label="Phone number"
          value={phoneNumber}
          onChangeText={phone_number => setPhoneNumber(phone_number)}
        />

        <TextInput
          mode="outlined"
          placeholder="user@email.com"
          label="Email"
          value={email}
          onChangeText={email => setEmail(email)}
        />

        <TextInput
          mode="outlined"
          secureTextEntry
          placeholder="password"
          label="Password"
          value={password}
          onChangeText={password => setPassword(password)}
        />
      </View>

      <View style={section}>
        {!loading ? (
          <Button mode="contained" onPress={registerUser}>
            <Text>Register</Text>
          </Button>
        ) : (
          <Loading size={'large'} />
        )}
        {errors && errors.length > 0 && <ErrorRenderer errors={errors} />}
      </View>
    </View>
  );
};

const styles = {
  section: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  container: {
    flex: 1,
  },
};

export {Registration};
