"use strict";

//Keeping TODOs here:
//Todo - randomize fielding order
//Todo - Fielder view
//Todo - stats view
//Todo - clean up UX for the hitterview
//Todo - check out alignment across iphone / android
//Todo - run experience
//Todo - Gamelog
//Todo - scoreboard view
//Todo - figure out right approach for bottom bar
//Todo - what about tracking hit but thrown out at a 2nd?

import PlayerStats from '../model/PlayerStats.js';
import GameConst from '../constants/GameConst';
import {uid} from '../util/Misc';
import LineUp from './LineUp.js';

export default class Game {

    homeLineUp; //type LineUp
    awayLineUp; //type LineUp
    //state:
    currentInning; //Current Inning will be 0 based, top of inning = even, bottom = odd
    innings = []; //array of Inning objects
    gameSettings; //param
    isMachinePitching;

    //stats:
    constructor(home, away, gameSettings, date) {
        this.homeLineUp = home;
        this.awayLineUp = away;
        this.gameSettings = gameSettings;
        this.currentInning = 0;
        this.innings.push(new Inning());
        this.isMachinePitching = gameSettings.allowMachinePitch;
        this.date = date;
        this.uid = uid();
    }


    get myTeam() {
        if (this.homeLineUp.myTeam == true) {
            return this.homeLineUp;
        } else {
            return this.awayLineUp;
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
            return this.awayLineUp;
        } else {
            return this.homeLineUp;
        }
    }

    get fieldingTeam() {
        if (this.isTop) {
            return this.homeLineUp;
        } else {
            return this.awayLineUp;
        }
    }

    get isBatting() {
        return (this.battingTeam === this.myTeam)
    }

    newInning() {
        this.currentInning += 1;
        //check for end of game
        if ((this.currentInning / 2) >= this.gameSettings.maxInnings) {
            //gameOver
            this.currentInning = GameConst.GAME_OVER;
        } else {
            //Add a new inning
            this.innings.push(new Inning());
        }
        return (this.currentInning)
    }

    addScore(scoreCount) {

        this.innings[this.currentInning].runs += scoreCount;
    }

    addHit(hitCount) {
        this.innings[this.currentInning].hits += hitCount;
    }

    get score() {
        //Walk the innings array to add scores. Could use reduce but I like to see it spelled out.
        var awayScore = 0;
        var homeScore = 0;
        for (var i = 0; i < this.innings.length; i++) {
            if (i % 2 == 0) {
                awayScore += this.innings[i].runs;
            } else {
                homeScore += this.innings[i].runs;
            }
        }

        return {away: awayScore, home: homeScore} ;
    }

    parseEvent (event) {

        console.log(`In ParseEvent for event ${event.type}, machinePitching: ${this.isMachinePitching}` );
        //console.log(this.fieldingTeam);
        //Shortcut:
        var batter = this.battingTeam.currentBatter;
        var batterStats = this.battingTeam.playerStats[batter.uid].batterStats;
        var pitcher = this.fieldingTeam.currentPitcher;
        console.log(pitcher);
        var pitcherStats = this.fieldingTeam.playerStats[pitcher.uid].pitcherStats;

        //Swallow events if machinepitch:
        if (this.isMachinePitching) {
            
            pitcherStats = new PlayerStats().pitcherStats;
        }

        console.log("currently at bat is: " + this.battingTeam.currentBatter.name);
        console.log("currently pitching is: " + this.fieldingTeam.currentPitcher.name);
        switch (event.type) {
            case 'atbat':
                ++pitcherStats.battersFaced;
                ++batterStats.atBats;
                break;
            case 'strike':
                //this.battingTeam.currentPitcher.
                ++pitcherStats.strikes;
                break;
            case 'foul':
                ++pitcherStats.strikes;
                break;
            case 'strikeout':
                ++pitcherStats.strikes;
                ++pitcherStats.strikeOuts;
                ++batterStats.strikeOuts;
                break;        
            case 'ball':
                ++pitcherStats.balls;
                break;        
            case 'walk':
                ++pitcherStats.balls;
                ++pitcherStats.walks;
                ++batterStats.walks;
                break;
            case 'hbp':
                ++pitcherStats.balls;
                ++pitcherStats.hitBatter;
                ++batterStats.hitBatter;
                //--batterStats.atBats; ???
                break;
            case 'single':
                ++pitcherStats.strikes;
                ++pitcherStats.hits;
                ++batterStats.singles;
                break;
            case 'double':
                ++pitcherStats.strikes;
                ++batterStats.doubles;
                break;        
            case 'triple':
                ++pitcherStats.strikes;
                ++batterStats.triples;
                break;        
            case 'homerun':
                ++pitcherStats.strikes;
                ++pitcherStats.runsAgainst;
                ++batterStats.homeRuns;
                ++batterStats.runs;
                ++batterStats.RBIs;
                break;
            case 'run':
                ++pitcherStats.runsAgainst;
                ++batterStats.RBIs;

                //Get the other runner here
                //TODO ++this.battingTeam.team.roster[event.other].batterStats.runs;
                break;
            case 'out':
                break;
            case 'error':
                break;
            case 'doubleplay':
                break;
            default:
                break;
        } 
    }


    createSave() {
        /*
        homeLineUp; //type LineUp
        awayLineUp; //type LineUp
        //state:
        currentInning - not needed; //Current Inning will be 0 based, top of inning = even, bottom = odd
        innings = []; //array of Inning objects
        gameSettings; //param
        isMachinePitching;
        */

        var homeLineUp = this.homeLineUp.createSave();
        var awayLineUp = this.awayLineUp.createSave();

        var json = {
            homeLineUp: homeLineUp,
            awayLineUp: awayLineUp,
            date: this.date,
            uid: this.uid,
        };
        return json;
    }

    fromSave(json) {

        this.homeLineUp = new LineUp();
        this.homeLineUp.fromJSON(json.homeLineUp);

        this.awayLineUp = new LineUp();
        this.awayLineUp.fromJSON(json.awayLineUp);

        this.date = json.date;
        this.uid = json.uid;
    }
}


export class Inning {
    currentBatter = 0;
    runs = 0;
    hits = 0;
    errors = 0;
    
}