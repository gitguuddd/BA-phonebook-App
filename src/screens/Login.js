import React, {Fragment} from 'react';
import {Text, View} from 'react-native';
import {Loading, ErrorRenderer} from '../components/common';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';
import {useState} from 'react';
import {Context} from '../components/common';
import {useContext} from 'react';
import Snackbar from 'react-native-snackbar';
import {TextInput, Button} from 'react-native-paper';
const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);

  const loginUser = () => {
    setLoading(true);
    setErrors([]);
    axios({
      method: 'post',
      url: 'http://10.0.2.2:8000/api/login_check',
      data: {
        username: email,
        password: password,
      },
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => {
        deviceStorage.saveItem('id_token', response.data.token);
        context.setJwt(response.data.token);
        Snackbar.show({
          text: 'Login successful',
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .catch(error => {
        console.log(error);
        setErrors([{error: 'Invalid credentials'}]);
        setLoading(false);
        Snackbar.show({
          text: 'Login failed',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const {section, container} = styles;

  return (
    <View style={container}>
      <View style={section}>
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
          <Button
            mode="contained"
            onPress={() => {
              loginUser();
            }}>
            <Text>Login</Text>
          </Button>
        ) : (
          <Loading size={'large'} />
        )}
      </View>
      {errors && errors.length > 0 && <ErrorRenderer errors={errors} />}
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

export {Login};
