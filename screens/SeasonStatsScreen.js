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


/*
class PitcherStats {
    balls = 0;
    strikes = 0;
    hits = 0;
    runsAgainst = 0;
    walks = 0;
    strikeOuts = 0;
    hitBatter = 0;
    battersFaced = 0;

    get pitches() {
        return (this.balls + this.strikes);
    }
}

class BatterStats {
    atBats = 0;
    strikeOuts = 0;
    walks = 0;
    hitBatter = 0;
    singles = 0;
    doubles = 0;
    triples = 0;
    homeRuns = 0;
    RBIs = 0;
    runs = 0;

    get hits() {
        return (this.singles + this.doubles + this.triples + this.homeRuns);
    }
*/


export default class SeasonStatsScreen extends React.Component {
    static navigationOptions = {
        title: 'Stats',
    };

    team;
    formatRow;
    header;
    order;

    constructor(props){
        console.log("Construct StatsScreen");

        super(props);

        this.team = this.props.navigation.getParam("team",[]);

        //create default order for now:
        this.order = Object.keys(this.team.roster);
        Util.log(this.order);

        this.buildSeasonStats();

        this.state = { view: "batting" };
        this.setView("batting");
    }

    buildSeasonStats() {
        //Build season stats array for this view:
        // We have an object of gameUIDs containing and object of player stats objects by uid:
        // {gameuid: {player uid: {pitcher Stats, batter stats}}}
        //
        // create a new object that hold just the playerUIDs for the season
        var seasonStats = {};


        //We have this.team.gamesPlayed array to walk
        debugger;
    

        for (let i = 0;i < this.team.gamesPlayed.length;i++) {
            Util.log(`Getting stats for game UID: ${this.team.gamesPlayed[i].uid}`);

            //Get            
            let gameStats = this.team.playerGameStats[this.team.gamesPlayed[i].uid];
            //debugger;

            Util.log(gameStats);

            //keep this functionality closer to the stats class itself so we can easily modify
            //For each game, sum the stats by player:
            for (let playerUID in gameStats) {
                //get player's total from season stats or create if doesn't exist yet:
                let playerSeasonStats = seasonStats[playerUID];
                if (playerSeasonStats == null) {
                    playerSeasonStats = new PlayerStats(playerUID);
                }

                playerSeasonStats.sumStats(gameStats[playerUID]);
                seasonStats[playerUID] = playerSeasonStats;
            }
        }

        this.seasonStats = seasonStats;
    }

    setView (view) {

     
        if (view == "batting") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1,1];
            this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];
            //this.order = this.team.battingOrder;
        } else if (view == "pitching") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1];;
            this.header = ["Name", "BF", "R", "H", "BB", "SO", "HB", "PT", "B", "S"];
            //this.order = this.team.fieldPositions;
        } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            //this.order = this.team.battingOrder;
        }
    }
   
    rowJSX = (ix, ...args) => {
        var jsx = [];

        //assert args.length = formatRow.length
        for (var i = 0; i < this.formatRow.length;i++) {
            jsx = [...jsx, 
                <Col key={i} size={this.formatRow[i]}>
                    <Text style={styles.rowText}>{args[i]}</Text>
                </Col>
            ];            
        }

        return jsx;
    };

    makeHeader = () => {
        var jsx = [];

        for (var i = 0; i < this.header.length; i++) {
            jsx = [...jsx, <Col key={i} size={this.formatRow[i]}><Text style={styles.headerText}>{this.header[i]}</Text></Col>];
        }

        return jsx;
    };

    makeRow = (ix, val) => {

        var uid = this.order[ix];
        var player = this.team.roster[uid];
        //var game = this.
        var playerStats = this.seasonStats[player.uid];

        if (this.state.view == "batting" ) {
            //this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];

            return this.rowJSX( ix,
                player.name, 
                playerStats.batterStats.atBats,
                playerStats.batterStats.runs,
                playerStats.batterStats.hits,
                playerStats.batterStats.RBIs,
                playerStats.batterStats.doubles,
                playerStats.batterStats.triples,
                playerStats.batterStats.homeRuns,
                playerStats.batterStats.walks,
                playerStats.batterStats.strikeOuts,
                playerStats.batterStats.hitBatter
            );
        } else if (this.state.view == "pitching" ) {
            //this.header = ["Name", "BF", "R", "H", "BB", "SO", "HB", "PT", "B", "S"];
            return this.rowJSX(ix, 
                player.name, 
                playerStats.pitcherStats.battersFaced,
                playerStats.pitcherStats.runsAgainst,
                playerStats.pitcherStats.hits,
                playerStats.pitcherStats.walks,
                playerStats.pitcherStats.strikeOuts,
                playerStats.pitcherStats.hitBatter,
                playerStats.pitcherStats.pitches,
                playerStats.pitcherStats.balls,
                playerStats.pitcherStats.strikes

            );
        } else {
            return this.rowJSX(ix, (ix+1), player.name, player.currentPosition);
        }
    }

    updateView(pView) {

        this.setState({view: pView});
        this.setView(pView);
    }

    render() {

        //Create rows:
        var fullRows = this.order.map( (item,ix) => <Row key={ix} let style = {ix % 2 ? [styles.rowOdd, styles.rowText] : styles.rowText}>{this.makeRow(ix, item)}</Row>);
            
        return (
            <Grid>
                
                <Row key={99}>{this.makeHeader()}</Row>
                {fullRows}
                <Row style={{height: 65}} >
                    <Col >
                    <Button 
                        title="Batting" 
                        onPress={() => {this.updateView("batting")}}
                    />
                    </Col >
                    <Col >
                    <Button
                        title="Pitching" 
                        onPress={() => {this.updateView("pitching")}}
                    />
                    </Col>
                </Row>
            </Grid>
        );

        }
    }


    const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        margin: 5,
        padding: 30,

    },
    rowText: {
        fontSize: 16,
        textAlign: 'left',
        //margin: 5,
    },
    rowOdd: {
        backgroundColor: '#ddd',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        borderColor: 'black',
        borderBottomWidth: 2
        
    }


});

