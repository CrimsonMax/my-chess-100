import logo from '../../assets/black-archer.png'
// import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors'

export enum FigureNames {
  FIGURE = 'figure',
  KING = 'king',
  QUEEN = 'queen',
  BISHOP = 'bishop',
  ARCHER = 'archer',
  KNIGHT = 'knight',
  ROOK = 'rook',
  PAWN = 'pawn',
}

export class Figure {
  constructor(color: Colors, cell: Cell) {
    this.color = color
    this.cell = cell
    this.cell.figure = this
    this.logo = null
    this.name = FigureNames.FIGURE
    this.id = Math.random()
    this.isFirstStep = true
    this.isJumped = false
    this.isChecked = false
  }

  color: Colors
  logo: typeof logo | null
  cell: Cell
  name: FigureNames
  id: number
  isFirstStep: boolean
  isJumped: boolean
  isChecked: boolean

  canMove(target: Cell): boolean {
    if (
      (target.figure?.color === this.color)
      ||
      (this.name === FigureNames.KING && target.redCell)
    ) return false

    // for (let i = 0; i < this.board.cells.length; i++) {
    //   const row: Cell[] = this.board.cells[i]

    //   for (let j = 0; j < row.length; j++) {
    //     const point: Cell = row[j]

    //     if (point.figure?.name === FigureNames.KING && point.figure.color === currentColor && point.redCell) {
    //       point.figure.isChecked = true
    //       Cell.checkX = point.figure.cell.x
    //       Cell.checkY = point.figure.cell.y
    //       // console.log('My King is checked')

    //       // cancel move
    //       // if (this.figure.name === FigureNames.PAWN) {
    //       //   this.figure.cell.setFigure(this.figure)
    //       //   target.figure = null
    //       //   return
    //       // }

    //       // debugger
    //       this.figure = currentFigure
    //       this.figure.cell.setFigure(this.figure)
    //       target.figure = null
    //       // target = this.figure.cell
    //       // status = cancel
    //       return false
    //     }
    //   }
    // }

    return true
  }

  canDefence(target: Cell): boolean {
    // if ((target.figure?.color === this.color)) return true

    return true
  }
}