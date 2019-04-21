"use strict";

import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  Button,
} from 'react-native';

import BoxScoreView from '../components/BoxScoreView';
import { log } from '../util/Misc';

export default class GameOverScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  mGame;

  constructor(props) {
    console.log("GameOverScreen");
    super(props);

    //We should have passed in team here and game params here. We assume we loaded on launch:
    this.mGame = this.props.navigation.getParam("game",null);
    //console.log(this.mGame); <- I think this was causing a hang perhaps????
  }


  toggleSwitch = (value) => {
    //this.setState( {machinePitch: value});
  }

  saveGame() {

    

    //Add game data to team:
    this.mGame.myTeam.team.addGame(this.mGame);

    //Save team
    this.mGame.myTeam.team._save();

    //Save game
    //this.mGame._save();

    //debugger;

    this.props.navigation.popToTop();
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
          <BoxScoreView game = {this.mGame} />
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Add Note</Text>
        </View>
        
        <View style={{flex:1}}>
            <Button 
              title = "Game Stats" 
              onPress={() => this.props.navigation.navigate('Stats', { team: this.mGame.myTeam})}
            />
        </View>
        <View style={{flex:1}}>
            <Button 
              title = "Save and Main Menu" 
              onPress={() => this.saveGame()}
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

