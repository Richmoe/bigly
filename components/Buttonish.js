import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Buttonish extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity 
        onPress={this.props.onPress}
        style={styles.buttonish}
      >
        <Text style={this.props.buttonStyle}>{this.props.title}</Text>
     </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  buttonish: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    //height: '100%',
    padding: 10,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
});
