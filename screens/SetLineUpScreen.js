import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
    TouchableOpacity,
    Modal,
    View,
    TouchableHighlight,
    Button,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GameConst from "../constants/GameConst.js";
import Buttonish from "../components/Buttonish";
import * as Util from "../util/Misc";

export default class SetLineUpScreen extends React.Component {
    static navigationOptions = {
        title: 'Starting Line Up',
    };


    constructor(props){
        console.log("Construct LineUp");

        super(props);

        this.team = this.props.navigation.getParam("Lineup",[]);
        this.formatRow = [15,70,15];
        this.header = ["#", "Name", "Pos"];
        //this.order = this.team.team.roster;

        this.buildSortOrder();
        this.order = this.sortingOrderBO;

        console.log("ORDER: ");
        console.log(this.order);
        this.modalView = 'batToName';

        this.state = { 
            modalVisible: false, 
            selectedOrder: -1,
            selectedUid: -1
        };
    }

    buildSortOrder()
    {
        var r = this.team.team.roster;

        //Sort by name:
        this.sortingOrderName = Object.keys(r).sort(function(a,b) {
            var x = r[a].name.toLowerCase();
            var y = r[b].name.toLowerCase();
            return x < y ? -1 : x > y ?1 : 0;
        });

        //sort by BO:
        this.sortingOrderBO = Object.keys(r).sort(function(a,b) { return r[a].battingOrder - r[b].battingOrder });

        bo = this.sortingOrderBO;

        console.log("BO");
        console.log(bo);
        for (var i = 0;i < bo.length;i++) {
            console.log(r[bo[i]].name + ", " + r[bo[i]].battingOrder);
        }

        this.order = this.sortingOrderBO;

       console.log("ORDER: ");
       console.log(this.order);
    }

    selectedOrder  (ix){
        console.log("At OnPress with " + ix + " which is player ix: " + this.order[ix] );
        //this.modalView = 'nameToBatting';
        this.modalView = 'batToName';
        this.setModalVisible(true);
        this.setState({selectedOrder: ix});
    }

    selectedPos (ix) {
        console.log("SelectedPos: At OnPress for Pos " + ix + " which is player ix: " + this.order[ix]);
        this.modalView = 'posToName';
        this.setModalVisible(true);
        this.setState({selectedOrder: ix});
    }

    rowJSX = (ix, ...args) => {
        var jsx = [];
         //assert args.length = formatRow.length
        var isOut = false;;
        for (let i = 0; i < this.formatRow.length;i++) {
            
            // we have two clicks:
            if (i == 0) {
                //Change batting order
                //Batting #:
                var titleStyle = [styles.buttonRowText];
                let bo = args[i];
                if (args[i] == GameConst.DNP) {
                    bo = "DNP";
                    isOut = true;
                    titleStyle = [...titleStyle, {fontSize: 15}];
                } else {
                    bo = (bo + 1).toString()
                }

                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        <Buttonish onPress = {()=>this.selectedOrder(ix)} 
                            title ={bo} 
                            titleStyle={titleStyle}
                        />
                    </Col>
                ];
            } else if (i == 2) {
                //Change fieldPos
                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        {!isOut && 
                        <Buttonish onPress={() => this.selectedPos(ix)} 
                            title={args[i]} 
                            titleStyle={styles.buttonRowText}
                        />
                        }
                    </Col>
                ];
        
            } else {
                var textStyle = [styles.rowText];
                if (isOut) {
                    textStyle = [...textStyle, {color: 'red'}];
                }
                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        <Text style={textStyle}>{args[i]}</Text>
                    </Col>
                ];
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

    makeRow = (ix, k) => {
        var player = this.team.team.roster[k];
        return this.rowJSX(ix, (player.battingOrder), player.name, GameConst.fieldPosAbbrev[player.currentPosition]);

    }

    setModalVisible(visible) {
        //Do logic here
        this.setState({modalVisible: visible});
    }


    fixUpRoster() {
        //walk the roster to create batting and fieldingPos arrays:
        //Reset lineups:
        var tempBattingOrder = new Array(this.team.team.rosterLength).fill(-1);
        var tempFieldPositions = new Array(this.team.team.rosterLength).fill(-1);

        console.log("____FIXUP____");
        console.log(this.team.team.roster);

        var r = this.team.team.roster;
        for (let pid in r) {
        //var i = 0;i < this.team.team.rosterLength;i++) {
            //Check to see if we should skip:
            //Add to lineup lists:
            console.log("Player: " + r[pid].name + " batting: " + r[pid].battingOrder + ", field: " + r[pid].currentPosition);
            if (r[pid].battingOrder == GameConst.DNP || r[pid].currentPosition == GameConst.DNP) {
                //skip
            } else {
                tempBattingOrder[r[pid].battingOrder] = pid;
                tempFieldPositions[r[pid].currentPosition] = pid;
            }
        }

        console.log(tempBattingOrder);

        //Remove the -1s, giving us new batting order and position assignments. Basically slides everyone below the -1s up.
        var tempB2 = tempBattingOrder.filter(ix => ix != -1);
        var tempF2 = tempFieldPositions.filter(ix => ix != -1);


        //Reset all player positions:
        for (var i = 0;i < tempB2.length; i++) {
            r[tempB2[i]].battingOrder = i;
            r[tempF2[i]].currentPosition = i;
        }

        console.log("FixUp: B, F");
        console.log(tempB2);
        console.log("--");
        console.log(tempF2);

        this.buildSortOrder();
    }

    swapPlayerPosition(toPos) {
        var selectedPlayer = this.team.team.roster[this.order[this.state.selectedOrder]];

        console.log("FieldPos: " + toPos);
        //cases:

        //Swap out
        if (toPos >= this.team.team.rosterLength) { 
            //Swap Out
            selectedPlayer.battingOrder = GameConst.DNP;
        } else {
            if (selectedPlayer.currentPosition == GameConst.FIELD_POS_OUT) { 
                //Swap back in
                selectedPlayer.battingOrder = this.team.team.rosterLength - 1; //put him back in last spot which should be empty
                swapToPos = this.team.team.maxFieldPlayers-1;
            } else {
                swapToPos = selectedPlayer.currentPosition;
            }
            //Swap with player if one was there:
            //Swap with player if one was there:
            var swapWithPlayer;
            for (let pid in this.team.team.roster) {
                if (this.team.team.roster[pid].currentPosition == toPos) {
                    swapWithPlayer = this.team.team.roster[pid];
                    break;
                }
            }
            if (swapWithPlayer) {
                swapWithPlayer.currentPosition = swapToPos;
            }
        }

        selectedPlayer.currentPosition = toPos;
        this.fixUpRoster();
    }

    swapBatterPosition(toPos) {
        var selectedPlayer = this.team.team.roster[this.order[this.state.selectedOrder]];

        console.log("Batting Order: " + toPos);
        console.log(selectedPlayer);
        //Cases:
        if (toPos >= this.team.team.rosterLength) { 
            // not playing 
            selectedPlayer.currentPosition = GameConst.FIELD_POS_OUT;
            selectedPlayer.battingOrder = GameConst.DNP;
        } else {
            if (selectedPlayer.battingOrder == GameConst.DNP) {
                //Back in
                selectedPlayer.currentPosition = this.team.team.maxFieldPlayers - 1; //put him back in bench spot which should be empty
                swapToPos = this.team.team.rosterLength - 1;
            } else {
                swapToPos = selectedPlayer.battingOrder;
            }
            //Swap with player if one was there:
            var swapWithPlayer;
            for (let pid in this.team.team.roster) {
                if (this.team.team.roster[pid].battingOrder == toPos) {
                    swapWithPlayer = this.team.team.roster[pid];
                    break;
                }
            }
            if (swapWithPlayer) {
                console.log("Swapping player:");
                console.log(swapWithPlayer);
                swapWithPlayer.battingOrder = swapToPos;
            }
            selectedPlayer.battingOrder = toPos;
        }

        console.log("Okay, we got past the swap");
        this.fixUpRoster();
    }

    selectedModal(modalIx) {

        this.setModalVisible(false);

        console.log(`'SelectedModal: view = ${this.modalView}`);
        //Here is where we swap
        if (this.modalView == 'posToName') {

            this.swapPlayerPosition(modalIx);

        } else if (this.modalView == 'batToName') {
            this.swapBatterPosition(modalIx);
        }

        this.setState({selectedOrder: -1});
    }

    renderModal() {
        var header = "Unknown";
        var modalArray;

        if (this.state.selectedOrder > -1) {
            header = this.team.team.roster[this.order[this.state.selectedOrder]].name;
        }
        if (this.modalView == "posToName") {
            //Assign pos to Name:
            modalArray = GameConst.fieldPos;
        } else if (this.modalView == "batToName") {



            modalArray = [];

            for (let i = 0;i < this.team.team.rosterLength;i++){
                modalArray.push("Batting " + (i + 1));
            }
            modalArray.push("Not Playing");
        }

        return (
            <View>
            <Text key={99} style={styles.headerText}>{header}</Text>
            { modalArray.map((object, i) => {
                let style = (i % 2 ? [styles.rowOdd, styles.rowText] : styles.rowText);
                return (
                    <TouchableHighlight key={i} onPress = {() => this.selectedModal(i)}>
                        <Text style={style}>{object}</Text>
                    </TouchableHighlight> 
                );
            })
            }
            </View>
        );
    }

       
    render() {

        //Create rows:
        var fullRows = this.order.map( (k,ix) => {
            let style = (ix % 2 ? styles.rowOdd : styles.rowEven);
            return (<Row key={ix} style={style}>{this.makeRow(ix, k)}</Row>)
        });

        //NOTE: iOS doesn't support bottom width. Easiest way with Easy Grid is to just make a one-pixel row.
        return (
            <Grid>
                
                <Row key={99} style={{height: 30}}>{this.makeHeader()}</Row>
                <Row style = {{height: 1, backgroundColor: 'black'}}></Row>

                {fullRows}


                <Modal animationType = "fade" transparent = {true}
                    visible = {this.state.modalVisible}
                    onRequestClose = {() => { console.log("Modal has been closed.") } }>
               
                    <View style = {styles.modalContainer}>
                        <View style={{backgroundColor: '#fff', padding: 20}}>
                            {this.renderModal()}
                        </View>
                    </View>
                 </Modal>
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
        fontSize: 22,
        textAlign: 'left',
        margin: 5,
    },
    buttonRowText: {
        fontSize: 22,
        textAlign: 'left',
    },
    rowOdd: {
        backgroundColor: '#ddd',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
    }
});

