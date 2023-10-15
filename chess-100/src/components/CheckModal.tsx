import { FC } from 'react'

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