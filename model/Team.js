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
    playerGameStats = []; //array of player game stats which can be summed for lifetime. [game][PlayerUID]

    
    constructor(teamName, uid)
    {
        console.log(`Team Constructor: ${teamName}, ${uid}`);
        this.name = teamName;
        if (uid !== undefined) {
            this.uid = uid;
        } else {
            this.uid = Util.uid();
        }
    }

    get rosterLength() {
        return Object.keys(this.roster).length;
    }


    fromJSON(json) {
        this.uid = json.uid;
        this.name = json.name;
        this.maxInnings = json.maxInnings;
        this.maxFieldPlayers = json.maxFieldPlayers;
        this.maxRunsPerInning = json.maxRunsPerInning;
        this.machinePitch = json.machinePitch;
        this.playerGameStats = json.playerGameStats;

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


    }

    createSave() {

        var json = {
            uid: this.uid,
            name: this.name,
            maxInnings: this.maxInnings,
            maxFieldPlayers: this.maxFieldPlayers,
            maxRunsPerInning: this.maxRunsPerInning,
            machinePitch: this.machinePitch,
            roster: this.roster, //We'll lose some functions, but recreate on load,
            playerGameStats: this.playerGameStats,
        };
        return json;
    }

    async _saveTeam() {
        let json = this.createSave(); //todo collapse this

        Save.saveData(`Team-${this.uid}`,json);
    }
    

    _createDefaultRoster(names) {
   
        var defaultRoster = {};

        if (names) {
            playerCount = names.length;
        } else {
            //default to 11
            playerCount = 11;
        }
    
        for (var i = 0; i < playerCount;i++)
        {
            if (names) {
                name = names[i];
            } else {
                name = "Player " + (i+1);
            }
            player = new Player();
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
