import React from 'react';

const Context = React.createContext({
  jwt: '',
  setJwt: () => {},
  contacts: [],
  setContacts: () => {},
});

export {Context};
