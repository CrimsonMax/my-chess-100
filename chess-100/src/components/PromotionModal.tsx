import { FC } from 'react'
import { Cell } from '../models/Cell'
import { Colors } from '../models/Colors'

interface Promo {
  color: string
  // cell: Cell
  active: boolean
}

const PromotionModal: FC<Promo> = ({ active, color }) => {
  return (
    <div className={active ? 'promo-modal active' : 'promo-modal'}>
      <div className="promo-background"></div>
      <div className="promo-container">
        <div className="promo-title">Choose new Figure:</div>
        <div className="promo-select">
          <div className={color === Colors.WHITE ? 'cell blank queen white' : 'cell blank queen black'}></div>
          <div className={color === Colors.WHITE ? 'cell blank rook white' : 'cell blank rook black'}></div>
          <div className={color === Colors.WHITE ? 'cell blank knight white' : 'cell blank knight black'}></div>
          <div className={color === Colors.WHITE ? 'cell blank archer white' : 'cell blank archer black'}></div>
          <div className={color === Colors.WHITE ? 'cell blank bishop white' : 'cell blank bishop black'}></div>
        </div>
      </div>
    </div>
  )
}

export default PromotionModal