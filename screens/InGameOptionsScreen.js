import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  Switch,
  Button,

} from 'react-native';


export default class InGameOptionsScreen extends React.Component {
  static navigationOptions = {
    title: 'Game Options',
  };

  mGame;
  mCallBack

  constructor(props) {
    console.log("Creating InGameOptions");
    super(props);


    //We should have passed in team here and game params here. We assume we loaded on launch:
    this.mGame = this.props.navigation.getParam("game",null);
    this.mCallBack = this.props.navigation.getParam("callBack", null);
  }

  toggleSwitch = (value) => {
    //this.setState( {machinePitch: value});
  }

  endGame() {
      this.mCallBack("EndGame");
      this.props.navigation.goBack();
  }

  endInning() {

    this.mCallBack("EndInning");
    this.props.navigation.goBack();
  } 
  
  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Innings</Text>
        </View>
        <View style={{flexDirection: "row"}}>
            <Button 
              title = "End Game"
              onPress = {() => this.endGame()}
            />
          
        </View>
        <View style={{flexDirection: "row"}}>
        <Button 
          title = "End Inning"
          onPress = {() => this.endInning()}
        />
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Update LineUp</Text>
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Undo Last Play</Text>
        </View>
        
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Disable Mercy Rule:</Text>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={ false}
              
            />
          </View>
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Add Note</Text>
        </View>
      </View>
     

    );
  }
}


const styles = StyleSheet.create({

  textLabel: {

    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  textInput: {
      flex: 1,
      fontSize: 16,
      //backgroundColor: 'yellow',
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
  },
  switch: {
      flex: 1,
      alignItems: 'center',
      //backgroundColor: 'green',
      transform: [{ scaleX: .7  }, { scaleY: .7}] ,
  },
});

