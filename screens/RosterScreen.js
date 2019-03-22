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
            this.formatRow = [10,80,10];
            this.header = ["Pos", "Name", "PC"];
            this.order = this.team.fieldPositions;
        } else {
            this.formatRow = [10,80,10];
            this.header = ["#", "Name", "Pos"];
            this.order = this.team.battingOrder;
        }

        this.state = { modalVisible: false, selectedOrder: -1 };
    }

    selectedOrder  (ix){
        console.log("At OnPress with " + ix + " which is player ix: " + this.order[ix]);
        this.setModalVisible(true);
        this.setState({selectedOrder: ix});
    }

    rowJSX = (ix, ...args) => {
        var jsx = [];
        //console.log("Making rowJSX for row " + ix + ", args " + args[0] + ", " + args[1] + "...");

        //assert args.length = formatRow.length
        for (var i = 0; i < this.formatRow.length;i++) {
            if (this.callBack != null) {
                jsx = [...jsx, 
                    <Col key={i} size={this.formatRow[i]}>
                        <TouchableOpacity onPress={() => this.selectedOrder(ix)}>
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
            return this.rowJSX(ix, (ix+1), player.name, GameConst.fieldPosAbbrev[player.currentPosition]);
        } else if (this.view == "pitching") {
            return this.rowJSX(ix, GameConst.fieldPosAbbrev[player.currentPosition], player.name, player.pitcherStats.pitches);
        } else {
            return this.rowJSX(ix, (ix+1), player.name, player.currentPosition);
        }
    }

    setModalVisible(visible) {
        //Do logic here
        this.setState({modalVisible: visible});
    }

    selectedModal(modalIx) {

        this.setModalVisible(false);

        //Here is where we swap
        let originalValueAtSelectedOrder = this.order[this.state.selectedOrder];

        //Find where the modal selected value is in the order:
        var orderOfModalIx = this.order.indexOf(modalIx);

        if (this.view == 'pitching') {
            oldPlayer = this.team.roster[originalValueAtSelectedOrder];
            newPlayer = this.team.roster[modalIx];
            oldPlayer.setPosition(newPlayer.currentPosition);
            newPlayer.setPosition(this.state.selectedOrder);
        }

        //Selected order slot is now the selected modal value
        this.order[this.state.selectedOrder] = modalIx;

        //Where the selected modeal was now gets the original Value
        this.order[orderOfModalIx] = originalValueAtSelectedOrder;

        this.setState({selectedOrder: -1});
    }

    renderModal() {
        header = "Unknown";
        if (this.view == 'batting') {
            if (this.state.selectedOrder > -1) {
                header = "Batter " + (this.state.selectedOrder + 1);
            }
            
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { this.team.roster.map((object, i) => {
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
        } else if (this.view == "pitching") {
            if (this.state.selectedOrder > -1) {
               
                header = GameConst.fieldPos[this.state.selectedOrder];
            }
            return (
                <View>
                <Text key={99} style={styles.headerText}>{header}</Text>
                { this.team.roster.map((object, i) => {
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
        } else {
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
        }
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
        fontSize: 24,
        textAlign: 'left',
        margin: 5,
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

