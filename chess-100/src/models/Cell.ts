import { Board } from "./Board"
import { Colors } from "./Colors"
import { Figure, FigureNames } from "./figures/Figure"

export class Cell {
  constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
    this.board = board
    this.x = x
    this.y = y
    this.color = color
    this.figure = figure
    this.available = false
    this.id = Math.random()
  }

  readonly x: number
  readonly y: number
  readonly color: Colors
  figure: Figure | null
  board: Board
  available: boolean // check if can be moved
  id: number // for react keys

  static jumpX: number = 0
  static jumpY: number = 0

  setFigure(figure: Figure) {
    this.figure = figure
    this.figure.cell = this
  }

  addLostFigure(figure: Figure) {
    figure.color === Colors.BLACK ? this.board.lostBlackFigures.push(figure) : this.board.lostWhiteFigures.push(figure)
  }

  moveFigure(target: Cell) {
    if (this.figure && this.figure?.canMove(target)) {
      if (target.figure) this.addLostFigure(target.figure)

      if (this.figure.name === FigureNames.KING) {
        if (Math.abs(this.x - target.x) === 4) {
          const rightRook = this.figure?.color === Colors.WHITE ? this.board.getCell(9, 9).figure : this.board.getCell(9, 0).figure
          const castleRight = this.figure?.color === Colors.WHITE ? this.board.getCell(7, 9) : this.board.getCell(7, 0)

          rightRook?.cell.moveFigure(castleRight)
        }
        
        if (Math.abs(this.x - target.x) === 3) {
          const leftRook = this.figure?.color === Colors.WHITE ? this.board.getCell(0, 9).figure : this.board.getCell(0, 0).figure
          const castleLeft = this.figure?.color === Colors.WHITE ? this.board.getCell(2, 9) : this.board.getCell(2, 0)

          leftRook?.cell.moveFigure(castleLeft)
        }
      }

      if (this.figure.name === FigureNames.PAWN && this.figure.isFirstStep && Math.abs(this.y - target.y) === 2) {
        this.figure.isJumped = true
        Cell.jumpX = target.x
        Cell.jumpY = target.y
      } 

      if (this.board.getCell(Cell.jumpX, Cell.jumpY)?.figure?.isJumped) {
        const jumpedPawn = this.board.getCell(Cell.jumpX, Cell.jumpY).figure
        if (jumpedPawn?.isJumped) jumpedPawn.isJumped = false
      }

      if (this.figure.name == FigureNames.PAWN && this.x !== target.x && !this.board.getCell(target.x, target.y).figure) {
        let jumpedCell = this.board.getCell(Cell.jumpX, Cell.jumpY)
        if (jumpedCell.figure) {
          this.addLostFigure(jumpedCell.figure)
          jumpedCell.figure = null
        }
      }
      
      target.setFigure(this.figure)
      this.figure.isFirstStep = false
      this.figure = null
    }
  }

  isEmpty(): boolean {
    return this.figure === null
  }

  isEnemy(target: Cell): boolean {
    if (target.figure) return this.figure?.color !== target.figure.color

    return false
  }

  canCastleLeft(): boolean {
    const leftRook = this.figure?.color === Colors.WHITE ? this.board.getCell(0, 0).figure : this.board.getCell(0, 9).figure

    return leftRook?.name === FigureNames.ROOK && leftRook.isFirstStep
  }

  canCastleRight(): boolean {
    const rightRook = this.figure?.color === Colors.WHITE ? this.board.getCell(9, 0).figure : this.board.getCell(9, 9).figure

    return rightRook?.name === FigureNames.ROOK && rightRook.isFirstStep
  }

  isEmptyHorizontal(target: Cell): boolean {
    if (this.y !== target.y) return false

    const min = Math.min(this.x, target.x)
    const max = Math.max(this.x, target.x)

    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) return false
    }

    return true
  }

  isEmptyVertical(target: Cell): boolean {
    if (this.x !== target.x) return false

    const min = Math.min(this.y, target.y)
    const max = Math.max(this.y, target.y)

    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) return false
    }

    return true
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x)
    const absY = Math.abs(target.y - this.y)

    if (absY !== absX) return false

    const dx = this.x < target.x ? 1 : -1
    const dy = this.y < target.y ? 1 : -1

    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) return false
    }

    return true
  }
}