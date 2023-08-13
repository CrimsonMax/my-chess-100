import { FC } from "react"
import { Cell } from "../models/Cell"

interface CellProps {
  cell: Cell,
  selected: Boolean,
  click: (cell: Cell) => void,
}

const CellComponent: FC<CellProps> = ({ cell, selected, click }) => {
  return (
    <div
      className={['cell', cell.color, selected ? 'selected' : ''].join(' ')}
      onClick={() => click(cell)}
      style={{background: cell.redCell ? 'red' : ''}} // remove inline style
      // style={{background: cell.available && cell.figure ? 'red' : ''}} // remove inline style
    >
      {cell.available && !cell.figure && <div className="available"></div>}
      {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
    </div>
  )
}

export default CellComponent