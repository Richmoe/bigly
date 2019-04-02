import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  Switch,
  FlatList,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';


export default class InGameOptionsScreen extends React.Component {
  static navigationOptions = {
    title: 'Game Options',
  };



  constructor(props) {
    console.log("Creating Settings");
    super(props);

    /*
    //We should have passed in team here and game params here. We assume we loaded on launch:
    this.currentTeam = this.props.navigation.getParam("team",null);

    this.state = { 
      name: this.currentTeam.name, 
      maxInnings: this.currentTeam.maxInnings, 
      machinePitch: this.currentTeam.machinePitch,
      maxRunsPerInning: this.currentTeam.maxRunsPerInning,
      maxFieldPlayers: this.currentTeam.maxFieldPlayers,
      roster: this.currentTeam.roster.slice(0)
    };
    */
  }

  toggleSwitch = (value) => {
    this.setState( {machinePitch: value});
  }

  
  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Innings</Text>
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>End Game</Text>
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>End Inning</Text>
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
  container: {
    //flex: 1,
    //flexDirection: 'column',

  },
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
  buttonish: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    height: '100%',
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

