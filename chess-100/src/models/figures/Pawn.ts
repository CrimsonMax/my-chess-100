import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from '../../assets/black-pawn.png'
import whiteLogo from '../../assets/white-pawn.png'

export class Pawn extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell)

    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
    this.name = FigureNames.PAWN
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false

    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1
    const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2

    const theJump = this.isFirstStep && (target.y === this.cell.y + firstStepDirection) && this.cell.board.getCell(target.x, target.y - direction).isEmpty()

    if (
      ((target.y === this.cell.y + direction) || (theJump))
      &&
      target.x === this.cell.x 
      && 
      this.cell.board.getCell(target.x, target.y).isEmpty()
    ) {

      return true
    }

    if (
      (target.y === this.cell.y + direction)
      &&
      ((target.x === this.cell.x + 1) || (target.x === this.cell.x - 1))
      &&
      (
        this.cell.isEnemy(target)
        ||
        (
          (this.cell.board.getCell(Cell.jumpX, Cell.jumpY).figure?.isJumped)
          &&
          ((target.y === Cell.jumpY + direction) && (target.x === Cell.jumpX))
        )
      )
    ) {

      return true
    }

    return false
  }
}