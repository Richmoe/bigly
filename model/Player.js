class PitcherStats {
    balls = 0;
    strikes = 0;
    hits = 0;
    runsAgains = 0;
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
        //what should I do here?
        this.name = playername;
        this.battingOrder = battingOrder;
        this.positionByInning[0] = position;
        this.abbrev = this.makeAbbrev(playername);
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