import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 

} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GameConst from "../constants/GameConst.js";
import Buttonish from "../components/Buttonish";


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


export default class StatsScreen extends React.Component {

    team;
    callBack;
    formatRow;
    header;
    order;

    constructor(props){
        console.log("Construct StatsScreen");

        super(props);

        this.team = this.props.navigation.getParam("team",[]);

        this.state = { modalVisible: false, selectedOrder: -1, view: "batting" };
        this.setView("batting");
    }


    setView (view) {

     
        if (view == "batting") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1,1];
            this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];
            this.order = this.team.battingOrder;
        } else if (view == "pitching") {
            this.formatRow = [5,1,1,1,1,1,1,1,1,1];;
            this.header = ["Name", "BF", "R", "H", "BB", "SO", "HB", "PT", "B", "S"];
            this.order = this.team.fieldPositions;
        } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
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
        var player = this.team.team.roster[val];
        if (this.state.view == "batting" ) {
            //this.header = ["Name", "AB", "R", "H", "RBI", "2B","3B","HR","BB","SO","HBP"];

            return this.rowJSX( ix,
                player.name, 
                player.batterStats.atBats,
                player.batterStats.runs,
                player.batterStats.hits,
                player.batterStats.RBIs,
                player.batterStats.doubles,
                player.batterStats.triples,
                player.batterStats.homeRuns,
                player.batterStats.walks,
                player.batterStats.strikeOuts,
                player.batterStats.hitBatter
            );
        } else if (this.state.view == "pitching" ) {
            //this.header = ["Name", "BF", "R", "H", "BB", "SO", "HB", "PT", "B", "S"];
            return this.rowJSX(ix, 
                player.name, 
                player.pitcherStats.battersFaced,
                player.pitcherStats.runsAgainst,
                player.pitcherStats.hits,
                player.pitcherStats.walks,
                player.pitcherStats.strikeOuts,
                player.pitcherStats.hitBatter,
                player.pitcherStats.pitches,
                player.pitcherStats.balls,
                player.pitcherStats.strikes

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
                    <Col style = {{backgroundColor: "red"}}>
                    <Buttonish 
                        title="Batting" 
                        onPress={() => {this.updateView("batting")}}
                    />
                    </Col >
                    <Col style = {{backgroundColor: "green"}}>
                    <Buttonish 
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

