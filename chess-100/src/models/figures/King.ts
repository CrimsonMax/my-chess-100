import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from '../../assets/black-king.png'
import whiteLogo from '../../assets/white-king.png'

export class King extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell)

    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
    this.name = FigureNames.KING
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false

    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)

    const dxLeft = Math.abs((this.cell.x - 3) - target.x)
    const dxRigth = Math.abs((this.cell.x + 3) - target.x)

    const leftRook = this.cell.figure?.color === Colors.WHITE ? this.cell.board.getCell(0, 9).figure : this.cell.board.getCell(0, 0).figure
    const rightRook = this.cell.figure?.color === Colors.WHITE ? this.cell.board.getCell(9, 9).figure : this.cell.board.getCell(9, 0).figure

    const leftCastle = leftRook?.name === FigureNames.ROOK && leftRook.isFirstStep
    const rightCastle = rightRook?.name === FigureNames.ROOK && rightRook.isFirstStep

    if (this.isFirstStep && this.cell.isEmptyHorizontal(target) && !this.isChecked) {
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1) || (leftCastle && dxLeft === 0 && dy === 0) || (rightCastle && dxRigth === 0 && dy === 0)
    }

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1)
  }

  canDefence(target: Cell): boolean {
    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1)
  }
}