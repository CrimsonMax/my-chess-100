import { FC } from "react"
import { Cell } from "../models/Cell"

interface CellProps {
  cell: Cell
  selected: Boolean
  click: (cell: Cell) => void
  code: string
}


const CellComponent: FC<CellProps> = ({ cell, selected, click, code }) => {
  let cellClassName = `${code} cell ${cell.color} ${selected ? 'selected' : ''} ${cell.available && cell.figure ? 'red' : ''}`

  return (
    <div className={cellClassName} onClick={() => click(cell)} >
      {cell.available && !cell.figure && <div className="available"></div>}
      {cell.figure?.logo && <img src={cell.figure.logo} alt={`${cell.figure.color} ${cell.figure.name}`} />}
    </div>
  )
}

export default CellComponent