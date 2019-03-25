import Player from '../model/Player.js';

export default class Team  {
    name = "Team Name";
    roster = []; //Array of Players
    myTeam = false;
    leagueName = "AA";
    leagueSettings;
    
    constructor(teamName, leagueSettings)
    {
        this.name = teamName;
        this.leagueSettings = leagueSettings;
    }

    _createDefaultRoster(names) {
   
        defaultRoster = [];

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
                name = "";
            }
            player = new Player(name, i, i);

            defaultRoster.push(player);
        }
        console.log("Created default roster for " + names);
        console.log(defaultRoster);

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


export class LineUp 
{

    team;
    battingOrder = []; //array of batting order. Value = index into roster.
    currentBatterIx = -1; //Start with -1 because we always call nextBatter;
    fieldPositions = []; //Array of field pos, 0 = pitcher. Value = index into roster.

    //Stats = wins, losses

    constructor(team) {
        this.team = team;
    }

    get teamName() {
        return this.team.name;
    }

    get currentBatter() {
        return this.team.roster[this.battingOrder[this.currentBatterIx]];
    }

    get currentPitcher() {
        return this.team.roster[this.fieldPositions[0]];
    }

    get nextBatter() {

        console.log(`Hmm. Batting order: ${this.battingOrder.length}`);
        this.currentBatterIx = (this.currentBatterIx + 1) % this.battingOrder.length;

        console.log("Team Get next batter ix " + this.currentBatterIx);

        return this.battingOrder[this.currentBatterIx];
    }

    batterByOrder(pos) {
        //Safety check: wrap if beyond:
        pos = pos % this.battingOrder.length;

        return this.team.roster[this.battingOrder[pos]];
    }

    playerByPos(pos) {
        return this.team.roster[this.fieldPositions[pos]];
    }

    getPlayer(ix) {
        //safety check:
        ix = ix % this.team.roster.length;

        return this.team.roster[ix];
    }

    _shuffleArray = (input) => {
        for (var i = input.length-1; i >=0; i--) {
         
          var randomIndex = Math.floor(Math.random()*(i+1)); 
          var itemAtIndex = input[randomIndex]; 
           
          input[randomIndex] = input[i]; 
          input[i] = itemAtIndex;
        }
        return input;
      };


    _createDefaultLineup() {
        tempBattingOrder = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        tempFieldingPos = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        
        for (var i = 0; i < this.team.roster.length;i++)
        {
            player = this.team.roster[i];
            console.log(player);
            player.battingOrder = tempBattingOrder.indexOf(i);
            player.currentPosition = tempFieldingPos.indexOf(i);

        }
    
        this.battingOrder = tempBattingOrder;
        this.fieldPositions = tempFieldingPos;

    }
    

}

