export default class GameParams {
    constructor(innings,isHome,machine) {
        this.innings = innings;
        this.isHome = isHome;
        this.machinePitch = machine;
        this.maxInnings = 5*2; //5 innings, inning counter is even for top, odd for bottom (e.g. inning 1 = bottom of 1st, inning 6 = top of 4th)
    }
}