import Player from "./Player";
import * as Util from "../util/Misc";
import PlayerStats from "./PlayerStats";
import Team from "./Team";

export default class LineUp 
{
    //gameRoster = [];
    //team type Team
    battingOrder = []; //array of batting order. Value = index into roster.
    currentBatterIx = -1; //Start with -1 because we always call nextBatter;
    //TODO make this by inning.
    fieldPositions = []; //Array of field pos, 0 = pitcher. Value = index into roster.
    playerStats = []; //Array of player stats [PlayerUID]
    //Stats = wins, losses

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

    get nextBatterIx() {

        console.log(`Hmm. Batting order: ${this.battingOrder.length}`);
        this.currentBatterIx = (this.currentBatterIx + 1) % this.battingOrder.length;

        console.log("Team Get next batter ix " + this.currentBatterIx);

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
        playerOldPos = this.team.roster[playerUid].currentPosition;
        swapPlayerUid = this.fieldPositions[newPos];
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

    getPlayer(uid) {
        return this.team.roster[uid];
    }

    _createDefaultLineUp() {

        //reset arrays:
        this.battingOrder = [];
        this.fieldPositions = [];
        //walk the roster and assign position and order to IX

        console.log("Create default lineup");
        var i = 0;
        for (var playerUid in this.team.roster) {

            player = this.team.roster[playerUid];

            player.battingOrder = i;
            player.currentPosition = i;
            this.battingOrder.push(player.uid);
            this.fieldPositions.push(player.uid);
            ++i;

            this.playerStats[player.uid] = new PlayerStats(player.uid);
        }
    }

    _createRandomLineup() {
        //
        tempBattingOrder = Util.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        tempFieldingPos = Util.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        
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

        var teamJson = this.team.createSave();

        var json = {
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