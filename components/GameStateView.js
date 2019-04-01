import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';

import { Col, Row, Grid } from 'react-native-easy-grid';

export default class GameStateView extends Component {

    //Props:
    //gameState: 
    // - currentInning
    // -homeLineUp
    // -awayLineUp

    /*inningState: = gameState = {
        awayScore: 0,
        homeScore: 0,
        outs: 0, 
        balls: 0,
        strikes: 0,
      };
    */
    
    getInningText = () => {
        var returnString = (this.props.gameState.isTop ? "Top " : "Bot " );
        returnString += (this.props.gameState.inning);
        return (returnString);
    }

    getPitchCount = () => {
        return `${this.props.inningState.balls}-${this.props.inningState.strikes} Outs: ${this.props.inningState.outs}`;
    }

    render() {
        return (
            <Grid>
                <Row style={{backgroundColor: "#d3d3d3"}}>
                    <Col>
                        <Row>
                            <Text style={styles.scores}>{this.props.gameState.awayLineUp.teamName} {this.props.inningState.awayScore}</Text>
                        </Row>
                        <Row>
                            <Text style={styles.scores}>{this.props.gameState.homeLineUp.teamName} {this.props.inningState.homeScore}</Text>
                        </Row>
                    </Col>
                    <Col>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.inningState}>{this.getInningText()}  {this.getPitchCount()}</Text>
                        </View>

                    </Col>

                </Row>

            </Grid>

        );
    }
};

/*

            <Grid style= { styles.statusStyle } >
                <Row size = {25} style= {styles.statusRow1} >
                    <Text style = { [styles.elementStyle, styles.L]}>{this.getInningText()}</Text>
                    <Text style = { [styles.elementStyle, styles.C]}>Outs: {this.props.outs}</Text>  
                    <Text style = { [styles.elementStyle, styles.R]}>{this.props.balls} - {this.props.strikes}</Text>
                </Row>
                <Row size={25} style={StyleSheet.statusRow2} >
                    <Col size={30}><Text style= {styles.scoreboard}></Text></Col>
                    {this.makeInningNumbers()}
                </Row>
                <Row size={25} style={StyleSheet.statusRow2} >
                    <Col size={30}><Text style= {styles.scoreboard}>{this.props.game.awayTeam.teamName}</Text></Col>
                    {this.makeInningScores(0)}
                </Row>
                <Row size={25} style={StyleSheet.statusRow2} >
                    <Col size={30}><Text style= {styles.scoreboard}>{this.props.game.homeTeam.teamName}</Text></Col>
                    {this.makeInningScores(1)}
                </Row>
            </Grid>
            */


const styles = StyleSheet.create({

    statusStyle: {

    },
    statusRow1: {

    },
    statusRow2: {
        justifyContent: 'center',
    },  
    scores: {
        //padding: 10,
        marginLeft: 10,
        fontSize: 18,
        textAlign: 'center',
    } ,
    inningState: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    } ,
    teamName: {
        flex: 6,  
        fontSize: 22,
    },
    inningScore: {
        flex: 1,
        borderColor: 'blue',
        borderWidth: 1,
        fontSize: 22,
        textAlign: 'center',
    },
    elementStyle: {
        flex: 1,
        fontSize: 20,
    },
    box: {
        borderColor: 'black',
        borderWidth: 1,
        width: '75%',
    },
    R: {
       textAlign: "right" 
    },
    C: {
        textAlign: 'center'
    },
    L: {
        textAlign: 'left'
    },
});
    

    
