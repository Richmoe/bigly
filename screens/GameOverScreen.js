"use strict";

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
import Buttonish from '../components/Buttonish';

export default class GameOverScreen extends React.Component {
    //static navigationOptions = {
    //    header: null,
    //};

    mGame;

  constructor(props) {

    super(props);


    //We should have passed in team here and game params here. We assume we loaded on launch:
    this.mGame = this.props.navigation.getParam("game",null);
    console.log(this.mGame);

  }


  toggleSwitch = (value) => {
    //this.setState( {machinePitch: value});
  }

  
  render() {
    let {away, home} = this.mGame.score;

    console.log(`score: ${away}, ${home}`);
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        
        <View style={{flex:3}}>
            <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.mGame.awayLineUp.teamName}: {away}</Text>
            </View>
                    
            <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.mGame.homeLineUp.teamName}: {home}</Text>
            </View>
        </View>
        <View style={{flex:1}}>
            <Text style={styles.settings}>Box Score here: </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Add Note</Text>
        </View>
        
        <View style={{flex:1}}>
            <Buttonish 
              title = "Game Stats" 
              onPress={() => this.props.navigation.navigate('Stats', { team: this.mGame.myTeam})}
            />
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

