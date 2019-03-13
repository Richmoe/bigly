import { Player } from './Player.js';

export default class Team
{
    name = "Team Name";
    roster = []; //Array of Players
    battingOrder = []; //
    currentBatterIx = -1; //Start with -1 because we always call nextBatter;
    fieldPositions = [];
    //Stats = wins, losses

    constructor(teamName) {
        this.name = teamName;
    }

    get nextBatter() {
        this.currentBatterIx = (this.currentBatterIx + 1) % this.battingOrder.length;
        return this.battingOrder(this.currentBatterIx);
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
        tempBattingOrder = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]);
        tempFieldingPos = this._shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]);
        console.log(tempBattingOrder);
        console.log(tempFieldingPos);
        
        defaultRoster = [];
    
        for (var i = 0; i < tempBattingOrder.length;i++)
        {
            if (names) {
                name = names[i];
            } else {
                name = "Player " + tempBattingOrder[i];
            }
            defaultRoster.push(new Player(name,tempBattingOrder[i],tempFieldingPos[i]));
        }
    
        return defaultRoster;
    }
    
    _createDefaultMyRoster () {
        return this.createDefaultRoster(
            [
                "Alex Merryman",
                "Ashton Merryman",
                "Bowie Thorner Moe",
                "Calvin Polivka",
                "Felix Hester",
                "Gunner O'Neill",
                "Hayden Hilpert",
                "Hunter Rose",
                "June Pierce",
                "Leon Sievers",
                "Sherif El-Shimi",
                "Trent Sislow",
            ]
        );
    }
    

}







export default 
