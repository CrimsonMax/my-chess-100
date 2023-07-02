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
  }

  color: Colors
  logo: typeof logo | null
  cell: Cell
  name: FigureNames
  id: number

  isFirstStep: boolean = true

  canMove(target: Cell): boolean {
    if (target.figure?.color === this.color || target.figure?.name === FigureNames.KING) return false
    
    return true
  }

  
  moveFigure(target: Cell): void {
    // super.moveFigure(target)
    this.isFirstStep = false
  }
}