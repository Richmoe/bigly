import Player from '../model/Player.js';

export default class Team  {
    name = "Team Name";
    roster = []; //Array of Players
    myTeam = false;
    //leagueName = "AA";
    maxInnings = 5;
    maxFieldPlayers = 11;
    maxRunsPerInning = 5;
    machinePitch = true;

    
    constructor(teamName)
    {
        this.name = teamName;
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

        //We need to create a starting order which is the whole team, in Roster order:
        this._createDefaultLineUp();
    }

    get myTeam() {
        return this.team.myTeam;
    }

    get teamName() {
        return this.team.name;
    }

    set teamName(name) {
        this.team.name = name;
    }

    get currentBatter() {
        return this.team.roster[this.battingOrder[this.currentBatterIx]];
    }

    get currentPitcher() {
        return this.team.roster[this.fieldPositions[0]];
    }

    set currentPitcher(ix) {
        this.team.roster[this.fieldPositions[0]] = ix;
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

    getPlayerByPos(pos) {
        return this.team.roster[this.fieldPositions[pos]];
    }

    setPlayerPos(playerIx, newPos) {

        console.log(`SetPlayerPos (${playerIx}, ${newPos})`);
        console.log(this.fieldPositions);

        //Set the fieldPos at pos to be playerIx. move the player there to the pos where playerIx was.
        playerOldPos = this.team.roster[playerIx].currentPosition;
        swapPlayerIx = this.fieldPositions[newPos];
        if (swapPlayerIx != -1) {
            this.team.roster[swapPlayerIx].currentPosition = playerOldPos;
            this.fieldPositions[playerOldPos] = swapPlayerIx;
        }
        //Set my info here:
        this.fieldPositions[newPos] = playerIx;
        this.team.roster[playerIx].currentPosition = newPos;
        console.log("After:");
        console.log(this.fieldPositions);
    }

    getPlayer(ix) {
        //safety check:
        ix = ix % this.team.roster.length;

        return this.team.roster[ix];
    }

    _createDefaultLineUp() {

        //reset arrays:
        this.battingOrder = [];
        this.fieldPositions = [];
        //walk the roster and assign position and order to IX
        for (var i = 0; i < this.team.roster.length; i++)
        {
            player = this.team.roster[i];

            player.battingOrder = i;
            player.currentPosition = i;
            console.log(player);
            this.battingOrder.push(i);
            this.fieldPositions.push(i);
        }

        console.log(this.battingOrder);
        console.log(this.fieldPositions);
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


    _createRandomLineup() {
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

