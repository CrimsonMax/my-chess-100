import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from '../../assets/black-archer.png'
import whiteLogo from '../../assets/white-archer.png'

export class Archer extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color , cell)

    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
    this.name = FigureNames.ARCHER
  }
}