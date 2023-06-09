import { FC } from 'react'
import { Figure } from "../models/figures/Figure"

interface LostFiguresProps {
  title: string
  figures: Figure[]
}

const LostFigures: FC<LostFiguresProps> = ({ title, figures }) => {
  return (
    <div className='graveyard'>
      <h3>{title}</h3>
      {figures.map(figure => (
        <div key={figure.id}>
          {figure.name} {figure.logo && <img height={20} width={20} src={figure.logo} />}
        </div>
      ))}
    </div>
  )
}

export default LostFigures