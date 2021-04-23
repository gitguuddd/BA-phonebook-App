import {AsyncStorage} from 'react-native';
const deviceStorage = {
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('id_token');
      if (value !== null) {
        return [false, value];
      } else {
        return [false, ''];
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async deleteJWT(context) {
    try {
      await AsyncStorage.removeItem('id_token').then(() => {
        context.setJwt('');
      });
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },
};
export default deviceStorage;
