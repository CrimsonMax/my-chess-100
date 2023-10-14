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
import CheckModal from './components/CheckModal';

export interface PromoModal {
  active: boolean
  color: Colors
  startCell: Cell
  promoCell: Cell
}

// export interface CheckModal {
//   check: boolean
//   checkmate: boolean
// }

function App() {
  const [board, setBoard] = useState(new Board())
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE))
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK))
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

  const [promoActive, setPromoActive] = useState<boolean>(false)
  const [promoColor, setPromoColor] = useState(Colors.WHITE)
  const [target, setTarget] = useState<Cell | null>(null)
  const [startCell, setStartCell] = useState<Cell | null>(null)

  const [check, setCheck] = useState<boolean>(false)
  const [checkActive, setCheckActive] = useState<boolean>(false)

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

  function thePromotion(modalParams: PromoModal) {
    setPromoActive(modalParams.active)
    setPromoColor(modalParams.color)
    setStartCell(modalParams.startCell)
    setTarget(modalParams.promoCell)
  }

  function theCheck(check: boolean) {
    setCheck(check)
    setCheckActive(true)
    // setCheckmate(modalParams.checkmate)
  }

  return (
    <div className="App">
      {/* <Timer restart={restart} currentPlayer={currentPlayer}/> */}

      <BoardComponent
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        thePromotion={thePromotion}
        theCheck={theCheck}
      />

      <div className='losses'>
        <LostFigures title='White Losses' figures={board.lostWhiteFigures} player={Colors.BLACK} />
        <LostFigures title='Black Losses' figures={board.lostBlackFigures} player={Colors.WHITE} />
      </div>

      <PromotionModal
        active={promoActive}
        setActive={setPromoActive}
        color={promoColor}
        target={target}
        startCell={startCell}
      />

      <CheckModal
        active={checkActive}
        setActive={setCheckActive}
        check={check}
      />
    </div>
  );
}

export default App;
