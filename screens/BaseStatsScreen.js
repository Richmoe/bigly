import React, {Component} from 'react';
import {
    StyleSheet, 
    Text,
    Button, 
    View,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PlayerStats from "../model/PlayerStats";
import * as Util from "../util/Misc";

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

*/


export default class BaseStatsScreen extends React.Component {
    static navigationOptions = {
        title: 'Stats',
    };

    formatRow;
    header;
    order;

    constructor(props){
        console.log("Construct BaseStatsScreen");

        super(props);
        this.state = { view: "batting" };
        this.setView("batting");
    }


    setView (view) {
        if (view == "batting") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1,1];
            this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];
        } else if (view == "pitching") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1];;
            this.header = ["Name", "BF", "R", "H", "BB", "SO", "HB", "PT", "B", "S"];
         } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
        }
    }
   
    _rowJSX = (ix, ...args) => {
        var jsx = [];

        //assert args.length = formatRow.length
        for (let i = 0; i < this.formatRow.length;i++) {
            jsx = [...jsx, 
                <Col key={i} size={this.formatRow[i]}>
                    <Text style={styles.rowText}>{args[i]}</Text>
                </Col>
            ];            
        }

        return jsx;
    };



    makeRow = (ix, val) => {

        //override
        return null;
    }

    _makeHeader = () => {
        var jsx = [];

        for (let i = 0; i < this.header.length; i++) {
            jsx = [...jsx, <Col key={i} size={this.formatRow[i]}><Text style={styles.headerText}>{this.header[i]}</Text></Col>];
        }

        return jsx;
    };

    getRowJSX = (ix, player, playerStats) => {
        if (this.state.view == "batting" ) {
            //this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];

            return this._rowJSX( ix,
                player.name, 
                playerStats.batterStats.atBats,
                playerStats.batterStats.runs,
                PlayerStats.batterHits(playerStats),
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
            return this._rowJSX(ix, 
                player.name, 
                playerStats.pitcherStats.battersFaced,
                playerStats.pitcherStats.runsAgainst,
                playerStats.pitcherStats.hits,
                playerStats.pitcherStats.walks,
                playerStats.pitcherStats.strikeOuts,
                playerStats.pitcherStats.hitBatter,
                PlayerStats.pitches(playerStats),
                playerStats.pitcherStats.balls,
                playerStats.pitcherStats.strikes

            );
        } else {
            return this._rowJSX(ix, (ix+1), player.name, player.currentPosition);
        }
    }

    _updateView(pView) {

        this.setState({view: pView});
        this.setView(pView);
        this.updateOrder(pView);
    }

    //Override:
    getTitle() {
        return (<View />);
    }

    render() {

        //Create rows:
        var fullRows = this.order.map( (item,ix) => 
            <Row key={ix} style = {ix % 2 ? [styles.rowOdd, styles.rowText] : styles.rowText}>{this.makeRow(ix, item)}</Row>);
            
        return (
            <Grid>
                {this.getTitle()}
                <Row key={99} style={{height: 15}}>{this._makeHeader()}</Row>
                <Row style={{height: 1, backgroundColor: "black"}} />
                {fullRows}
                <Row style={{height: 50}} >
                    <Col >
                    <Button 
                        title="Batting" 
                        onPress={() => {this._updateView("batting")}}
                    />
                    </Col >
                    <Col >
                    <Button 
                        title="Pitching" 
                        onPress={() => {this._updateView("pitching")}}
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
        fontSize: 10,
        fontWeight: 'bold',
        borderColor: 'black',
        borderBottomWidth: 2
        
    }
});

