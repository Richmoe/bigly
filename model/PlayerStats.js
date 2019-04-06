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
}

export default class PlayerStats {

    constructor(uid) {
        this.uid = uid;
        this.pitcherStats = new PitcherStats();
        this.batterStats = new BatterStats();
    }
}
