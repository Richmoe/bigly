"use strict";

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

}

export default class PlayerStats {

    static batterHits(stats) {
        return (stats.batterStats.singles + stats.batterStats.doubles + stats.batterStats.triples + stats.batterStats.homeRuns);
    }

    static pitches(stats) {   
        return (stats.pitcherStats.balls + stats.pitcherStats.strikes);
    }


    constructor(uid) {
        this.uid = uid;
        this.pitcherStats = new PitcherStats();
        this.batterStats = new BatterStats();
    }

    sumStats(stats) {

        //Test:
        //this.pitcherStats.balls += stats.pitcherStats.balls;
        /*
        console.log("summing stats:");
        console.log(stats);
        console.log("to:");
        console.log(this);
        */
        for (let key in stats.pitcherStats) {
            this.pitcherStats[key] += stats.pitcherStats[key];
        }
        for (let key in stats.batterStats) {
            this.batterStats[key] += stats.batterStats[key];
        }
        //console.log(this);

    }
}
