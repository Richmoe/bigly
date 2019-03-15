import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
    TouchableOpacity
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';


export default class RosterScreen extends React.Component {

    team;
    callBack;
    formatRow;
    header;
    order;
    view;

    constructor(props){
        console.log("Construct RosterView");

        super(props);
        this.team = this.props.navigation.getParam("team",[]);
        this.callBack = this.props.navigation.getParam("callBack", null);
        this.view = this.props.navigation.getParam("view",null);

        console.log(`Roster team: ${this.team}`);
        if (this.view == "batting") {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
        } else if (this.view == "pitching") {
            this.formatRow = [10,70,20];
            this.header = ["Pos", "Name", "Pitches"];
            this.order = this.team.fieldPositions;
        } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
        }
    }

    selectedPlayer  (ix){
        console.log("At OnPress with " + ix + " which is player ix: " + this.order[ix]);
        if (this.callBack) {
            this.callBack(this.order[ix]);
            this.props.navigation.goBack();
        } else {
            console.log("No callback");
        }

    }

    rowJSX = (ix, ...args) => {
        var jsx = [];
        console.log("Making rowJSX for row " + ix + ", args " + args[0] + ", " + args[1] + "...");

        //assert args.length = formatRow.length
        for (var i = 0; i < this.formatRow.length;i++) {
            if (this.callBack != null) {
                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        <TouchableOpacity onPress={() => this.selectedPlayer(ix)}>
                            <Text style={styles.rowText}>{args[i]}</Text>
                        </TouchableOpacity>
                    </Col>];
            } else {
                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        <Text style={styles.rowText}>{args[i]}</Text>
                    </Col>];            
            } 
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
        player = this.team.roster[val];

        if (this.view == "batting") {
            return this.rowJSX(ix, (ix+1), player.name, player.currentPosition);
        } else if (this.view == "pitching") {
            return this.rowJSX(ix, player.currentPosition, player.name, player.pitcherStats.pitches);
        } else {
            return this.rowJSX(ix, (ix+1), player.name, player.currentPosition);
        }
    }

        
    render() {

        //Create rows:
        var fullRows = this.order.map( (item,ix) => <Row key={ix}>{this.makeRow(ix, item)}</Row>);
            
        return (
            <Grid>
                <Row key={99}>{this.makeHeader()}</Row>
                {fullRows}
            </Grid>
        );

        }
    }


    const styles = StyleSheet.create({
    rowText: {
        fontSize: 24,
        textAlign: 'left',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        borderColor: 'black',
        borderBottomWidth: 2
        
    }


});
