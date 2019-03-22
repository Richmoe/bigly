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

export default class Player {

    name;
    abbrev;
    number;
    battingOrder = 0;
    pitcherStats = new PitcherStats();
    batterStats = new BatterStats()
    positionByInning = new Array(5).fill(0);

    constructor(playername, battingOrder, position) {

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

    setPosition(pos) {
        this.positionByInning[0] = pos;
    }

    makeAbbrev = (name) => {
        names = name.split(" ");
        abbrev = "";
        for (const s of names) {
            abbrev += s[0];
        }
        return abbrev;
    }

}