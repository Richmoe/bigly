import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  TouchableNativeFeedback,
  StyleSheet,
  Platform,
  View,
} from 'react-native';

export default class Buttonish extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    /*if (color) {
      if (Platform.OS === 'ios') {
        textStyles.push({color: color});
      } else {
        buttonStyles.push({backgroundColor: color});
      }
    }
    */
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;


    const formattedTitle =  Platform.OS === 'android' ? this.props.title.toString().toUpperCase() : this.props.title;

    buttonStyle = this.props.buttonStyle;
    if (buttonStyle == null) {
      buttonStyle = styles.buttonDefault;

    }

    if (this.props.disabled) {
      buttonStyle = { backgroundColor: '#CEE3F6'}
    }

    if (this.props.disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }

    return (
      <Touchable
        onPress={this.props.onPress}
       
        disabled={this.props.disabled}
      >
        <View style={buttonStyles}>
          <Text style={textStyles}>{formattedTitle}</Text>
        </View>
     </Touchable>
    );
  }
}
//
// style={[styles.buttonish, buttonStyle]}
//<Text style={[this.props.titleStyle, {color: 'white'}]}>{this.props.title}</Text>

const styles = StyleSheet.create({
  buttonish: {
    backgroundColor: '#81BEF7',
    justifyContent: 'center',
    //height: '100%',
    padding: 10,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    //borderStyle: 'solid',
    //borderColor: 'black',
    //borderWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderRadius: 10,
  },
  button: Platform.select({
    ios: {},
    android: {
      margin: 5,
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: {
    textAlign: 'center',
    padding: 8,
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '500',
      },
    }),
  },
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
});
