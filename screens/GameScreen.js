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

import PitchControl from '../components/PitchControl.js';
import PitcherView from '../components/PitcherView.js';
import BatterView from '../components/BatterView.js';
import GameStateView from '../components/GameStateView.js';
import FieldView from '../components/FieldView.js';
import HitView from '../components/HitView.js';


/*
import PlayerStats from './PlayerStats.js';
*/

export default class GameScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Dragons'),
    };
  };


    mBaseRunners;
    mBaseRunnersPreHit; //Store off copy of pre-hit UX runners in case we need to reset
    mGame;

    constructor(props) {
        console.log("Setting up Game ");
        super(props);

        //Init Game
        defaultGame = this._testGame();


        this.mGame = defaultGame;
        //console.log(this.mGame);
        batterUp = this.mGame.nextBatter;


        this.state = {
            machinePitch: true,
            awayScore: 0,
            homeScore: 0,
            outs: 0, 
            runs: 0,
            balls: 0,
            strikes: 0,
            inHittingUX: false,
            batterUp: batterUp

        }

        this.mBaseRunners = [batterUp,  -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
        
    }


    _testGame () {
      homeTeam = new Team("Dragons");
      homeTeam._createDefaultMyRoster();
      homeTeam.myTeam = true;

      awayTeam = new Team("Opponent");
      awayTeam._createDefaultRoster();
      
      gameSettings = new GameParams(10,true,true);

      return new Game(homeTeam, awayTeam, gameSettings);


    }


    setBatter (batter) {
      this.mBaseRunners[0] = batter;

      console.log(`mBaseRunners: ${this.mBaseRunners}`);
    }

    nextBatter() {
        this.setState( { balls : 0, strikes: 0 });
        batterUp = this.mGame.nextBatter;
        console.log("BatterUp: " + batterUp);
        /*
        if (this.isBatting()) {
          batterUp = ((this.state.batterUp + 1 ) % this.state.teamData.length);

        } else {
          batterUp = 100;
        }
                */
        this.setState( {batterUp: batterUp }) ;
        this.mBaseRunners[0] = batterUp;
    };

    newInning() {

      this.mGame.newInning();
      this.setState( { outs: 0 } );

      this.mBaseRunners = [-1, -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
      this.nextBatter();
      /*
       
        this.setState ( {
            inning : this.state.inning + 1,
            outs: 0,
            runs: 0,
            balls: 0,
            strikes: 0,
        });
        */

        console.log(`New inning: ${this.mGame.inning} (TOP: ${this.mGame.isTop}), starting onBase: ${this.mBaseRunners}`);
    };

    scoreRun(player, pitcher, runcount = 1) //Need to figure out RBIs etc.
    {

      console.log("Score run " + runcount);
      /*
      var newScore = this.state.score;
      newScore[this.state.inning % 2] += runcount;
      this.setState ( {
          score : newScore
      });
      */
      this.mGame.addScore(runcount);
      let {away, home} = this.mGame.score;
      console.log(`Score: ${away} - ${home}`);
      this.setState ({awayScore: away, homeScore: home});

    };

    updatePitcherStats = (pitchType) => {

      pitcherPlayer = this.mGame.fieldingTeam.playerByPos(0);

      if (['strike','foul','hit'].indexOf(pitchType) >= 0) {
        pitcherPlayer.pitcherStats.strikes += 1;
      } else if (['ball','hbp'].indexOf(pitchType) >= 0) {
        pitcherPlayer.pitcherStats.balls += 1;
      } else {
        console.log("Invalid PitchType: " + pitchType);
      };

    }

    pitchCallback = (pitchType) => {


      if (!this.state.machinePitch)  this.updatePitcherStats(pitchType);

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
      } else if (pitchType === 'done') {
        this.resolveHit();
        this.setState( {inHittingUX: false});
      } else if (pitchType == 'reset') {
        this.mBaseRunners = [...this.mBaseRunnersPreHit];
        this.setState( {inHittingUX: false});
      } else {
        console.log("error pitch type: " + pitchType);
      }

      if (curStrikeCount >= 3)
      {
        //strikeout
        ++curOutCount;
        if (curOutCount >= 3){
          console.log(`Strikeout! Retired the side`);
          this.newInning();
        } else {
          console.log(`Strikeout! Outs: ${curOutCount}`);
          this.setState( { outs: curOutCount });
          this.nextBatter();
        }
      } else if (curBallCount >= 4) {
        //Walk
        console.log(`Walk`);
        this.nextBatter();
      } else {
        console.log(`${pitchType}: ${curBallCount} - ${curStrikeCount}`);
        this.setState( {
            strikes: curStrikeCount,
            balls : curBallCount
        });
    }
    titleStr = `Inning: ${this.mGame.inning} ${curBallCount}-${curStrikeCount} Outs: ${curOutCount} Score: ${this.state.awayScore}-${this.state.homeScore}`;

    this.props.navigation.setParams({title: titleStr});

    };

    onPitcherClick = () => {
      this.props.navigation.navigate('Roster', { team: this.mGame.fieldingTeam, view: 'pitching', callBack: this.onPitcherChange});
    };


    onBatterClick = () => {
      this.props.navigation.navigate('Roster', { team: this.mGame.battingTeam, view: 'batting'});     
    }

    onHitClick = () => {
      console.log("OHC!");
      this.mBaseRunnersPreHit = [...this.mBaseRunners];
      this.setState({inHittingUX : true});
    }

    onPitcherChange = (newPitcherIx) => {
      var currentPitcherIx = this.mGame.fieldingTeam.fieldPositions[0];
      console.log(this.mGame.fieldingTeam.fieldPositions);
      console.log("Got Pitcher change " + newPitcherIx + " Current: " + currentPitcherIx);

      
      if (newPitcherIx == currentPitcherIx) {
        console.log("No change in pitcher!");
        return;
      }
  
      //baseline is to swap with other position:
      //Update team orders
      var oldPos = this.mGame.fieldingTeam.roster[newPitcherIx].positionByInning[0];
      console.log(`Old position for new pitcher was ${oldPos}`);

      //Updated old Player's positionByInning:
      this.mGame.fieldingTeam.roster[currentPitcherIx].positionByInning[0] = oldPos;
      //set new player's position to Pitcher:
      this.mGame.fieldingTeam.roster[newPitcherIx].positionByInning[0] = 0;

      //Update fieldPositionsArray
      this.mGame.fieldingTeam.fieldPositions[oldPos] = this.mGame.fieldingTeam.fieldPositions[0];
      this.mGame.fieldingTeam.fieldPositions[0] = newPitcherIx;

      console.log(this.mGame.fieldingTeam.fieldPositions);

      //Since I'm not tying this to state now, just force the update
      this.forceUpdate();

    }

    onMachineChange = () => {      
      this.setState ( {machinePitch : !this.state.machinePitch});
    }

    totalRunners = (total, num) => {
      if (num >= 0) {
        return (total + 1);
      } else {
        return total;
      }
    }

    resolveHit = () => {
      
      //This is where we determine who ended where
      if (this.mGame.myTeamIsBatting) {
        console.log("resolveHit is batting");
      } else {
        console.log("resolveHit is fielding");
      }
      console.log(this.mBaseRunners);

      //Store current Batter:
      //Find batter:
      var batterLoc = this.mBaseRunners.indexOf(this.state.batterUp);
      console.log(`batter advanced to ${batterLoc}`);

      //get runs:
      var runs = this.mBaseRunners.slice(4,8);
      var runCount = runs.reduce(this.totalRunners,0);
      console.log("runCount " + runCount);
      console.log(runs);
      if (runCount > 0)  this.scoreRun(0,0,runCount);


      //get outs:
      var outs = this.mBaseRunners.slice(8,11);
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

      //Clean out extra status:
      this.mBaseRunners.fill(-1,4);
      
    }

    onLayout = (event) => {
      this.fieldX = Math.floor(event.nativeEvent.layout.x);
      this.fieldY = Math.floor(event.nativeEvent.layout.y);
      this.fieldWidth = Math.floor(event.nativeEvent.layout.width);
      this.fieldHeight = Math.floor(event.nativeEvent.layout.height);
      console.log(`Field Dims: ${this.fieldWidth} x ${this.fieldHeight} at ${this.fieldX},${this.fieldY}`);
  }

    render() {
      console.log(this.mBaseRunners);
 
      return (
        <Grid style={styles.container}>

        
        <Row size={80} onLayout = {(event) => this.onLayout(event)}>
          <HitView baseRunners = {this.mBaseRunners} battingTeam={this.mGame.battingTeam} clickCB={this.onHitClick} />
        </Row>
        
        <Row size={10} >
          <PitchControl style={styles.pitchcontrol} clickHandler = {this.pitchCallback} isHitting= {this.state.inHittingUX} />
        </Row>
        <Row size={10} >
        { this.mGame.myTeamIsBatting == false && 
          <PitcherView 
            onPitcherChange = {this.onPitcherClick} 
            onMachineChange = {this.onMachineChange} 
            isMachinePitch={this.state.machinePitch} 
            pitcher = {this.mGame.fieldingTeam.playerByPos(0)} 
          />
        }
        { this.mGame.myTeamIsBatting == true && 
          <BatterView 
            battingTeam = {this.mGame.battingTeam}
            batterClick = {this.onBatterClick}
          />
        }
        </Row>


        
      </Grid>

        );
            
      
/*

        <Row size={0}>
          <GameStateView style={styles.gamestate}
              balls = {this.state.balls}
              strikes = {this.state.strikes}
              outs = {this.state.outs}
              game = {this.mGame}
            />
        </Row>

     
       */
    }

  }

  const styles = StyleSheet.create({
    container: {
      //flex: 1,
      //flexDirection: 'column',

    },
    pitchcontrol: {
        //flex: .5,
        backgroundColor: 'yellow',
    },
    gamestate: {
        //flex: 3,
        backgroundColor: 'green',
    }
  });
