import React, { FC, useState, useEffect } from "react"
import { Board } from "../models/Board"
import CellComponent from "./CellComponent"
import { Cell } from "../models/Cell"
import { Player } from "../models/Player"
import { FigureNames } from "../models/figures/Figure"
import { Colors } from "../models/Colors"

interface BoardProps {
  board: Board,
  setBoard: (board: Board) => void,
  currentPlayer: Player | null,
  swapPlayer: () => void,
  thePromotion: (isModal: boolean, color: Colors, promoCell: Cell) => void,
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer, thePromotion }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

  useEffect(() => {
    highlightCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell])

  function click(cell: Cell) {
    // const checkedKing = board.getCell(Cell.checkX, Cell.checkY).figure?.isChecked

    // if (checkedKing) {

    // }
    // cancel choice
    if (selectedCell === cell) {
      setSelectedCell(null)
      highlightCells()
      return
    }

    if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
      selectedCell.moveFigure(cell, thePromotion)
      // cancel move
      if (true) swapPlayer()
      setSelectedCell(null)
      updateBoard()
    } else {
      // if (checkedKing && cell.figure?.name !== FigureNames.KING) return
      
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell)
      }
    }
  }

  function highlightCells() {
    board.highlightCells(selectedCell)
    updateBoard()
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard()

    setBoard(newBoard)
  }

  return (
    <>
      <h3 className="current-player">Current Player {currentPlayer?.color}</h3>
      <div className="board">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell => (
              <CellComponent
                click={click}
                cell={cell}
                key={cell.id}
                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
              />
            )))}
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default BoardComponent