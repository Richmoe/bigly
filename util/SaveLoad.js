import {AsyncStorage} from 'react-native';

export async function saveData (key, value) {
    try {
        let stringy = JSON.stringify(value);
        console.log("Stringified save = " + stringy.length);
        if (stringy.length > 10000) {
            debugger;
        }
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

export async function getAllKeys() {

    try {
        const keys = await AsyncStorage.getAllKeys();
        console.log("Get All Keys:");
        console.log(keys);

        return keys;

    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
    return null;
}

export async function deleteKey(key) {

    try {
        AsyncStorage.removeItem(key);

    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
    return null;
}
