import { FC } from 'react'
import { Figure } from "../models/figures/Figure"

interface LostFiguresProps {
  title: string
  figures: Figure[]
  player: string
}

const LostFigures: FC<LostFiguresProps> = ({ title, figures, player }) => {
  return (
    <div className={`graveyard ${player}`}>
      <h3>{title}</h3>
      {figures.sort((a,b) => a.strength - b.strength).map(figure => (
        <div key={figure.id} className='rip'>
          {figure.logo && <img height={20} width={20} src={figure.logo} alt={`${figure.color} ${figure.name}`} />}
        </div>
      ))}
    </div>
  )
}

export default LostFigures