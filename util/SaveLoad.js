import {AsyncStorage} from 'react-native';

export async function saveData (key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
      console.log(error.message);
    }
};


export async function retrieveData (key)  {
    value = null;
    try {
        value = await AsyncStorage.getItem(key);

    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
    return value;
};
