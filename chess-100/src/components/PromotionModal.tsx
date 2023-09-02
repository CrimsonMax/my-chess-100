import { FC } from 'react'
import { Cell } from '../models/Cell'
import { Colors } from '../models/Colors'
import { FigureNames } from '../models/figures/Figure'
import { Queen } from '../models/figures/Queen'
import { Rook } from '../models/figures/Rook'
import { Knight } from '../models/figures/Knight'
import { Archer } from '../models/figures/Archer'
import { Bishop } from '../models/figures/Bishop'

interface Promo {
  active: boolean
  setActive: (isActive: boolean) => void
  color: Colors
  target: Cell | null
  startCell: Cell | null
}

const PromotionModal: FC<Promo> = ({ active, setActive, color, target, startCell }) => {
  function setPromoFigure(name: string) {
    if (target === null || startCell === null) return

    switch (name) {
      case FigureNames.QUEEN:
        new Queen(color, startCell)
        break;
    
      case FigureNames.ROOK:
        new Rook(color, startCell)
        break;
    
      case FigureNames.KNIGHT:
        new Knight(color, startCell)
        break;
    
      case FigureNames.ARCHER:
        new Archer(color, startCell)
        break;
    
      case FigureNames.BISHOP:
        new Bishop(color, startCell)
        break;
    
      default:
        break;
    }

    startCell.moveFigure(target)

    setActive(false)
  }

  /* set red cells */
  
  return (
    <div className={active ? 'promo-modal active' : 'promo-modal'}>
      <div className="promo-background"></div>
      <div className="promo-container">
        <div className="promo-title">Choose new Figure:</div>
        <div className="promo-select">
          <div
            className={color === Colors.WHITE ? 'cell blank queen white' : 'cell blank queen black'}
            onClick={() => setPromoFigure(FigureNames.QUEEN)}
          ></div>
          <div
            className={color === Colors.WHITE ? 'cell blank rook white' : 'cell blank rook black'}
            onClick={() => setPromoFigure(FigureNames.ROOK)}
          ></div>
          <div
            className={color === Colors.WHITE ? 'cell blank knight white' : 'cell blank knight black'}
            onClick={() => setPromoFigure(FigureNames.KNIGHT)}
          ></div>
          <div
            className={color === Colors.WHITE ? 'cell blank archer white' : 'cell blank archer black'}
            onClick={() => setPromoFigure(FigureNames.ARCHER)}
          ></div>
          <div
            className={color === Colors.WHITE ? 'cell blank bishop white' : 'cell blank bishop black'}
            onClick={() => setPromoFigure(FigureNames.BISHOP)}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default PromotionModal