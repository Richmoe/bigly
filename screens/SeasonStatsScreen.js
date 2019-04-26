"using strict";

import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
    Button,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GameConst from "../constants/GameConst.js";
import * as Util from "../util/Misc";
import PlayerStats from '../model/PlayerStats.js';
import BaseStatsScreen from './BaseStatsScreen';

export default class SeasonStatsScreen extends BaseStatsScreen {

    team;

    seasonStats = {};

    constructor(props){
        console.log("Construct SeasonStatsScreen");

        super(props);

        this.team = this.props.navigation.getParam("team",[]);

        //create default order for now:
        this.order = Object.keys(this.team.roster);
        //Util.log(this.order);

        this.buildSeasonStats();

        this.state = { 
            view: "batting", 
            currentGameIX: this.team.gamesPlayed.length, //start with Season view
        };
    }

    buildSeasonStats() {
        //Build season stats array for this view:
        // We have an object of gameUIDs containing and object of player stats objects by uid:
        // {gameuid: {player uid: {pitcher Stats, batter stats}}}
        //
        // create a new object that hold just the playerUIDs for the season
        var seasonStats = {};

        //Build initial 0'ed array:
        for (let playerUID in this.team.roster) {
            seasonStats[playerUID] = new PlayerStats(playerUID);
        }

        //We have this.team.gamesPlayed array to walk
        for (let i = 0;i < this.team.gamesPlayed.length;i++) {
            Util.log(`Getting stats for game UID: ${this.team.gamesPlayed[i].uid}`);

            //Get            
            let gameStats = this.team.playerGameStats[this.team.gamesPlayed[i].uid];
  
            //Util.log(gameStats);

            //keep this functionality closer to the stats class itself so we can easily modify
            //For each game, sum the stats by player:
            for (let playerUID in gameStats) {
                //get player's total from season stats or create if doesn't exist yet:
                let playerSeasonStats = seasonStats[playerUID];
                playerSeasonStats.sumStats(gameStats[playerUID]);
                seasonStats[playerUID] = playerSeasonStats;
            }
        }

        this.seasonStats = seasonStats;
    }

    makeRow = (ix, val) => {

        var uid = this.order[ix];
        var player = this.team.roster[uid];
        //var game = this.
        var playerStats;
        if (this.state.currentGameIX == this.team.gamesPlayed.length) {
            playerStats = this.seasonStats[player.uid];
        } else {
            let gameUid = this.team.gamesPlayed[this.state.currentGameIX].uid;
            let gameStats = this.team.playerGameStats[gameUid];
            playerStats = gameStats[player.uid];
        }

        return this.getRowJSX(ix, player, playerStats);
    }

    updateOrder(pView) {
        //create default order for now:
        this.order = Object.keys(this.team.roster);
    }

    getGameName() {
        if (this.state.currentGameIX == this.team.gamesPlayed.length) {
            return "Season";
        } else {
            let gamePlayed = this.team.gamesPlayed[this.state.currentGameIX];

            return gamePlayed.opponent;
        }
    }

    switchGame() {
        let nextGameIX = this.state.currentGameIX + 1;
        if (nextGameIX > this.team.gamesPlayed.length) {
            nextGameIX = 0;
        }
        this.setState({currentGameIX: nextGameIX});
    }

    getTitle() {
        return (
            <Row style={{height: 40}} >
                <Col >
                <Button 
                    title={ this.getGameName() }
                    onPress={() => {this.switchGame()}}
                />
                </Col >
            </Row>
        );
    }
}

