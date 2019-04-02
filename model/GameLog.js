gIndex = 0;


export default class GameLog {

    index; //UID for the log, sequential
    inning;
    inningTop;
    batter;
    pitcher;
    outs;
    bases; //[_123]
    score; 
    play; //Example: B Thorner Moe struck out.

    //play example:

}

export default class Event {

    index; //Complete UID
    playId; //Inning + batter + curScore + curOuts? or do I just pass one in?
    eventType;
    pitcher;
    batter;
    other;
    gameState; 

    constructor (eventType, pitcher, batter, other, gameState)
    {
        this.eventType = eventType;
        this.pitcher = pitcher;
        this.batter = batter;
        this.other = other;
        //this.gameState = null;
        curInning = gameState.curInning;
        this.playId = curInning+batter;
    
        this.index = gIndex;
        ++gIndex;
    }


    //A log entry would combine multiple Events with the same batter in the same inning/outcount
}

/*

e = new Event("strike", pitcher, batter);
e = new Event("strikeout")
ball
walk
hbp
single
double
triple
hr
rbi
out - this is when the runner is out?
error - not now
doubleplay - ??
foul
*/
