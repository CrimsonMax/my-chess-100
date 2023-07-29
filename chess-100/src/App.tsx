import { useEffect, useState } from 'react';
import './App.css';
import BoardComponent from './components/BoardComponent';
import { Board } from './models/Board';
import { Player } from './models/Player';
import { Colors } from './models/Colors';
import LostFigures from './components/lostFigures';
import Timer from './components/Timer';
import PromotionModal from './components/PromotionModal';
import { Cell } from './models/Cell';

function App() {
  const [board, setBoard] = useState(new Board())
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE))
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK))
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [promoActive, setPromoActive] = useState(false)
  const [promoColor, setPromoColor] = useState(Colors.WHITE)
  // const [promoTarget, setPromoTarget] = useState()

  useEffect(() => {
    restart()
  }, [])

  function restart() {
    const newBoard = new Board()

    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setCurrentPlayer(whitePlayer)
  }

  function swapPlayer() {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)
  }

  function thePromotion(active: boolean, color: Colors) {
    setPromoActive(active)
    setPromoColor(color)
  }

  return (
    <div className="App">
      {/* <Timer restart={restart} currentPlayer={currentPlayer}/> */}
      
      <BoardComponent
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        thePromotion = {thePromotion}
      />

      <div>
        <LostFigures title='White Army' figures={board.lostWhiteFigures}/>
        <LostFigures title='Black Army' figures={board.lostBlackFigures}/>
      </div>

      <PromotionModal active={promoActive} color={promoColor} />
    </div>
  );
}

export default App;
