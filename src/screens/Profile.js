import React from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {Title, Divider, Switch, TextInput} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import {Text} from 'react-native-paper';
import axios from 'axios';
import {useEffect} from 'react';
import {Context, Loading} from '../components/common';
const Profile = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editActive, setEditActive] = useState(false);
  const {
    container,
    section,
    text,
    profileText,
    switchControl,
    switchControlText,
  } = styles;
  const context = useContext(Context);

  const headers = {
    Authorization: 'Bearer ' + context.jwt,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    setLoading(true);
    axios({
      method: 'get',
      url: 'http://10.0.2.2:8000/api/phonebookEntries/getPersonal',
      headers: headers,
    })
      .then(response => {
        setUser(response.data);
        Snackbar.show({
          text: 'User loaded',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      })
      .catch(error => {
        console.log(error.response);
        Snackbar.show({
          text: 'Failed loading user',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      });
  };

  const switchEditMode = () => {
    console.log(editActive);
    if (editActive) {
      setLoading(true);
      let equals = true;
      console.log(user);
      Object.keys(editUser).forEach(key => {
        if (user[key] !== editUser[key]) {
          equals = false;
        }
      });
      console.log(equals);
      console.log(editUser);
      if (!equals) {
        axios({
          method: 'put',
          url: 'http://10.0.2.2:8000/api/phonebookEntries/' + editUser.id,
          headers: headers,
          params: {
            first_name: editUser.first_name,
            last_name: editUser.last_name,
            phone_number: editUser.phone_number,
          },
        })
          .then(response => {
            setUser(response.data);
            Snackbar.show({
              text: 'User updated',
              duration: Snackbar.LENGTH_SHORT,
            });
            setUser(editUser);
            setEditUser(null);
            setEditActive(false);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
            Snackbar.show({
              text: 'Failed updating user',
              duration: Snackbar.LENGTH_SHORT,
            });
            setLoading(false);
          });
      } else {
        setEditUser(null);
        setEditActive(false);
        setLoading(false);
      }
    } else {
      setLoading(true);
      setEditUser(user);
      setEditActive(true);
      setLoading(false);
    }
  };

  return (
    <View style={container}>
      <Title style={text}>Profile</Title>
      <View style={section}>
        {loading ? (
          <Loading />
        ) : editActive ? (
          <>
            <TextInput
              mode="outlined"
              placeholder="John"
              label="First name"
              value={editUser.first_name}
              onChangeText={first_name =>
                setEditUser({...editUser, first_name: first_name})
              }
            />

            <TextInput
              mode="outlined"
              placeholder="Doe"
              label="Last name"
              value={editUser.last_name}
              onChangeText={last_name =>
                setEditUser({...editUser, last_name: last_name})
              }
            />

            <TextInput
              mode="outlined"
              placeholder="+37061111111"
              label="Phone number"
              value={editUser.phone_number}
              onChangeText={phone_number =>
                setEditUser({...editUser, phone_number: phone_number})
              }
            />
            <View style={switchControl}>
              <Text style={switchControlText}> Edit profile</Text>
              <Switch value={editActive} onValueChange={switchEditMode} />
            </View>
          </>
        ) : (
          <>
            <Text style={profileText}>
              First Name: {user ? user.first_name : ''}
            </Text>
            <Divider />
            <Text style={profileText}>
              Last Name: {user ? user.last_name : ''}
            </Text>
            <Divider />
            <Text style={profileText}>
              Phone number: {user ? user.phone_number : ''}
            </Text>
            <Divider />
            <View style={switchControl}>
              <Text style={switchControlText}> Edit profile</Text>
              <Switch value={editActive} onValueChange={switchEditMode} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};
const styles = {
  container: {
    flex: 1,
  },
  section: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  switchControl: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  switchControlText: {
    marginRight: 15,
  },
  text: {
    alignSelf: 'center',
  },
  divider: {
    color: '#3d1b17',
  },
  modal: {
    backgroundColor: 'white',
    marginRight: '15%',
    marginLeft: '15%',
    marginTop: '15%',
    marginBottom: '15%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  profileText: {
    marginTop: 5,
    marginBottom: 5,
  },
};

export {Profile};
