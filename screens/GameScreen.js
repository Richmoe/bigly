import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Team from '../model/Team';
import GameParams from '../model/GameParams';
import Game from '../model/Game';

/*
import PitchControl from './PitchControl.js';
import GameState from './GameState.js';
import PitchState from './PitchState.js';
import BatterState from './BatterState.js';
import PlayerStats from './PlayerStats.js';
import FieldView from './FieldView.js';
*/

export default class GameScreen extends React.Component {
    
    mOnBase;
    mGame;

    constructor(props) {
        console.log("Setting up Game ");
        super(props);

        //Init Game
        defaultGame = this._testGame();


        this.mGame = defaultGame;

        //Make sure we sort by battingOrder        
        //gameRoster.sort((a,b) => a.battingOrder - b.battingOrder);

        /*
        //Create teamStats:
        teamStats = [];
        for (var i = 0;i<gameRoster.length;i++)
        {
          teamStats.push(new PlayerStats(gameRoster[i].name, gameRoster[i].battingOrder, gameRoster[i].fieldingPos));
          //Store off current pitcher IX
          if (gameRoster[i].fieldingPos == 0)
          {
            console.log("starting pitcher is ix " + i);
            curPitcher = i;
          }
        }
        console.log(teamStats);
        */

        console.log(this.mGame);

        this.mOnBase = [100,-1,-1,-1];


        this.state = {
            machinePitch: true,
            score: [],
            outs: 0, 
            runs: 0,
            balls: 0,
            strikes: 0,

        }

        /*
        this.pitch = this.pitch.bind(this);

        //create 2d array for scores
        var scoreInit = new Array(5).fill(0);
        this.state.score.push(scoreInit);
        this.state.score.push(scoreInit);
        */
    }


    _testGame () {
      homeTeam = new Team("Dragons");
      homeTeam._createDefaultMyRoster();

      awayTeam = new Team("Opponent");
      awayTeam._createDefaultRoster();
      
      gameSettings = new GameParams(10,true,true);

      return new Game(homeTeam, awayTeam, gameSettings);


    }


    setBatter (batter) {
      this.mOnBase[0] = batter;

      console.log(`mOnBase: ${this.mOnBase}`);
    }

    nextBatter() {
        this.setState( { balls : 0, strikes: 0 });
        batterUp = this.mGame.nextBatter();
        console.log("BatterUp: " + batterUp);
        /*
        if (this.isBatting()) {
          batterUp = ((this.state.batterUp + 1 ) % this.state.teamData.length);

        } else {
          batterUp = 100;
        }
                */
        this.setState( {batterUp: batterUp }) ;
        this.setBatter(batterUp);


    };

    newInning() {

      this.mGame.newInning();
      this.mOnBase = [-1,-1,-1,-1];
      this.nextBatter();
      /*
        if (this.isBatting()) {
          //Date and store off next batter
          batterUp = ((this.state.batterUp + 1 ) % this.state.teamData.length);
          this.setState( {batterUp: batterUp }) ;

          //onBase for next round:
          this.onBase = [100,-1,-1,-1];
        } else {
          //We're going up to bat:
         this. onBase = [this.state.batterUp, -1, -1, -1]
        }
        this.setState ( {
            inning : this.state.inning + 1,
            outs: 0,
            runs: 0,
            balls: 0,
            strikes: 0,
        });
        */



        console.log(`New inning: ${this.mGame.inning} (TOP: ${this.mGame.isTop}), starting onBase: ${this.mOnBase}`);
    };

    scoreRun(player, pitcher, runcount = 1) //Need to figure out RBIs etc.
    {
      /*
      console.log("Score run " + runcount);
        var newScore = this.state.score;
        newScore[this.state.inning % 2] += runcount;
        this.setState ( {
            score : newScore
        });
        */
    };

    updatePitcherStats = (pitchType) => {

      /*
      //We can't reassign an array element directly, so we have to copy existing pitchCount array
      let tempTeamData = [...this.state.teamData];

      if (['strike','foul','hit'].indexOf(pitchType) >= 0) {
        tempTeamData[this.state.currentPitcher].pitcherStats.strikes += 1;
      } else if (['ball','hbp'].indexOf(pitchType) >= 0) {
        tempTeamData[this.state.currentPitcher].pitcherStats.balls += 1;
      } else {
        console.log("Invalid PitchType: " + pitchType);
      };

      this.setState( {teamData: tempTeamData});
      */
    }



    pitch = (pitchType) => {
        //Update total pitch count if we're not at bat
      /*
        if (pitchType === 'hit')
        {

          this.props.navigation.navigate('HitScreen', { roster: this.state.teamData, baseRunners: this.onBase, resolve: this.resolveHit });

          return;
        }

        if (!this.isBatting() && !this.state.machinePitch)  this.updatePitcherStats(pitchType);

        curStrikeCount = this.state.strikes;
        curBallCount = this.state.balls;
        curOutCount = this.state.outs;

        if (pitchType === 'strike') {
            ++curStrikeCount ;
        } else if (pitchType === 'ball') {
            ++curBallCount;
        } else if (pitchType === 'foul') {
            if (curStrikeCount < 2) {
                ++curStrikeCount;
            }
        } else {
            console.log("error pitch type: " + pitchType);
        }

        if (curStrikeCount >= 3)
        {
            //strikeout
            this.setState( { outs: this.state.outs + 1});

            if (curOutCount >= 2){
                this.newInning();
            } else {
              this.nextBatter();
            }
        } else if (curBallCount >= 4) {
            //Walk
            this.nextBatter();

        } else {
            this.setState( {
                strikes: curStrikeCount,
                balls : curBallCount
            });
        }
        */
    };

    onPitcherClick = () => {

      console.log("OPC!");
      /*
      //Create Roster view data. God this is ugly
      tempExtraData = [];
      for (var i = 0;i < this.state.teamData.length;i++) {
        tempExtraData.push({Pitches: (this.state.teamData[i].pitcherStats.balls + this.state.teamData[i].pitcherStats.strikes)});
      }
      console.log(tempExtraData);

      this.props.navigation.navigate('RosterScreen', { roster: this.state.teamData, extraData: tempExtraData, formatRow: [80, 20], callBack: this.onPitcherChange});
      */
    };


    onBatterClick = () => {
      //Create Roster view data. God this is ugly
      console.log("OBC!");
      /*
      tempExtraData = [];
      for (var i = 0;i < this.state.teamData.length;i++) {
        tempExtraData.push({Batting: this.state.teamData[i].battingOrder + 1});
      }
      console.log(tempExtraData);
      this.props.navigation.navigate('RosterScreen', { roster: this.state.teamData, extraData: tempExtraData, formatRow: [80,20]});
      */
   }

    setPlayerPosition = (playerIx, fieldPos) => {
        //var temp = [...this.state.teamData];
        //temp[playerIx].positionByInning[this.inningNumber() - 1] = fieldPos;
    };

    onPitcherChange = (newPitcherId) => {
      console.log("Got Pitcher change " + newPitcherId);

      /*
      if (newPitcherId == this.state.currentPitcher) {
        console.log("No change in pitcher!");
        return;
      }


      //baseline is to swap with other position:
      var fieldPos = this.state.teamData[newPitcherId].positionByInning[this.inningNumber() - 1];
      console.log("old position was " + fieldPos);

      //set old pitcher to that position:
      this.setPlayerPosition(this.state.currentPitcher, fieldPos);

      //set up new pitcher

      this.setPlayerPosition(newPitcherId, 0);
      this.setState ( { currentPitcher : newPitcherId } );
      console.log(this.state.teamData);
      */
    }

    onMachineChange = () => {      //console.log("got machine change");
      this.setState ( {machinePitch : !this.state.machinePitch});
    }

    totalRunners = (total, num) => {
      if (num > 0) {
        return (total + 1);
      } else {
        return total;
      }
    }

    resolveHit = (runnersOnBase) => {
      /*
      //This is where we determine who ended where
      if (this.isBatting()) {
        console.log("resolveHit is batting");
      } else {
        console.log("resolveHit is fielding");
      }
      console.log(runnersOnBase);

      //Store current Batter:

      //Get updated onBase
      this.onBase = runnersOnBase.slice(0,4);

      console.log(`onBase: ${this.onBase}`);

      //Find batter:
      var batterLoc = runnersOnBase.indexOf(this.state.batterUp);
      console.log(`batter advanced to ${batterLoc}`);

      //get runs:
      var runs = runnersOnBase.slice(4,8);
      var runCount = runs.reduce(this.totalRunners,0);
      console.log("runCount " + runCount);
      console.log(runs);
      if (runCount > 0)  this.scoreRun(0,0,runCount);


      //get outs:
      var outs = runnersOnBase.slice(8,11);
      var outCount = outs.reduce(this.totalRunners,0);
      if (outCount > 0) {
        var curOutCount = this.state.outs + outCount;
        this.setState( { outs: curOutCount });
        if (curOutCount >= 2){
          this.newInning();
        } else {
          this.nextBatter();
        }
      } else {
        this.nextBatter();
      }
      */
    }

    render() {
 
      return (
        <Grid style={styles.container}>

        <Row size={10}>
        <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
            />
        </Row>

        <Row size={5} style={{backgroundColor: 'red'}}>

        </Row>
        <Row size={10}>


        </Row>

        <Row size={55} style={{backgroundColor: 'red'}}>

        </Row>
        <Row size={20}>

        </Row>
        
      </Grid>

        );
            
      
/*
      return (
        
        <Grid style={styles.container}>

          <Row size={10}>
            {!this.isBatting() ? 
              <PitchState onPitcherChange = {this.onPitcherClick} onMachineChange = {this.onMachineChange} isMachinePitch={this.state.machinePitch} currentPitcher = {this.state.teamData[this.state.currentPitcher]} />
              :
              <BatterState roster={this.state.teamData} onClick = {this.onBatterClick} curBatter= {this.state.batterUp}/>
            }
          </Row>

          <Row size={5}>

          </Row>
          <Row size={10}>


          <PitchControl style={styles.pitchcontrol} clickHandler = {this.pitch} />
          </Row>

          <Row size={55}>
            { true && <FieldView baseRunners={this.onBase} />}
          </Row>
          <Row size={20}>
          <GameState style={styles.gamestate}
            balls = {this.state.balls}
            strikes = {this.state.strikes}
            outs = {this.state.outs}
            inning = {this.state.inning}
          />
          </Row>
          
        </Grid>
      );
       */
    }

  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',

    },
    pitchcontrol: {
        flex: .5,
        backgroundColor: 'yellow',
    },
    gamestate: {
        flex: 3,
        backgroundColor: 'green',
    }
  });
