import React from 'react';
import deviceStorage from './services/deviceStorage.js';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
import {useEffect} from 'react';
import {Context} from './components/common';
import {Contacts, Login, Profile, Registration} from './screens';
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

const combinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};
const modifiedCombinedTheme = {
  ...combinedDefaultTheme,
  colors: {
    ...combinedDefaultTheme.colors,
    primary: '#F87060',
    background: '#CDD7D6',
    accent: '#F74E3B',
    error: '#F42B03',
    text: '#020402',
  },
};

export default function App() {
  const [jwt, setJwt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootStrap = async () => {
      let [loading, token] = await deviceStorage.loadJWT();
      if (token !== null) {
        setLoading(loading);
        setJwt(token);
      } else {
        setLoading(loading);
        setJwt(token);
      }
    };
    bootStrap();
  }, [jwt, loading]);

  return (
    <Context.Provider
      value={{
        jwt: jwt,
        setJwt: setJwt,
      }}>
      <PaperProvider theme={modifiedCombinedTheme}>
        <NavigationContainer theme={modifiedCombinedTheme}>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({color, size}) => {
                let iconName;

                if (route.name === 'Register') {
                  iconName = 'key';
                } else if (route.name === 'Login') {
                  iconName = 'lock';
                } else if (route.name === 'Contacts') {
                  iconName = 'contacts';
                } else if (route.name === 'Profile') {
                  iconName = 'user';
                }

                // You can return any component that you like here!
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#F87060',
              inactiveTintColor: '#3d1b17',
            }}>
            {!jwt ? (
              <>
                <Tab.Screen name="Register" component={Registration} />
                <Tab.Screen name="Login" component={Login} />
              </>
            ) : (
              <>
                <Tab.Screen name="Contacts" component={Contacts} />
                <Tab.Screen name="Profile" component={Profile} />
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Context.Provider>
  );
}
