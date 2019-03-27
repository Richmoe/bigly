import {AsyncStorage} from 'react-native';

export async function saveData (key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
      console.log(error.message);
    }
};


export async function retrieveData (key)  {
    try {
        const value = await AsyncStorage.getItem(key);
        const returnVal = JSON.parse(value);
        return returnVal;

    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
    return;
};
