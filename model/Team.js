import Player from '../model/Player.js';

export default class Team
{
    name = "Team Name";
    roster = []; //Array of Players
    battingOrder = []; //array of batting order. Value = index into roster.
    currentBatterIx = -1; //Start with -1 because we always call nextBatter;
    fieldPositions = []; //Array of field pos, 0 = pitcher. Value = index into roster.
    myTeam = false;
    //Stats = wins, losses

    constructor(teamName) {
        this.name = teamName;
    }

    get nextBatter() {

        console.log(`Hmm. Batting order: ${this.battingOrder.length}`);
        this.currentBatterIx = (this.currentBatterIx + 1) % this.battingOrder.length;

        console.log("Team Get next batter ix " + this.currentBatterIx);

        return this.battingOrder[this.currentBatterIx];
    }

    playerByPos(pos) {
        return this.roster[this.fieldPositions[pos]];
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


    _createDefaultRoster(names) {
        tempBattingOrder = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        tempFieldingPos = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        
        defaultRoster = [];
    
        for (var i = 0; i < tempBattingOrder.length;i++)
        {
            if (names) {
                name = names[i];
            } else {
                name = "";
            }
            player = new Player(name, tempBattingOrder.indexOf(i), tempFieldingPos.indexOf(i));

            defaultRoster.push(player);
        }
    
        this.battingOrder = tempBattingOrder;
        this.fieldPositions = tempFieldingPos;
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
