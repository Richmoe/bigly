import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GameConst from "../constants/GameConst.js";
import Buttonish from "../components/Buttonish";
import PlayerStats from "../model/PlayerStats";
import BaseStatsScreen from './BaseStatsScreen';
import * as Util from "../util/Misc";

export default class StatsScreen extends BaseStatsScreen {

    lineUp;

    constructor(props){
        console.log("Construct StatsScreen");

        super(props);

        this.lineUp = this.props.navigation.getParam("team",[]);
        this.state = { view: "batting" };
        this.order = this.lineUp.battingOrder;
        //this.setView("batting");
    }


    updateOrder(pView) {
        if (pView == "batting") {
            this.order = this.lineUp.battingOrder;
        } else if (pView == "pitching") {
            this.order = this.lineUp.fieldPositions;
        } else {
            this.order = this.lineUp.battingOrder;
        }
    }

    makeRow = (ix, val) => {

        var player = this.lineUp.team.roster[val];
        var playerStats = this.lineUp.playerStats[player.uid];
        return this.getRowJSX(ix, player, playerStats);
    }
}  
 
