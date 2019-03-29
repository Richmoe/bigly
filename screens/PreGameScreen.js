import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  KeyboardAvoidingView,
  Switch,
  FlatList,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Buttonish from '../components/Buttonish';
import Player from '../model/Player.js';

import Team, { LineUp } from '../model/Team.js';
import GameConst from '../constants/GameConst';
import GameParams from '../model/GameParams';

export default class PreGameScreen extends React.Component {
    static navigationOptions = {
        title: 'Pre Game Settings',
    };


    constructor(props) {
        console.log("Creating PreGame");
        super(props);

        //We should have passed in team here and game params here. We assume we loaded on launch:
        this.myTeam = this.props.navigation.getParam("myTeam",null);
        this.myTeam.myTeam = true;
        this.myLineup = new LineUp(this.myTeam);

        //We need to create our opponent. For now let's just default to 11:
        opponentTeam = new Team();
        opponentTeam._createDefaultRoster();

        this.opponentLineUp = new LineUp(opponentTeam);

        this.state = {
            myTeamIsHome: true,
            startingLineUpReviewed: false,
        }
    }

    buildLineup() {
        //walk the roster to create batting and fieldingPos arrays:
        //Reset lineups:
        this.myLineup.battingOrder = [];
        this.myLineup.fieldPositions = [];


        for (var i = 0;i < this.myLineup.team.roster.length;i++) {
            //Check to see if we should skip:
            if (this.myLineup.team.roster[i].currentPosition == GameConst.FIELD_POS_OUT){
                console.log("Skipping " + this.myLineup.team.roster[i].name);
            } else {
                //Add to lineup lists:
                this.myLineup.battingOrder[this.myLineup.team.roster[i].battingOrder] = i;
                this.myLineup.fieldPositions[this.myLineup.team.roster[i].currentPosition] = i;
            }
        }

    }

    onLineupChange = () => {

    }

    onHomeAway = () => {
        this.setState({myTeamIsHome: !this.state.myTeamIsHome});
    }

    onStartingLineUp = () => {
        this.setState({startingLineUpReviewed: true});
        this.props.navigation.navigate('Roster', { team: this.myLineup, view: 'lineup', callBack: this.onLineupChange});
    }


    onPlayBall = () => {
        //this.props.navigation.navigate('Roster', { team: this.myLineup, view: 'lineup', callBack: this.onLineupChange});
        this.buildLineup();

        console.log("Play Ball:");

        console.log(this.myLineup);

        homeTeam = (this.state.myTeamIsHome ? this.myLineup : this.opponentLineUp);
        awayTeam = (!this.state.myTeamIsHome ? this.myLineup : this.opponentLineUp);
        gameParams = new GameParams(this.myTeam);

        this.props.navigation.navigate('Game', { homeLineUp: homeTeam, awayLineUp: awayTeam, gameParams: gameParams});


    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={{flex:10}}>
                    <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.myTeam.name}</Text>
                        {this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Home)</Text>}
                        {!this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Away)</Text>}
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.myTeamIsHome && 
                            <Buttonish 
                                title="VS"
                                titleStyle={{fontSize: 24, fontWeight: 'bold'}}
                                onPress={this.onHomeAway}
                            />
                        }
                        {!this.state.myTeamIsHome &&
                            <Buttonish 
                                title="AT"
                                titleStyle={{fontSize: 24, fontWeight: 'bold'}}
                                onPress={this.onHomeAway}
                            />
                        }                
                    </View>
                    <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                        
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.opponentLineUp.teamName = text}
                            placeholder = "team name"
                            value={ this.opponentLineUp.teamName}
                        />



                        {!this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Home)</Text>}
                        {this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Away)</Text>}
                    </View>
                </View>
                <View style={{flex:3}}>
                    <Text style={styles.settings}>MachinePitch: {this.myTeam.machinePitch ? "Yes" : "No"}</Text>
                    <Text style={styles.settings}>Max Innings: {this.myTeam.maxInnings}</Text>
                    <Text style={styles.settings}>Max Runs/Inning: {this.myTeam.maxRunsPerInning}</Text>
                    <Text style={styles.settings}>Max Fielders: {this.myTeam.maxFieldPlayers}</Text>
                </View>
                <View style={{flex:2, alignItems: 'center', justifyContent: 'center'}}>
                    <Buttonish 
                        title="Starting Line Up"
                        titleStyle={{fontSize: 24, fontWeight: 'bold'}}
                        onPress={this.onStartingLineUp}
                    />
                </View>
                <View style={{flex:2, alignItems: 'center', justifyContent: 'center'}}>
                    <Buttonish 
                        title="Play Ball!"
                        titleStyle={{fontSize: 24, fontWeight: 'bold'}}
                        onPress={this.onPlayBall}
                        disabled={!this.state.startingLineUpReviewed}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

/*

                    <Text style={{fontSize: 24}}>Starting Line Up</Text>
<Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.opponentTeam.name}</Text>

*/



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

  },
  settings: {

    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  textInput: {
      //flex: 1,
      fontSize: 48,
      fontWeight: 'bold',
      textAlign: 'center',
      //backgroundColor: 'yellow',
      borderStyle: 'solid',
      borderColor: 'grey',
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

