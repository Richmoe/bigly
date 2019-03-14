export default class Game {

    homeTeam; //type Team
    awayTeam; //type Team
    //state:
    currentInning; //Current Inning will be 0 based, top of inning = even, bottom = odd
    innings = []; //array of Inning objects
    gameSettings; //param

    //stats:
    constructor(home, away, gameSettings) {
        this.homeTeam = home;
        this.awayTeam = away;
        this.gameSettings = gameSettings;
        this.currentInning = 0;
        this.innings.push(new Inning());
    }


    get myTeam() {
        if (this.gameSettings.isHome) {
            return this.homeTeam;
        } else {
            return this.awayTeam;
        }
    }

    get myTeamIsBatting() {
        if (this.battingTeam == this.myTeam) {
            return true;
        } else {
            return false;
        }
    }

    get inning() {
        return Math.floor(this.currentInning / 2) + 1;
    }

    get isTop() {
        return (this.currentInning % 2 == 0)
    }

    get battingTeam() {
        if (this.isTop) {
            return this.awayTeam;
        } else {
            return this.homeTeam;
        }
    }

    get fieldingTeam() {
        if (this.isTop) {
            return this.homeTeam;
        } else {
            return this.awayTeam;
        }
    }

    get isBatting() {
        return (this.battingTeam === this.myTeam)
    }

    get nextBatter() {
        currentBatter = this.battingTeam.nextBatter;
        return currentBatter;
    }

    newInning() {
        this.currentInning += 1;
        //check for end of game
        if (this.currentInning >= this.gameSettings.maxInnings) {
            //gameOver
        } else {
            //Add a new inning
            this.innings.push(new Inning());
        }
    }

    get score() {
        //Walk the innings array to add scores. Could use reduce but I like to see it spelled out.
        awayScore = 0;
        homeScore = 0;
        for (var i = 0; i < this.innings.length; i++) {
            if (i % 2 == 0) {
                awayScore += this.innings.runs;
            } else {
                homeScore += this.innings.runs;
            }
        }

        return awayScore, homeScore;
    }
}


export class Inning {
    outs = 0;
    currentBatter = 0;
    runs = 0;
    hits = 0;
    errors = 0;
    
}