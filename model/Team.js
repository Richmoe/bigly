"use strict";

import Player from '../model/Player.js';
import * as Util from "../util/Misc";
import * as Save from '../util/SaveLoad';

export default class Team  {
    uid;
    name = "Team Name";
    roster; //Object of Players
    myTeam = false;
    //leagueName = "AA";
    maxInnings = 6;
    maxFieldPlayers = 11;
    maxRunsPerInning = 5;
    machinePitch = true;
    gamesPlayed = [];   //array of games played where game = {UID, Date, Opponent, isHome, myScore, oppScore}
    playerGameStats = {}; //object of player game stats which can be summed for lifetime. [gameUid][PlayerUID]
    recordWins = 0;
    recordTies = 0;
    recordLosses = 0;
    
    constructor(teamName, uid)
    {
        //console.log(`Team Constructor: ${teamName}, ${uid}`);
        this.name = teamName;
        if (uid !== undefined) {
            this.uid = uid;
        } else {
            this.uid = Util.uid();
        }
        this.playerGameStats = {};
        //Util.log(this.playerGameStats);

    }

    get rosterLength() {
        return Object.keys(this.roster).length;
    }

    addGame(gameObject) {
        //pull out the right info here:
        //{UID, Date, Opponent, isHome, myScore, oppScore}

        let gp = {
            uid: gameObject.uid,
            date: gameObject.date,
            opponent: gameObject.oppTeam.teamName,
            isHome: gameObject.isHome,
            myScore: gameObject.myScore,
            oppScore: gameObject.oppScore,
        }
        this.gamesPlayed.push(gp);

        Util.log("Games Played added, now:", this.gamesPlayed);

        //debugger;
        //Update player stats
        this.playerGameStats[gp.uid.toString()] = gameObject.myTeam.playerStats;
 
        //Update record:
        if (gp.myScore > gp.oppScore) {
            this.recordWins += 1;
        } else if (gp.myScore < gp.oppScore) {
            this.recordLosses += 1;
        } else {
            this.recordTies += 1;
        }
        //Util.log("player game stats: ", this.playerGameStats);
        //Update Win/loss/tie
        //NVM - we should walk GP to get this
    }

    __debugGamesPlayed() {
        Util.log("Debugging Games Played (len: " + this.gamesPlayed.length);
        for (let g in this.gamesPlayed) {
            Util.log(`Game #${g}`, this.gamesPlayed[g]);
        }
    }

    __debugSeasonStats() {
        Util.log("Debugging Season Stats: " + Object.keys(this.playerGameStats).length);
        for (let g in this.playerGameStats) {
            Util.log(`Game #${g}`, this.playerGameStats[g]);
        }
    }

    fromJSON(json) {
        //TODO need better error handling in case data is incomplete.
        this.uid = json.uid;
        this.name = json.name;
        this.maxInnings = json.maxInnings;
        this.maxFieldPlayers = json.maxFieldPlayers;
        this.maxRunsPerInning = json.maxRunsPerInning;
        this.machinePitch = json.machinePitch;
        this.playerGameStats = json.playerGameStats;
        this.gamesPlayed = json.gamesPlayed;
        this.recordWins = json.recordWins;
        this.recordLosses = json.recordLosses;
        this.recordTies = json.recordTies;

        //rebuild roster array of Players:
        let r = json.roster;
        this.roster = {};
        for (let pid in r) {
            //console.log(`${r[pid].name} , ${r[pid].currentPosition}`);
            let p = new Player(r[pid].uid);
            p.setPlayer(r[pid].name, r[pid].battingOrder, r[pid].currentPosition);
            this.roster[pid] = p;
            //console.log(p);
        }
        Util.log("fromJSON:", this);
    }

    createSave() {
        let json = {
            uid: this.uid,
            name: this.name,
            maxInnings: this.maxInnings,
            maxFieldPlayers: this.maxFieldPlayers,
            maxRunsPerInning: this.maxRunsPerInning,
            machinePitch: this.machinePitch,
            playerGameStats: this.playerGameStats,
            gamesPlayed: this.gamesPlayed,
            roster: this.roster, //We'll lose some functions, but recreate on load,
            recordWins: this.recordWins,
            recordLosses: this.recordLosses,
            recordTies: this.recordTies,
        };
        return json;  
    }

    async _save() {
        let json = this.createSave();

        console.log(`Saving Team: Team-${this.uid}`);

        Save.saveData(`Team-${this.uid}`,json);
    }
    

    _createDefaultRoster(names) {
   
        let defaultRoster = {};

        let playerCount = 11; //default
        if (names) playerCount = names.length;
    
        for (var i = 0; i < playerCount;i++)
        {
            let name;
            if (names) {
                name = names[i];
            } else {
                name = "Player " + (i+1);
            }
            let player = new Player();
            player.setName(name);
            //console.log(`Created player ${name}, UID is ${player.uid}`);

            //defaultRoster.push(player);
            defaultRoster[player.uid] = player;
            //console.log(defaultRoster);
        }
        this.roster = defaultRoster;
    }

    _createDefaultMyRoster () {
        this._createDefaultRoster(
            [
                "Alex Merryman",
                "Ashton Merryman",
                "Bowie Thorner Moe",
                "Calvin Polivka",
                "Felix Hester",
                "Gunner O'Neill",
                "Hayden Hilpert",
                "Hunter Rose",
                "Leon Sievers",
                "Sherif El-Shimi",
                "Trent Sislow",
            ]
        );
    }
}
