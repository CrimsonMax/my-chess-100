import { PromoModal } from "../components/PromotionModal"
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
    this.redCell = false
  }

  readonly x: number
  readonly y: number
  readonly color: Colors

  figure: Figure | null
  board: Board
  available: boolean // check if can be moved
  id: number // for react keys
  redCell: boolean

  static jumpX: number = 0
  static jumpY: number = 0

  static checkX: number = 0
  static checkY: number = 0

  setFigure(figure: Figure) {
    this.figure = figure
    this.figure.cell = this
  }

  addLostFigure(figure: Figure) {
    figure.color === Colors.BLACK ? this.board.lostBlackFigures.push(figure) : this.board.lostWhiteFigures.push(figure)
  }

  checkAllCells(fn: Function, figure: Figure | null = null) {
    for (let i = 0; i < this.board.cells.length; i++) {
      const row: Cell[] = this.board.cells[i]

      for (let j = 0; j < row.length; j++) {
        const point: Cell = row[j]

        fn(point, figure)
      }
    }
  }

  moveFigure(target: Cell, isPromo?: (modalParams: PromoModal) => void, isCheck?: (check: boolean) => void): boolean {
    if (this.figure && (this.figure?.canMove(target) || !isPromo)) {
      let checkMate: boolean = false

      // EATING
      let killedEnemy: Figure | null = target.figure

      // CASTLING
      if (this.figure.name === FigureNames.KING) {
        if (this.x - target.x < 0 && target.x !== this.x + 1) {
          const rightRook = this.figure?.color === Colors.WHITE ? this.board.getCell(9, 9).figure : this.board.getCell(9, 0).figure
          const castleRight = this.figure?.color === Colors.WHITE ? this.board.getCell(6, 9) : this.board.getCell(6, 0)

          rightRook?.cell.moveFigure(castleRight, isPromo)
        }

        if (this.x - target.x > 0 && target.x !== this.x - 1) {
          const leftRook = this.figure?.color === Colors.WHITE ? this.board.getCell(0, 9).figure : this.board.getCell(0, 0).figure
          const castleLeft = this.figure?.color === Colors.WHITE ? this.board.getCell(2, 9) : this.board.getCell(2, 0)

          leftRook?.cell.moveFigure(castleLeft, isPromo)
        }
      }

      // PASSING
      // Can jump
      if (this.figure.name === FigureNames.PAWN && this.figure.isFirstStep && Math.abs(this.y - target.y) === 2) {
        this.figure.isJumped = true
        Cell.jumpX = target.x
        Cell.jumpY = target.y
      }
      // Cannot jump
      if (this.board.getCell(Cell.jumpX, Cell.jumpY)?.figure?.isJumped) {
        const jumpedPawn = this.board.getCell(Cell.jumpX, Cell.jumpY).figure
        if (jumpedPawn?.isJumped) jumpedPawn.isJumped = false
      }
      // Can be attacked
      if (this.figure.name === FigureNames.PAWN && this.x !== target.x && !this.board.getCell(target.x, target.y).figure) {
        let jumpedCell = this.board.getCell(Cell.jumpX, Cell.jumpY)
        if (jumpedCell.figure) {
          this.addLostFigure(jumpedCell.figure)
          jumpedCell.figure = null
        }
      }

      // PROMOTION
      let promotion = (this.figure.color === Colors.WHITE && target.y === 0) || (this.figure.color === Colors.BLACK && target.y === 9)

      if (this.figure.name === FigureNames.PAWN && promotion && isPromo) {
        target.setFigure(this.figure)

        let color = this.figure.color
        let promoCell = this.board.getCell(target.x, target.y)
        let startCell = this.board.getCell(this.x, this.y)

        this.figure = null
        promoCell.figure = null

        isPromo({ active: true, color, promoCell, startCell })
      } else {
        let currentFigure: Figure = this.figure
        let currentCell: Cell = this.figure.cell
        let currentFirstStep: boolean = this.figure.isFirstStep

        target.setFigure(this.figure)
        this.figure.isFirstStep = false

        // CHECKING
        let currentColor: Colors = this.figure.color
        let oppositeColor: Colors = currentColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        let attackerName: FigureNames = this.figure.name
        let kingUnderAttack: boolean = false

        const attackingFigures: Array<Figure> = []
        const cellsUnderAttack: Array<Cell> = []
        const defenceArray: Figure[] = []
        const kingCellsUnderAttack: Cell[] = []

        // enemy's king status
        let kingFigure: Figure | null = null
        let kingCanMove: boolean = false
        let killKiller: boolean = false
        let kingCell: Cell | null = null

        const setEnemyAttackingFigures = (cell: Cell) => {
          if (cell.redCell) cell.redCell = false

          if (cell?.figure?.color === oppositeColor) {
            attackingFigures.push(cell.figure)
          }
        }

        const setCellsUnderAttack = (cell: Cell, figure: Figure) => {
          if (figure.name !== FigureNames.PAWN && figure.canDefence(cell) && cell.figure !== figure) {
            cell.redCell = true
          }

          if (figure.name === FigureNames.PAWN) {
            if (figure.cell.x !== 0) this.board.getCell(figure.cell.x - 1, oppositeColor === Colors.WHITE ? figure.cell.y - 1 : figure.cell.y + 1).redCell = true
            if (figure.cell.x < 9) this.board.getCell(figure.cell.x + 1, oppositeColor === Colors.WHITE ? figure.cell.y - 1 : figure.cell.y + 1).redCell = true
          }
        }

        const setCurrentKingStatus = (point: Cell) => {
          if (point.figure?.name === FigureNames.KING && point.figure.color === currentColor && point.redCell) {
            point.figure.isChecked = true
            Cell.checkX = point.figure.cell.x
            Cell.checkY = point.figure.cell.y

            this.figure = currentFigure
            currentCell.setFigure(this.figure)
            this.figure.isFirstStep = currentFirstStep

            if (killedEnemy) {
              target.figure = killedEnemy
            } else {
              target.figure = null
            }

            kingUnderAttack = true
          }
        }

        const setMyCellsUnderAttack = (cell: Cell) => {
          // clear red cells
          if (cell.redCell) cell.redCell = false

          if (cell?.figure?.color === currentColor) {
            attackingFigures.push(cell.figure)
          }
        }

        const setMyAttackingFigures = (point: Cell, figure: Figure) => {
          if (figure.name !== FigureNames.PAWN && figure.canDefence(point) && point.figure !== figure) {
            point.redCell = true
            cellsUnderAttack.push(point)
          }

          if (figure.name === FigureNames.PAWN) {
            if (figure.cell.x !== 0) this.board.getCell(figure.cell.x - 1, currentColor === Colors.WHITE ? figure.cell.y - 1 : figure.cell.y + 1).redCell = true
            if (figure.cell.x < 9) this.board.getCell(figure.cell.x + 1, currentColor === Colors.WHITE ? figure.cell.y - 1 : figure.cell.y + 1).redCell = true
          }
        }

        const setDefendStatus = (cell: Cell) => {
          if (cell.figure?.color === oppositeColor && cell.figure.canMove(target)) {
            killKiller = true
          }

          if (cell.figure?.color === oppositeColor) {
            defenceArray.push(cell.figure)
          }
        }

        const setEnemyKingStatus = (point: Cell) => {
          if (point.figure?.name === FigureNames.KING && point.figure.color === oppositeColor && point.redCell) {
            point.figure.isChecked = true
            Cell.checkX = point.figure.cell.x
            Cell.checkY = point.figure.cell.y

            kingFigure = point.figure
            kingCell = this.board.getCell(Cell.checkX, Cell.checkY)

            const kingsArray: Cell[] = [
              this.board.getCell(Cell.checkX, Cell.checkY + 1),
              this.board.getCell(Cell.checkX, Cell.checkY - 1),
              this.board.getCell(Cell.checkX + 1, Cell.checkY),
              this.board.getCell(Cell.checkX - 1, Cell.checkY),
              this.board.getCell(Cell.checkX + 1, Cell.checkY + 1),
              this.board.getCell(Cell.checkX - 1, Cell.checkY - 1),
              this.board.getCell(Cell.checkX + 1, Cell.checkY - 1),
              this.board.getCell(Cell.checkX - 1, Cell.checkY + 1),
            ]

            this.checkAllCells(setDefendStatus)

            let canMoveToRedCell = false

            // fix when killer is not a killer
            if (true) {
              kingsArray.forEach(elem => {
                if (kingFigure?.canMove(elem)) kingCanMove = true
              })

              if (attackerName === (FigureNames.KNIGHT || FigureNames.ARCHER && !kingCanMove && !killKiller)) {
                checkMate = true
                isCheck && isCheck(false)
              } else {
                let redCell: Cell | null = null

                if (kingCell.x === target.x || kingCell.y === target.y) { // horisontal or vertical attack
                  let cellEqual = null
                  let start = null
                  let end = null

                  if (kingCell.x === target.x) { // vertical attack
                    cellEqual = target.x

                    if (target.y > kingCell.y) { // from bottom
                      start = target.y
                      end = kingCell.y

                      redCell = this.board.getCell(cellEqual, kingCell.y - 1)
                    } else { // from top
                      start = kingCell.y
                      end = target.y

                      redCell = this.board.getCell(cellEqual, kingCell.y + 1)
                    }

                    for (let i = end + 1; i < start; i++) {
                      kingCellsUnderAttack.push(this.board.getCell(cellEqual, i))
                    }
                  } else { // horizontal attack
                    cellEqual = target.y

                    if (target.x > kingCell.x) { // from right
                      start = target.x
                      end = kingCell.x

                      redCell = this.board.getCell(kingCell.x - 1, cellEqual)
                    } else { // from left
                      start = kingCell.x
                      end = target.x

                      redCell = this.board.getCell(kingCell.x + 1, cellEqual)
                    }

                    for (let i = end + 1; i < start; i++) {
                      kingCellsUnderAttack.push(this.board.getCell(i, cellEqual))
                    }
                  }
                } else { // diagonal attack
                  let attactX = target.x
                  let attackY = target.y
                  let kingX = kingCell.x
                  let kingY = kingCell.y

                  if (attactX > kingX && attackY < kingY) { // right-top
                    redCell = this.board.getCell(kingX - 1, kingY + 1)

                    for (let i = kingX + 1; i < attactX; i++) {
                      kingCellsUnderAttack.push(this.board.getCell(i, kingY - (i - kingX)))
                    }
                  } else if (attactX > kingX && attackY > kingY) { // right-bottom
                    redCell = this.board.getCell(kingX - 1, kingY - 1)

                    for (let i = kingX + 1; i < attactX; i++) {
                      kingCellsUnderAttack.push(this.board.getCell(i, kingY + (i - kingX)))
                    }
                  } else if (attactX < kingX && attackY > kingY) { // left-bottom
                    redCell = this.board.getCell(kingX + 1, kingY - 1)

                    for (let i = kingX - 1; i > attactX; i--) {
                      kingCellsUnderAttack.push(this.board.getCell(i, kingY + (kingX - i)))
                    }
                  } else { // left-top
                    redCell = this.board.getCell(kingX + 1, kingY + 1)

                    for (let i = kingX - 1; i > attactX; i--) {
                      kingCellsUnderAttack.push(this.board.getCell(i, kingY - (kingX - i)))
                    }
                  }
                }

                kingCanMove = false

                kingsArray.forEach(elem => {
                  if (kingFigure?.canMove(elem) && elem !== redCell) kingCanMove = true
                })

                for (let i = 0; i < defenceArray.length; i++) {
                  kingCellsUnderAttack.forEach(elem => {
                    if (defenceArray[i].canMove(elem) && !canMoveToRedCell) {
                      canMoveToRedCell = true
                      return
                    }
                  })
                }

                if (!canMoveToRedCell && !kingCanMove) {
                  checkMate = true
                  isCheck && isCheck(false)
                }
              }
            }

            if (!checkMate) isCheck && isCheck(true)
          }
        }

        this.figure = null

        // set enemy's attacking figures array
        this.checkAllCells(setEnemyAttackingFigures)

        // set enemy's cells under attack array
        attackingFigures.forEach(elem => {
          this.checkAllCells(setCellsUnderAttack, elem)
        })

        // set current king status
        this.checkAllCells(setCurrentKingStatus)

        // can only save king
        if (kingUnderAttack) return false

        attackingFigures.length = 0

        // set my cells under attack array
        this.checkAllCells(setMyCellsUnderAttack)

        // set my attacking figures array
        attackingFigures.forEach(elem => {
          this.checkAllCells(setMyAttackingFigures, elem)
        })

        // set enemy's king status
        this.checkAllCells(setEnemyKingStatus)

        const checkedKing = this.board.getCell(Cell.checkX, Cell.checkY).figure

        if (checkedKing?.isChecked && checkedKing.color === currentColor) {
          checkedKing.isChecked = false
        }
      }


      if (killedEnemy) this.addLostFigure(killedEnemy)
    }

    return true
  }

  isEmpty(): boolean {
    return this.figure === null
  }

  isEnemy(target: Cell): boolean {
    if (target.figure) return this.figure?.color !== target.figure.color

    return false
  }

  isSafeHorizontal(target: Cell): boolean {
    if (this.y !== target.y) return false

    const min = Math.min(this.x, target.x)
    const max = Math.max(this.x, target.x)

    for (let x = min + 1; x < max; x++) {
      if (this.board.getCell(x, this.y).redCell) return false
    }

    return true
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


    // remove for check
    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) return false
    }

    return true
  }
}