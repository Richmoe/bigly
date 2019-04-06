import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
    TouchableOpacity,
    Modal,
    View,
    TouchableHighlight,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GameConst from "../constants/GameConst.js";
import Buttonish from "../components/Buttonish";
import * as Util from "../util/Misc";

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

        if (this.view == "batting") {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
        } else if (this.view == "pitching") {
            this.formatRow = [10,80,10];
            this.header = ["Pos", "Name", "PC"];
            this.order = this.team.fieldPositions;
        } else if (this.view == "fielding") {
            this.formatRow = [10,80,10];
            this.header = ["Pos", "Name", "#"];
            this.order = this.team.fieldPositions;
        } else if (this.view == "lineup") {
            this.formatRow = [25,50,25];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.team.roster;
        } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
        }

        this.state = { 
            modalVisible: false, 
            selectedOrder: -1,
            selectedUid: -1
        };
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

    selectedPlayer (ix) {
        console.log("SelectedPlayer: At OnPress for Pos " + ix + " which is player uid: " + this.order[ix]);
        this.modalView = 'nameToPos';
        this.setModalVisible(true);
        this.setState({selectedOrder: ix});
    }

    rowJSX = (ix, ...args) => {
        var jsx = [];
        //console.log("Making rowJSX for row " + ix + ", args " + args[0] + ", " + args[1] + "...");

        //assert args.length = formatRow.length
        for (var i = 0; i < this.formatRow.length;i++) {
            if (this.view == 'lineup') {
                // we have two clicks:
                if (i == 0) {
                    //Change batting order
                    jsx = [...jsx, 
                        <Col key={i} size={this.formatRow[i]}>
                            <Buttonish onPress = {()=>this.selectedOrder(ix)} 
                                title ={args[i]} 
                                titleStyle={styles.buttonRowText}
                            />
                        </Col>
                    ];
                } else if (i == 2) {
                    //Change fieldPos
                    jsx = [...jsx, 
                        <Col key={i} size={this.formatRow[i]}>
                            <Buttonish onPress={() => this.selectedPos(ix)} 
                                title={args[i]} 
                                titleStyle={styles.buttonRowText}
                            />
                        </Col>
                    ];
            
                } else {
                    jsx = [...jsx, 
                        <Col key={i} size={this.formatRow[i]}>
                            <Text style={styles.rowText}>{args[i]}</Text>
                        </Col>
                    ];
                }

            } else {
                if (this.callBack != null) {
                    jsx = [...jsx, 
                        <Col key={i} size={this.formatRow[i]}>
                            <TouchableOpacity onPress={() => this.selectedPlayer(ix)}>
                                <Text style={styles.rowText}>{args[i]}</Text>
                            </TouchableOpacity>
                        </Col>
                    ];
                } else {
                    jsx = [...jsx, 
                        <Col key={i} size={this.formatRow[i]}>
                            <Text style={styles.rowText}>{args[i]}</Text>
                        </Col>
                    ];            
                } 
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
        var player;
        if (this.view == "batting" ) {
            player = this.team.team.roster[val];
            return this.rowJSX(ix, (ix+1), player.name, GameConst.fieldPosAbbrev[player.currentPosition]);
        } else if (this.view == "pitching" ) {
            player = this.team.team.roster[val];
            //console.log(`makeRow: ${ix}, ${val}`);
            //console.log(player);
            //console.log(player.pitcherStats.pitches);
            return this.rowJSX(ix, GameConst.fieldPosAbbrev[player.currentPosition], player.name, player.pitcherStats.pitches);
        } else if (this.view == "fielding" ) {
            player = this.team.team.roster[val];
            return this.rowJSX(ix, GameConst.fieldPosAbbrev[player.currentPosition], player.name, (player.battingOrder + 1));
        } else if (this.view == "lineup") {
            player = this.team.team.roster[ix];
            return this.rowJSX(ix, (player.battingOrder) + 1, player.name, GameConst.fieldPosAbbrev[player.currentPosition]);
        } else {
            player = this.team.team.roster[val];
            return this.rowJSX(ix, (ix+1), player.name, player.currentPosition);
        }
    }

    setModalVisible(visible) {
        //Do logic here
        this.setState({modalVisible: visible});
    }


    fixUpRoster() {
        //walk the roster to create batting and fieldingPos arrays:
        //Reset lineups:
        var tempBattingOrder = new Array(this.team.team.roster.length).fill(-1);
        var tempFieldPositions = new Array(this.team.team.roster.length).fill(-1);

        for (var i = 0;i < this.team.team.roster.length;i++) {
            //Check to see if we should skip:
            var player = this.team.team.roster[i];
            //Add to lineup lists:
            console.log("Player: " + player.name + " batting: " + player.battingOrder + ", field: " + player.currentPosition);
            if (player.battingOrder == -1 || player.currentPosition == GameConst.FIELD_POS_OUT) {
                //skip
            } else {
                tempBattingOrder[player.battingOrder] = i;
                tempFieldPositions[player.currentPosition] = i;
            }
        }

        //Remove the -1s, giving us new batting order and position assignments. Basically slides everyone below the -1s up.
        var tempB2 = tempBattingOrder.filter(ix => ix >= 0);
        var tempF2 = tempFieldPositions.filter(ix => ix >= 0);

        //Reset all player positions:
        for (var i = 0;i < tempB2.length; i++) {
            this.team.team.roster[tempB2[i]].battingOrder = i;
            this.team.team.roster[tempF2[i]].currentPosition = i;
        }

        console.log("FixUp: B, F");
        console.log(tempB2);
        console.log("--");
        console.log(tempF2);
    }

    swapPlayerPosition(toPos) {
        var selectedPlayer = this.team.team.roster[this.state.selectedOrder];

        console.log("FieldPos: " + toPos);
        //cases:

        //Swap out
        if (toPos >= this.team.team.roster.length) { 
            //Swap Out
            selectedPlayer.battingOrder = -1;
        } else {
            if (selectedPlayer.currentPosition == GameConst.FIELD_POS_OUT) { 
                //Swap back in
                selectedPlayer.battingOrder = this.team.team.roster.length - 1; //put him back in last spot which should be empty
                swapToPos = this.team.team.maxFieldPlayers-1;
            } else {
                swapToPos = selectedPlayer.currentPosition;
            }
            //Swap with player if one was there:

            let swapWithPlayer = this.team.team.roster.find(o => o.currentPosition == toPos);
            if (swapWithPlayer) {
                swapWithPlayer.currentPosition = swapToPos;
            }
        }

        selectedPlayer.currentPosition = toPos;
        this.fixUpRoster();
    }

    swapBatterPosition(toPos) {
        var selectedPlayer = this.team.team.roster[this.state.selectedOrder];

        console.log("Batting Order: " + toPos);
        console.log(selectedPlayer);
        //Cases:
        if (toPos >= this.team.team.roster.length) { 
            // not playing 
            selectedPlayer.currentPosition = GameConst.FIELD_POS_OUT;
            selectedPlayer.battingOrder = -1;
        } else {
            if (selectedPlayer.battingOrder == -1) {
                //Back in
                selectedPlayer.currentPosition = this.team.team.maxFieldPlayers - 1; //put him back in bench spot which should be empty
                swapToPos = this.team.team.roster.length - 1;
            } else {
                swapToPos = selectedPlayer.battingOrder;
            }
            //Swap with player if one was there:
 
            let swapWithPlayer = this.team.team.roster.find(o => o.battingOrder == toPos);
            if (swapWithPlayer) {
                swapWithPlayer.battingOrder = swapToPos;
            }
            selectedPlayer.battingOrder = toPos;
        }
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

        } else /* if (this.modalView == 'nameToPos')*/ {

            this.swapPositionPlayer(modalIx); //modalIx is player UID.
            
        }

        if (this.callBack) this.callBack();

        this.setState({selectedOrder: -1});
    }

    swapPositionPlayer(playerUid) {

        console.log("swap Position Player " + playerUid);
        //Find where the modal selected value is in the order:
        this.team.setPlayerPos(playerUid, this.state.selectedOrder);
    }

    renderModal() {
        header = "Unknown";
        if (this.modalView == 'nameToBatting') {
            //Assign name to order
            if (this.state.selectedOrder > -1) {
                header = "Batter " + (this.state.selectedOrder + 1);
            }
            
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { Object.keys(this.team.team.roster).map((object, i) => {
                    let style = (i % 2 ? [styles.rowOdd, styles.rowText] : styles.rowText);
                    return (
                        <TouchableHighlight key={i} onPress = {() => this.selectedModal(i)}>
                            <Text style={style}>{object.name}</Text>
                        </TouchableHighlight> 
                    );
                })
                }
                </View>
            );
        } else if (this.modalView == "nameToPos") {
            //Assign name to pos:
            if (this.state.selectedOrder > -1) {
               
                header = GameConst.fieldPos[this.state.selectedOrder];
            }
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { Object.keys(this.team.team.roster).map((key, i) => {
                    let style = (i % 2 ? [styles.rowOdd, styles.rowText] : styles.rowText);

                    return (
                        <TouchableHighlight key={i} onPress = {() => this.selectedModal(key)}>
                            <Text style={style}>{this.team.team.roster[key].name}</Text>
                        </TouchableHighlight> 
                    );
                })
                }
                </View>
            );
        } else if (this.modalView == "posToName") {
            //Assign pos to Name:
            if (this.state.selectedOrder > -1) {
                header = this.team.team.roster[this.state.selectedOrder].name;
            }
            //
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { GameConst.fieldPos.map((object, i) => {
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
        } else if (this.modalView == "batToName") {
            //Assign pos to Name:
            if (this.state.selectedOrder > -1) {
                header = this.team.team.roster[this.state.selectedOrder].name;
            }
            //
            tempArray = [];
            for (var i = 0;i < this.team.team.rosterLength;i++){
                tempArray.push("Batting " + (i + 1));
            }
            tempArray.push("Not Playing");
            console.log(tempArray);
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { tempArray.map((object, i) => {
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
    }

    shuffleFielders () {
        
        var tempArray = this.order.slice(2);

        tempArray = Util.shuffleArray(tempArray);
        console.log("tempArray: ");
        console.log(tempArray);

        //this.order = tempArray.slice(0);
        for (var i = 0; i < tempArray.length;i++) {
            var selectedPlayer = this.team.team.roster[tempArray[i]];
            selectedPlayer.currentPosition = i + 2;
        }

        this.fixUpRoster();
        //this.forceUpdate();
        this.setState({selectedOrder: -1});
    }
        
    render() {

        //Create rows:
        var fullRows = this.order.map( (item,ix) => <Row key={ix}>{this.makeRow(ix, item)}</Row>);
            
        return (
            <Grid>
                
                <Row key={99}>{this.makeHeader()}</Row>
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
                {this.view == 'fielding' && 
                 <Row style={{height: 50}} >
                    <Buttonish  
                        title = "Shuffle"
                        onPress = {() => this.shuffleFielders()}
                    />
                 </Row>
                }
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
        borderColor: 'black',
        borderBottomWidth: 2
        
    }
});

