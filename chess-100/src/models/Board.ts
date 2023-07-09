import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Archer } from "./figures/Archer";
import { Bishop } from "./figures/Bishop";
import { Figure } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export class Board {
  cells: Cell[][] = []

  lostWhiteFigures: Figure[] = []
  lostBlackFigures: Figure[] = []

  public initCells() {
    for (let i = 0; i < 10; i++) {
      const row: Cell[] = []

      for (let j = 0; j < 10; j++) {
        (i + j) % 2 !== 0
          ?
          row.push(new Cell(this, j, i, Colors.BLACK, null)) // black cells
          :
          row.push(new Cell(this, j, i, Colors.WHITE, null)) // white cells
      }

      this.cells.push(row)
    }
  }

  public getCopyBoard(): Board {
    const newBoard = new Board()
    
    newBoard.cells = this.cells

    newBoard.lostWhiteFigures = this.lostWhiteFigures
    newBoard.lostBlackFigures = this.lostBlackFigures

    return newBoard
  }
  
  public highlightCells(selectedCell: Cell | null) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i]

      for (let j = 0; j < row.length; j++) {
        const target  = row[j]

        target.available = !!selectedCell?.figure?.canMove(target)
      }
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x]
  }

  private addPawns() {
    for (let i = 0; i < 10; i++) {
      new Pawn(Colors.WHITE, this.getCell(i, 7))
      new Pawn(Colors.BLACK, this.getCell(i, 2))
    }
  }

  private addRooks() {
    new Rook(Colors.WHITE, this.getCell(0, 9))
    new Rook(Colors.WHITE, this.getCell(9, 9))
    new Rook(Colors.BLACK, this.getCell(0, 0))
    new Rook(Colors.BLACK, this.getCell(9, 0))
  }

  private addKnights() {
    new Knight(Colors.WHITE, this.getCell(1, 8))
    new Knight(Colors.WHITE, this.getCell(8, 8))
    new Knight(Colors.BLACK, this.getCell(1, 1))
    new Knight(Colors.BLACK, this.getCell(8, 1))
  }

  private addArchers() {
    new Archer(Colors.WHITE, this.getCell(3, 8))
    new Archer(Colors.WHITE, this.getCell(6, 8))
    new Archer(Colors.BLACK, this.getCell(3, 1))
    new Archer(Colors.BLACK, this.getCell(6, 1))
  }

  private addBishops() {
    new Bishop(Colors.WHITE, this.getCell(3, 9))
    new Bishop(Colors.WHITE, this.getCell(6, 9))
    new Bishop(Colors.BLACK, this.getCell(3, 0))
    new Bishop(Colors.BLACK, this.getCell(6, 0))
  }

  private addQueens() {
    new Queen(Colors.WHITE, this.getCell(5, 9))
    new Queen(Colors.BLACK, this.getCell(5, 0))
  }

  private addKings() {
    new King(Colors.WHITE, this.getCell(4, 9))
    new King(Colors.BLACK, this.getCell(4, 0))
  }

  public addFigures() {
    this.addPawns()
    this.addRooks()
    this.addKnights()
    this.addArchers()
    this.addBishops()
    this.addQueens()
    this.addKings()
  }
}