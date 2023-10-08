import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from '../../assets/black-archer.png'
import whiteLogo from '../../assets/white-archer.png'

export class Archer extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell)

    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
    this.name = FigureNames.ARCHER
    this.strength = 3
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false

    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)

    return (dx === 2 && dy === 0) || (dx === 0 && dy === 2) || (dx === 1 && dy === 1)
  }

  canDefence(target: Cell): boolean {
    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)

    return (dx === 2 && dy === 0) || (dx === 0 && dy === 2) || (dx === 1 && dy === 1)
  }
}