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
    // game - Game object
    // outs, balls, strikes

    
    getInningText = () => {
        returnString = this.props.game.inning;
        returnString += (this.props.game.isTop ? "˄" : "˅" );
        return (returnString);
    }

    makeInningNumbers = () => {
        var jsx = [];
        for (var i = 1;i < 6;i++) {
            jsx = [...jsx, 
                <Col key={i} size={10}>
                    <Text style={styles.scoreboard2}>{i}</Text>
                </Col>];          
        }
        jsx = [...jsx, 
            <Col key={i} size={10}>
                <Text style={styles.scoreboard2}>R</Text>
            </Col>];    

        return jsx;
    }

    makeInningScores = (team) => {

        var jsx=[];
        if (team == this.props.game.awayTeam) {
            offset = 0;
        } else {
            offset = 1;
        }
        totalScore = 0;


        for (var i = 0;i < 5;i++) {
            inningval = i*2 + offset;
            if ( this.props.game.innings[inningval] === undefined ) {
                jsx = [...jsx, 
                    <Col key={i} size={10}>
                        <Text style={ [styles.scoreboard, styles.box] }> </Text>
                    </Col>]; 
            } else {
                totalScore += this.props.game.innings[inningval].runs;
                jsx = [...jsx, 
                    <Col key={i} size={10}>
                        <Text style={ [styles.scoreboard, styles.box] }> {this.props.game.innings[inningval].runs} </Text>
                    </Col>];
            }
        }

        jsx = [...jsx, 
            <Col key={6} size={10}>
                <Text style={ [styles.scoreboard, styles.box] }>{totalScore}</Text>
            </Col>];

        return jsx;

    }

    render() {
        return (
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
                    <Col size={30}><Text style= {styles.scoreboard}>{this.props.game.awayTeam.name}</Text></Col>
                    {this.makeInningScores(this.props.game.awayTeam)}
                </Row>
                <Row size={25} style={StyleSheet.statusRow2} >
                    <Col size={30}><Text style= {styles.scoreboard}>{this.props.game.homeTeam.name}</Text></Col>
                    {this.makeInningScores(this.props.game.homeTeam)}
                </Row>
           </Grid>
        );
    }
};


const styles = StyleSheet.create({

    statusStyle: {
        /*flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 2,
        */
    },
    statusRow1: {

    },
    statusRow2: {
        justifyContent: 'center',
    },  
    scoreboard: {
        fontSize: 20,
        textAlign: 'center',
    } ,
    scoreboard2: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        width: '75%',
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
        fontSize: 30,
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
    

    
