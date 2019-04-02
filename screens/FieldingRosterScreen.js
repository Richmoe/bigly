import RosterScreen from "../screens/RosterScreen";
import GameConst from "../constants/GameConst.js";


export default class FieldingRosterScreen extends RosterScreen {


    constructor(props) {
        super(props);

        this.formatRow = [10,80,10];
        this.header = ["Pos", "Name", "#"];
        this.order = this.team.fieldPositions;
        this.view = 'fielding';
    }

    makeRow = (ix, val) => {
        var player = this.team.team.roster[val];
        return this.rowJSX(ix, GameConst.fieldPosAbbrev[player.currentPosition], player.name, (player.battingOrder + 1));

    }
}