"use strict";

import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Buttonish from '../components/Buttonish';
import DatePicker from 'react-native-datepicker';

import Team from '../model/Team.js';
import LineUp from '../model/LineUp';
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

        //console.log(this.myTeam);
        this.myTeam.myTeam = true;
        this.myLineup = new LineUp(this.myTeam);

        
        let todaysDate = new Date().toISOString().slice(0,10);



        //We need to create our opponent. For now let's just default to 11:
        let opponentTeam = new Team("Opponent");
        opponentTeam._createDefaultRoster();
        this.opponentLineUp = new LineUp(opponentTeam);

        this.state = {
            myTeamIsHome: true,
            startingLineUpReviewed: false,
            opponentName: "",
            date: todaysDate,
        }
    }

    buildLineup() {
        //walk the roster to create batting and fieldingPos arrays:
        //Reset lineups:
        this.myLineup.battingOrder = [];
        this.myLineup.fieldPositions = [];

        for (let pid in this.myLineup.team.roster) {
            //Check to see if we should skip:
            if (this.myLineup.team.roster[pid].currentPosition == GameConst.FIELD_POS_OUT){
                console.log("Skipping " + this.myLineup.team.roster[pid].name);
            } else {
                //Add to lineup lists:
                this.myLineup.battingOrder[this.myLineup.team.roster[pid].battingOrder] = pid;
                this.myLineup.fieldPositions[this.myLineup.team.roster[pid].currentPosition] = pid;
            }
        }
    }

    onHomeAway = () => {
        this.setState({myTeamIsHome: !this.state.myTeamIsHome});
    }

    onStartingLineUp = () => {
        this.setState({startingLineUpReviewed: true});
        this.props.navigation.navigate('SetLineUp', { Lineup: this.myLineup});
    }


    onPlayBall = () => {
        this.buildLineup();

        console.log("Play Ball:");

        //Validate: 
        //Opponent Name
        if (this.state.opponentName != ""){
            this.opponentLineUp.team.name = this.state.opponentName;
        } else {
            this.opponentLineUp.team.name = "Opponent";
        }

        //My Roster has enough
        if (this.myLineup.battingOrder.length < 8) {
            console.log("We Don't have enough to play!!!");
            return;
        }

        //TODO - save last lineup?

        let homeTeam = (this.state.myTeamIsHome ? this.myLineup : this.opponentLineUp);
        let awayTeam = (!this.state.myTeamIsHome ? this.myLineup : this.opponentLineUp);
        let gameParams = new GameParams(this.myTeam);

        this.props.navigation.navigate('Game', { homeLineUp: homeTeam, awayLineUp: awayTeam, gameParams: gameParams, date: this.state.date});
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
                            onChangeText={(text) => this.setState({opponentName:  text})}
                            placeholder = "Team Name"
                            value={ this.state.opponentName}
                        />

                        {!this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Home)</Text>}
                        {this.state.myTeamIsHome && <Text style={{fontSize: 22}}>(Away)</Text>}
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        <DatePicker
                            style={{width: 200}}
                            date={this.state.date}
                            mode="date"
                            placeholder = "select date"
                            format="YYYY-MM-DD"
                            minDate="2019-01-01"
                            maxDate="2025-12-31"
                            confirmBtnText = "Confirm"
                            cancelBtnText = "Cancel"
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
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
});

