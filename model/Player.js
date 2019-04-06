"use strict";
import * as Util from '../util/Misc';


export default class Player {

    uid;
    name;
    abbrev;
    number;
    battingOrder = 0;
    //pitcherStats = new PitcherStats();
    //batterStats = new BatterStats();
    positionByInning = new Array(5).fill(0);


    constructor(uid) {
        if (uid !== undefined) {
            this.uid = uid;
        } else {
            console.log("New player is being created");
            this.uid = Util.uid();
        }
    }

    setName(playerName) {
        this.name = playerName;
        this.abbrev = this.makeAbbrev(playerName);
    }

    setPlayer(playername, battingOrder, position) {

        //If they don't have a name, generate one
        if (playername == "") {
            this.name = "Player " + battingOrder;
            this.abbrev = "P" + battingOrder;
        } else {
            this.name = playername;
            this.abbrev = this.makeAbbrev(playername);
        }
        this.battingOrder = battingOrder;
        this.positionByInning[0] = position;
    }

    get currentPosition() {
        return this.positionByInning[0];
    }

    set currentPosition(pos) {
        this.positionByInning[0] = pos;
    }

    makeAbbrev = (name) => {
        var names = name.split(" ");
        var abbrev = "";
        for (const s of names) {
            abbrev += s[0];
        }
        return abbrev;
    }

}