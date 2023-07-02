import { FC, useState, useRef, useEffect } from 'react'
import { Player } from "../models/Player"
import { Colors } from '../models/Colors'

interface TimerProps {
  currentPlayer: Player | null
  restart: () => void
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
  const [whiteTime, setWhiteTime] = useState(300)
  const [blackTime, setBlackTime] = useState(300)
  const [game, setGame] = useState(false)

  const timer = useRef<null | ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (game) startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleRestartTime, currentPlayer])
  
  function minusWhiteTime() {
    setWhiteTime(prev => prev - 1)
  }

  function minusBlackTime() {
    setBlackTime(prev => prev - 1)
  }

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current)
    }

    const callback = currentPlayer?.color === Colors.WHITE ? minusWhiteTime : minusBlackTime
    
    timer.current = setInterval(callback, 1000)
  }

  function handleRestartTime() {
    setGame(true)
    setWhiteTime(300)
    setBlackTime(300)
    restart()
  }
  
  return (
    <div>
      <div>
        <button onClick={handleRestartTime}>
          New Game Start
        </button>
      </div>
      <h2>White - {whiteTime}</h2>
      <h2>Black - {blackTime}</h2>
    </div>
  )
}

export default Timer