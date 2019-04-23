"use strict";

import * as Util from "../util/Misc";
import PlayerStats from "./PlayerStats";
import Team from "./Team";

export default class LineUp 
{
    // Member Variables:
    team; //type Team
    battingOrder = []; //array of batting order. Value = player UID.
    currentBatterIx = -1; //Start with -1 because we always call nextBatter;
    //TODO make this by inning.
    fieldPositions = []; //Array of field pos, 0 = pitcher. Value = player UID.
    playerStats = {}; //Object of player stats key = PlayerUID]
    positionByInning = []; //array of field positions, by inning.
    
    constructor(team) {
        this.team = team;

        //We need to create a starting order which is the whole team, in Roster order:
        this._createDefaultLineUp();

    }

    get myTeam() {
        return this.team.myTeam;
    }

    get teamName() {
        return this.team.name;
    }

    set teamName(name) {
        this.team.name = name;
    }

    get currentBatter() {
        return this.team.roster[this.battingOrder[this.currentBatterIx]];
    }

    get currentPitcher() {
        console.log("current pitcher uid: " + this.fieldPositions[0]);
        return this.team.roster[this.fieldPositions[0]];
    }

    set currentPitcher(ix) {
        this.team.roster[this.fieldPositions[0]] = ix;
    }

    getNextBatterIx() {

        this.currentBatterIx = (this.currentBatterIx + 1) % this.battingOrder.length;
        return this.currentBatterIx;
    }

    batterByOrder(pos) {
        //Safety check: wrap if beyond:
        pos = pos % this.battingOrder.length;

        return this.team.roster[this.battingOrder[pos]];
    }

    getPlayerByPos(pos) {
        return this.team.roster[this.fieldPositions[pos]];
    }

    setPlayerPos(playerUid, newPos) {

        console.log(`SetPlayerPos (${playerUid}, ${newPos}) - Uid is ${this.fieldPositions[playerUid]}`);
        console.log(this.fieldPositions);

        //Set the fieldPos at pos to be playerIx. move the player there to the pos where playerIx was.
        let playerOldPos = this.team.roster[playerUid].currentPosition;
        let swapPlayerUid = this.fieldPositions[newPos];
        if (swapPlayerUid != -1) {
            this.team.roster[swapPlayerUid].currentPosition = playerOldPos;
            this.fieldPositions[playerOldPos] = swapPlayerUid;
        }
        //Set my info here:
        this.fieldPositions[newPos] = playerUid;
        this.team.roster[playerUid].currentPosition = newPos;
        console.log("After:");
        console.log(this.fieldPositions);
    }

    saveFieldPositions(inning) {
        this.positionByInning[inning] = this.fieldPositions;
        Util.log("PositionsByInning : " + inning, this.positionByInning)
    }

    getPlayer(uid) {
        return this.team.roster[uid];
    }

    _createDefaultLineUp() {

        //reset arrays:
        this.battingOrder = [];
        this.fieldPositions = [];
        //walk the roster and assign position and order to IX

        //console.log("Create default lineup");
        //console.log(this.team.roster);
        var i = 0;
        for (let playerUid in this.team.roster) {

            let player = this.team.roster[playerUid];

            player.battingOrder = i;
            player.currentPosition = i;
            this.battingOrder.push(player.uid);
            this.fieldPositions.push(player.uid);
            ++i;

            this.playerStats[player.uid.toString()] = new PlayerStats(player.uid);
        }
    }

    _createRandomLineup() {
        //
        let tempBattingOrder = Util.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        let tempFieldingPos = Util.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        
        let i = 0;
        for (let pid in this.team.roster)  {
            player = this.team.roster[pid];
            player.battingOrder = tempBattingOrder[i];
            player.currentPosition = tempFieldingPos[i];
            ++i;
        }
    
        this.battingOrder = tempBattingOrder;
        this.fieldPositions = tempFieldingPos;

    }


    createSave() {
        //Team
        //batting order
        //Fielding pos
        //player stats
        //CurrentBatter - not needed unless we want to save mid-game

        //let teamJson = this.team.createSave();
        //From team we should take:
        //name
        //roster
        //Record snapshot?


        let json = {
            team: teamJson,
            battingOrder: this.battingOrder,
            fieldPositions: this.fieldPositions,
            playerStats: this.playerStats,
        };
        return json;
    }

    fromSave(json) {

        this.team = new Team();
        this.team.fromJSON(json.team);

        this.battingOrder = json.battingOrder;
        this.fieldPositions = json.fieldPositions;
        this.playerStats = json.playerStats;
    }
}