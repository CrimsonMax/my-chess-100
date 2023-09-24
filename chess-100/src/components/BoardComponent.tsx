import React, { FC, useState, useEffect } from "react"
import { Board } from "../models/Board"
import CellComponent from "./CellComponent"
import { Cell } from "../models/Cell"
import { Player } from "../models/Player"
import { Colors } from "../models/Colors"

interface BoardProps {
  board: Board,
  setBoard: (board: Board) => void,
  currentPlayer: Player | null,
  swapPlayer: () => void,
  thePromotion: (isModal: boolean, color: Colors, promoCell: Cell, startCell: Cell) => void,
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer, thePromotion }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

  useEffect(() => {
    highlightCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell])

  function click(target: Cell) {
    // cancel choice
    if (selectedCell === target) {
      setSelectedCell(null)
      highlightCells()
      return
    }

    if (selectedCell && selectedCell !== target && selectedCell.figure?.canMove(target)) { // moving
      let isValidMove = selectedCell.moveFigure(target, thePromotion)

      if (isValidMove) {
        setSelectedCell(null)
        swapPlayer()
      } 

      updateBoard()
    } else { // selecting

      if (target.figure?.color === currentPlayer?.color) {
        setSelectedCell(target)
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