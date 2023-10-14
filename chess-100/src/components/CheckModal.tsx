import { FC } from 'react'
import { Cell } from '../models/Cell'
import { Colors } from '../models/Colors'
import { FigureNames } from '../models/figures/Figure'
import { Queen } from '../models/figures/Queen'
import { Rook } from '../models/figures/Rook'
import { Knight } from '../models/figures/Knight'
import { Archer } from '../models/figures/Archer'
import { Bishop } from '../models/figures/Bishop'

interface Check {
  active: boolean
  setActive: (isActive: boolean) => void
  check: boolean
}

const CheckModal: FC<Check> = ({ active, setActive, check }) => {
  function closeModal() {
    setActive(false)
  }

  return (
    <div className={active ? 'check-modal active' : 'check-modal'}>
      <div className="check-background" onClick={() => closeModal()}></div>
      <div className={check ? 'check-container' : 'check-container checkmate'}>
        <div className="check-title">{check ? 'Check!' : 'Checkmate!'}</div>
      </div>
    </div>
  )
}

export default CheckModal