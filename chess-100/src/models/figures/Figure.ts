import logo from '../../assets/black-archer.png'
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
    this.isCheckmate = false
    this.strength = 0
  }

  color: Colors
  logo: typeof logo | null
  cell: Cell
  name: FigureNames
  id: number
  isFirstStep: boolean
  isJumped: boolean
  isChecked: boolean
  isCheckmate: boolean
  strength: number
  
  canMove(target: Cell): boolean {
    if ((target.figure?.color === this.color) || (this.name === FigureNames.KING && target.redCell)) {
      return false
    }

    return true
  }

  canDefence(target: Cell): boolean {
    return true
  }
}