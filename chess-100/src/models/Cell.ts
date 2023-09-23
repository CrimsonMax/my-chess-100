import { Board } from "./Board"
import { Colors } from "./Colors"
import { Figure, FigureNames } from "./figures/Figure"
// import { Rook } from "./figures/Rook"

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

  moveFigure(target: Cell, isPromo?: (isModal: boolean, color: Colors, promoCell: Cell, startCell: Cell) => void): boolean {
    // !isPromo && console.log('promo')
    // console.log(isPromo)
    if (this.figure && (this.figure?.canMove(target) || !isPromo)) {
      // Kill the King
      // if (target.figure?.name === FigureNames.KING) alert(`${this.figure.color} win!!`)

      // let forbiddenCell: Boolean = false

      // if (this.figure.name === FigureNames.KING && target.redCell) {
      //   forbiddenCell = true
      // }

      // Eating
      let killedEnemy = target.figure
      // console.log(killedEnemy)
      // if (target.figure) this.addLostFigure(target.figure)
      // if (killedEnemy) this.addLostFigure(killedEnemy)

      // Castling
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

      // Passing
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

      // Promotion
      let promotion = (this.figure.color === Colors.WHITE && target.y === 0) || (this.figure.color === Colors.BLACK && target.y === 9)

      if (this.figure.name === FigureNames.PAWN && promotion && isPromo) {
        target.setFigure(this.figure)

        let color = this.figure.color
        let promoCell = this.board.getCell(target.x, target.y)
        let startCell = this.board.getCell(this.x, this.y)

        this.figure = null
        promoCell.figure = null
        isPromo(true, color, promoCell, startCell)
      } else {
        let currentFigure: Figure = this.figure
        let currentCell: Cell = this.figure.cell
        let currentFirstStep: boolean = this.figure.isFirstStep
        // console.log(this.figure.cell)
        target.setFigure(this.figure)
        // console.log(this.figure.cell)
        this.figure.isFirstStep = false

        // Check
        let currentColor: Colors = this.figure.color
        let oppositeColor: Colors = currentColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        const redCells: Array<Cell> = []
        const redArmy: Array<Figure> = []

        let attackerName: FigureNames = this.figure.name

        this.figure = null
        // console.log(currentFigure)

        // set enemy's red cells
        for (let i = 0; i < this.board.cells.length; i++) {
          const row: Cell[] = this.board.cells[i]

          for (let j = 0; j < row.length; j++) {
            const point: Cell = row[j]

            // clear red cells
            if (point.redCell) point.redCell = false

            // if (point?.figure?.color === currentColor) {
            //   redArmy.push(point.figure)
            // }

            if (point?.figure?.color === oppositeColor) {
              redArmy.push(point.figure)
            }

            // console.log(point)

            ////////////////////////////////

            // point.available = !!this.figure.canMove(point)

            // if (point.available && point.figure?.name === FigureNames.KING && point.figure !== this.figure) {
            //   point.figure.isChecked = true
            //   Cell.checkX = point.figure.cell.x
            //   Cell.checkY = point.figure.cell.y
            // }
          }
        }

        const enemyRedCells: Array<Cell> = []

        // if (killedEnemy){
        //   redArmy.push(killedEnemy)
        // }

        redArmy.forEach(elem => {
          for (let i = 0; i < this.board.cells.length; i++) {
            const row: Cell[] = this.board.cells[i]

            for (let j = 0; j < row.length; j++) {
              const point: Cell = row[j]

              if (elem.name !== FigureNames.PAWN && elem.canDefence(point) && point.figure !== elem) {
                point.redCell = true

                // console.log(killedEnemy)
                // console.log(elem)
                // debugger
                // if (elem === killedEnemy) {
                //   killedCells.push(point)
                // }
              }

              if (elem.name === FigureNames.PAWN) {
                if (elem.cell.x !== 0) this.board.getCell(elem.cell.x - 1, oppositeColor === Colors.WHITE ? elem.cell.y - 1 : elem.cell.y + 1).redCell = true
                if (elem.cell.x < 9) this.board.getCell(elem.cell.x + 1, oppositeColor === Colors.WHITE ? elem.cell.y - 1 : elem.cell.y + 1).redCell = true
              }

              // point.available = !!figure.canMove(point)
            }
          }
        })
        // set current king status
        for (let i = 0; i < this.board.cells.length; i++) {
          const row: Cell[] = this.board.cells[i]

          for (let j = 0; j < row.length; j++) {
            const point: Cell = row[j]

            if (point.figure?.name === FigureNames.KING && point.figure.color === currentColor && point.redCell) {
              point.figure.isChecked = true
              Cell.checkX = point.figure.cell.x
              Cell.checkY = point.figure.cell.y
              // console.log('My King is checked')

              // cancel move
              // if (this.figure.name === FigureNames.PAWN) {
              //   this.figure.cell.setFigure(this.figure)
              //   target.figure = null
              //   return
              // }

              // debugger
              this.figure = currentFigure
              currentCell.setFigure(this.figure)
              // target.figure?.cell = null
              this.figure.isFirstStep = currentFirstStep
              // console.log(target.figure?.cell)
              // console.log(target.figure)
              // killedEnemy ? target.figure = killedEnemy : target.figure = null

              if (killedEnemy) {
                target.figure = killedEnemy
                // console.log(killedCells)
                // killedCells.forEach(elem => elem.redCell = true)
              } else {
                target.figure = null
              }

              /* remark red cells if killedEnemy */

              // this.figure = null
              // target = this.figure.cell
              // status = cancel
              return false
            }
          }
        }

        // console.log(redCells)

        // set my red cells
        redArmy.length = 0

        for (let i = 0; i < this.board.cells.length; i++) {
          const row: Cell[] = this.board.cells[i]

          for (let j = 0; j < row.length; j++) {
            const point: Cell = row[j]

            // clear red cells
            if (point.redCell) point.redCell = false

            if (point?.figure?.color === currentColor) {
              redArmy.push(point.figure)
            }
          }
        }
        redArmy.forEach(elem => {
          for (let i = 0; i < this.board.cells.length; i++) {
            const row: Cell[] = this.board.cells[i]

            for (let j = 0; j < row.length; j++) {
              const point: Cell = row[j]

              if (elem.name !== FigureNames.PAWN && elem.canDefence(point) && point.figure !== elem) {
                point.redCell = true
                enemyRedCells.push(point)
              }

              if (elem.name === FigureNames.PAWN) {
                if (elem.cell.x !== 0) this.board.getCell(elem.cell.x - 1, currentColor === Colors.WHITE ? elem.cell.y - 1 : elem.cell.y + 1).redCell = true
                if (elem.cell.x < 9) this.board.getCell(elem.cell.x + 1, currentColor === Colors.WHITE ? elem.cell.y - 1 : elem.cell.y + 1).redCell = true
              }
            }
          }
        })
        // set enemy's king status
        let kingFigure: Figure | null = null
        let kingCanMove: boolean = false
        let killKiller: boolean = false
        let canDefenceKing: boolean = false
        const defenceArray: Figure[] = []
        const redCells2: Cell[] = []
        let kingCell: Cell | null = null 
        // let attackerName = 

        for (let i = 0; i < this.board.cells.length; i++) {
          const row: Cell[] = this.board.cells[i]

          for (let j = 0; j < row.length; j++) {
            const point: Cell = row[j]

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

              kingsArray.forEach(elem => {
                if (kingFigure?.canMove(elem)) kingCanMove = true
              })

              if (!kingCanMove) console.log('surrounded!!')

              // if (attackerName === (FigureNames.KNIGHT || FigureNames.ARCHER) && !kingCanMove) console.log('checkmate!!')

              

              for (let i = 0; i < this.board.cells.length; i++) {
                const row: Cell[] = this.board.cells[i]

                for (let j = 0; j < row.length; j++) {
                  const point: Cell = row[j]

                  // if (point.figure?.color === oppositeColor) {
                  //   let canFigure = point.figure

                  //   enemyRedCells.forEach(elem => {
                  //     if (canFigure.canMove(elem)) {
                  //       canDefenceKing = true
                  //     }
                  //   })
                  // }

                  if (point.figure?.color === oppositeColor && point.figure.canMove(target)) {
                    killKiller = true
                  }

                  if (point.figure?.color === oppositeColor) {
                    defenceArray.push(point.figure)
                  }

                  // if (point.redCell) {
                  //   redCells2.push(point)
                  // }

                  // if (point.figure?.canDefence())
                }
              }

              // if (defenceArray.length > 0) {
              //   defenceArray.forEach(figure => {
              //     enemyRedCells.forEach(cell => {
              //       if (figure.canMove(cell)) canDefenceKing = true
              //     })
              //   })
              // }
              let canMoveToRedCell = false

              // for (let i = 0; i < defenceArray.length; i++) {

              // }
              /**
               * if x == x || y == y => attact linear 
               * else diagonal
               */

              if (!kingCanMove && !killKiller) {

                if (attackerName === (FigureNames.KNIGHT || FigureNames.ARCHER)) {
                  alert('Checkmate!!')
                } else {

                  if (kingCell.x === target.x || kingCell.y === target.y) {
                    let cellEqual = null
                    let start = null
                    let end = null
                    
                    if (kingCell.x === target.x) {
                      cellEqual = target.x
                      // target.y > kingCell.y
                      // let step = target.y > kingCell.y ? 1 : -1
                      // step = 1
                      if (target.y > kingCell.y) {
                        start = target.y
                        end = kingCell.y
                      } else {
                        start = kingCell.y
                        end = target.y
                      }
                      // let start = step > 0 ? target.y : kingCell.y
                      // start = target.y (6)
                      // end = kingCell.y (0)
                      // debugger
                      for (let i = end + 1; i < start; i++) {
                        redCells2.push(this.board.getCell(cellEqual, i))
                      }
                    } else {
                      cellEqual = target.y

                      if (target.x > kingCell.x) {
                        start = target.x
                        end = kingCell.x
                      } else {
                        start = kingCell.x
                        end = target.x
                      }

                      for (let i = end + 1; i < start; i++) {
                        redCells2.push(this.board.getCell(i, cellEqual))
                      }
                    }
                    
                    // console.log('linear')
                    // console.log(redCells2)
                  } else {
                    let attactX = target.x
                    let attackY = target.y
                    let kingX = kingCell.x
                    let kingY = kingCell.y
                    
                    if (attactX > kingX && attackY < kingY) { // right-top

                      for (let i = kingX + 1; i < attactX; i++) {
                        redCells2.push(this.board.getCell(i, kingY - (i - kingX)))
                      }

                    } else if (attactX > kingX && attackY > kingY) { // right-bottom

                      for (let i = kingX + 1; i < attactX; i++) {
                        redCells2.push(this.board.getCell(i, kingY + (i - kingX)))
                      }

                    } else if (attactX < kingX && attackY > kingY) { // left-bottom

                      for (let i = kingX - 1; i > attactX; i--) {
                        redCells2.push(this.board.getCell(i, kingY + (kingX - i)))
                      }

                    } else { // left-top

                      for (let i = kingX - 1; i > attactX; i--) {
                        redCells2.push(this.board.getCell(i, kingY - (kingX - i)))
                      }

                    }

                    // console.log(redCells2)
                    
                    // console.log('diagonal')
                  }
                  
                  for (let i = 0; i < defenceArray.length; i++) {
                    redCells2.forEach(elem => {
                      if (defenceArray[i].canMove(elem) && !canMoveToRedCell) {
                        canMoveToRedCell = true
                        return
                      }
                    })
                  }

                  // console.log(canMoveToRedCell)

                  if (!canMoveToRedCell) {
                    alert('Checkmate!!')
                  }
                }
                // console.log(kingCell)
                // console.log(target)
              }

              /**
               * if attackerName = Knight || Archer - can enemy attack target
               * else - can enemy attack target or cell between target and king
               */
              

              alert('CHECK!')
              // console.log(kingCell)
              // console.log(target)
              // console.log(enemyRedCells)
              // console.log(redArmy)
              // console.log(canDefenceKing)
            }


            // this.board.getCell(Cell.checkX, Cell.checkY)
            // enemyKingCellAround.forEach(if canMove to)
            // enemyCellsArray.forEach(if canMove to checkersCell || to checkers attack path)
            // then - Alert 'Checkmate!'
          }
        }

        // console.log(redArmy)

        const checkedKing = this.board.getCell(Cell.checkX, Cell.checkY).figure

        // console.log(checkedKing?.isChecked)

        if (checkedKing?.isChecked && checkedKing.color === currentColor) {
          checkedKing.isChecked = false
        }

        // if (this.figure.name === FigureNames.KING && this.figure.isChecked) {
        //   this.figure.isChecked = false
        // }

        // // Eating
        // if (target.figure?.color === oppositeColor) this.addLostFigure(target.figure)
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

  // canCastleLeft(): boolean {
  //   const leftRook = this.figure?.color === Colors.WHITE ? this.board.getCell(0, 0).figure : this.board.getCell(0, 9).figure

  //   return leftRook?.name === FigureNames.ROOK && leftRook.isFirstStep
  // }

  // canCastleRight(): boolean {
  //   const rightRook = this.figure?.color === Colors.WHITE ? this.board.getCell(9, 0).figure : this.board.getCell(9, 9).figure

  //   return rightRook?.name === FigureNames.ROOK && rightRook.isFirstStep
  // }

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