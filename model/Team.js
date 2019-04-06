import Player from '../model/Player.js';

export default class Team  {
    name = "Team Name";
    roster = []; //Array of Players
    myTeam = false;
    //leagueName = "AA";
    maxInnings = 6;
    maxFieldPlayers = 11;
    maxRunsPerInning = 5;
    machinePitch = true;
    playerGameStats = []; //array of player game stats which can be summed for lifetime. [game][PlayerUID]

    
    constructor(teamName)
    {
        this.name = teamName;
    }

    get rosterLength() {
        return Object.keys(this.roster).length;
    }


    fromJSON(json) {
        this.name = json.name;
        this.maxInnings = json.maxInnings;
        this.maxFieldPlayers = json.maxFieldPlayers;
        this.maxRunsPerInning = json.maxRunsPerInning;
        this.machinePitch = json.machinePitch;
        this.roster = [];
        for (let i = 0;i < json.teamRoster.length;i++) {
            var p = new Player(json.teamRoster[i].name,0,0);
            p.uid = json.teamRoster[i].uid;
            p.number = json.teamRoster[i].number; 
            this.roster.push(p);
        }
        this.playerGameStats = json.playerGameStats;
    }

    createSave() {
        //simplify roster:
        var basicRoster = [];
        for (let i = 0;i<this.roster.length;i++) {
            basicRoster.push( {name: this.roster[i].name, uid: this.roster[i].uid, number: this.roster[i].number});
        }
        var json = {
            name: this.name,
            maxInnings: this.maxInnings,
            maxFieldPlayers: this.maxFieldPlayers,
            maxRunsPerInning: this.maxRunsPerInning,
            machinePitch: this.machinePitch,
            teamRoster: basicRoster,
            playerGameStats: this.playerGameStats,
        };
        return json;
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
