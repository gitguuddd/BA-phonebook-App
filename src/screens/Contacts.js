import React from 'react';
import {View} from 'react-native';

import {Context, Loading, LogoutButton} from '../components/common';
import {useContext} from 'react';
import {useState} from 'react/cjs/react.development';
import {
  Button,
  Divider,
  List,
  Modal,
  Portal,
  Searchbar,
  Text,
  Title,
} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import {useEffect} from 'react';
import {call} from '../services/callService';

const Contacts = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContact, setModalContact] = useState(null);
  const context = useContext(Context);
  context.contacts = contacts;
  context.setContacts = setContacts;

  useEffect(() => {
    const bootStrap = () => {
      loadContacts();
    };
    bootStrap();
  }, []);

  const hideModal = () => {
    setShowModal(false);
    setModalContact(null);
  };

  const openModal = contact => {
    setModalContact(contact);
    setShowModal(true);
  };

  const callContact = contact => {
    hideModal();
    if (contact) {
      const args = {
        number: contact.phone_number,
        prompt: false,
      };
      call(args).catch(console.error);
    }
  };

  const filterContacts = query => {
    setFilterText(query);
    if (filterText === '') {
      setFilteredContacts([]);
    } else {
      setFilteredContacts(
        contacts.filter(contact => {
          const name = contact.first_name + ' ' + contact.last_name;
          return name.includes(filterText);
        }),
      );
    }
  };

  const removeContact = () => {
    const headers = {
      Authorization: 'Bearer ' + context.jwt,
      'Content-Type': 'application/json',
    };
    axios({
      method: 'post',
      url:
        'http://10.0.2.2:8000/api/phonebookEntries/stopSharing/' +
        modalContact.user_id,
      headers: headers,
    })
      .then(response => {
        setContacts(contacts.filter(contact => contact.id !== modalContact.id));
        setFilteredContacts(
          filteredContacts.filter(contact => contact.id !== modalContact.id),
        );
        hideModal();
        Snackbar.show({
          text: 'Contact removed',
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .catch(error => {
        console.log(error.response);
        Snackbar.show({
          text: 'Failed removing contact',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const loadContacts = () => {
    setLoading(true);
    setFilterText('');
    setShowModal(false);
    setModalContact(null);
    setFilteredContacts([]);
    const headers = {
      Authorization: 'Bearer ' + context.jwt,
      'Content-Type': 'application/json',
    };
    axios({
      method: 'get',
      url: 'http://10.0.2.2:8000/api/phonebookEntries',
      headers: headers,
    })
      .then(response => {
        context.setContacts(response.data);
        setLoading(false);
        Snackbar.show({
          text: 'Contacts loaded',
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        Snackbar.show({
          text: 'Failed loading contacts',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };
  const {
    container,
    section,
    text,
    divider,
    topBar,
    topBarButton,
    modal,
    modalText,
    modalButtons,
    callButton,
    removeContactButton,
    buttonIconStyle,
  } = styles;
  return (
    <View style={container}>
      <View style={topBar}>
        <Button
          icon="refresh"
          mode="contained"
          style={topBarButton}
          onPress={loadContacts}>
          <Text>Refresh</Text>
        </Button>
        <LogoutButton style={topBarButton} context={context} />
      </View>
      <Title style={text}>Contacts</Title>
      {loading ? (
        <Loading />
      ) : contacts.length === 0 ? (
        <Text style={text}>
          Aww, it looks that you don't have any contacts :(
        </Text>
      ) : (
        <View>
          <View style={section}>
            <Searchbar
              placeholder="Search for contacts..."
              onChangeText={filterContacts}
            />
          </View>
          <View style={section}>
            <List.Section>
              {filteredContacts.map((contact, index) => (
                <View key={contact.id}>
                  <List.Item
                    title={contact.first_name + ' ' + contact.last_name}
                    description={contact.phone_number}
                    onPress={() => {
                      openModal(contact);
                    }}
                  />
                  <Portal>
                    <Modal
                      visible={showModal}
                      onDismiss={hideModal}
                      style={modal}>
                      <Title style={modalText}>PhonebookEntry</Title>
                      <Text style={modalText}>
                        First Name:{modalContact ? modalContact.first_name : ''}
                      </Text>
                      <Divider />
                      <Text style={modalText}>
                        Last Name: {modalContact ? modalContact.last_name : ''}
                      </Text>
                      <Divider />
                      <Text style={modalText}>
                        Phone number:{modalContact ? modalContact.phone_number : ''}
                      </Text>
                      <Divider />
                      <View style={modalButtons}>
                        <Button
                          style={callButton}
                          labelStyle={buttonIconStyle}
                          icon="phone"
                          onPress={() => {
                            callContact(modalContact);
                          }}>
                          <Text>Call</Text>
                        </Button>
                        <Button
                          style={removeContactButton}
                          icon="account-remove"
                          onPress={removeContact}
                          labelStyle={buttonIconStyle}>
                          <Text>Remove</Text>
                        </Button>
                      </View>
                    </Modal>
                  </Portal>
                  <Divider style={divider} />
                </View>
              ))}
            </List.Section>
          </View>
        </View>
      )}
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
    marginBottom: 10,
  },
  text: {
    alignSelf: 'center',
  },
  divider: {
    color: '#3d1b17',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
  },
  topBarButton: {
    width: '50%',
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
  modalText: {
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  callButton: {
    width: '40%',
    marginLeft: '9%',
    backgroundColor: '#379634',
    color: 'white',
  },
  removeContactButton: {
    width: '40%',
    marginLeft: 5,
    marginRight: '9%',
    backgroundColor: '#F83A53',
    color: 'white',
  },
  buttonIconStyle: {
    color: 'white',
  },
};

export {Contacts};
