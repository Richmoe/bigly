export default class GameParams {

    /*
    maxInnings = 5;
    maxFieldPlayers = 11;
    maxRunsPerInning = 5;
    machinePitch = true;
    */

    constructor(team) { //Pass in my team to extract parameters from it.
        this.innings = team.maxInnings;
        this.allowMachinePitch = team.machinePitch;
        this.mercyRule = team.maxRunsPerInning;
        this.maxFieldPlayers = team.maxFieldPlayers;
        this.maxInnings = team.maxInnings*2; //5 innings, inning counter is even for top, odd for bottom (e.g. inning 1 = bottom of 1st, inning 6 = top of 4th)
    }
}