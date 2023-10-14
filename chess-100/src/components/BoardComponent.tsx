import React, { FC, useState, useEffect } from "react"
import { Board } from "../models/Board"
import CellComponent from "./CellComponent"
import { Cell } from "../models/Cell"
import { Player } from "../models/Player"
import { Colors } from "../models/Colors"
import { PromoModal } from "../App"

interface BoardProps {
  board: Board
  setBoard: (board: Board) => void
  currentPlayer: Player | null
  swapPlayer: () => void
  thePromotion: (modalParams: PromoModal) => void
  theCheck: (check: boolean) => void
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer, thePromotion, theCheck }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

  useEffect(() => {
    highlightCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell])

  function click(target: Cell) {
    // cancel select
    if (selectedCell === target) {
      setSelectedCell(null)
      highlightCells()
      return
    }

    if (selectedCell && selectedCell !== target && selectedCell.figure?.canMove(target)) { // moving
      let isValidMove = selectedCell.moveFigure(target, thePromotion, theCheck)

      if (isValidMove) {
        setSelectedCell(null)
        swapPlayer()
      } 

      updateBoard()
    } else { // just selecting

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

  let headerClassname = `current-player ${currentPlayer?.color}`

  return (
    <>
      <h3 className={headerClassname}>Current Player - {currentPlayer?.color}</h3>
      <div className="board">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell => (
              <CellComponent
                click={click}
                cell={cell}
                key={cell.id}
                code={`x${cell.x + 1} y${cell.y + 1}`}
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