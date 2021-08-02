import React, {useState,useEffect,useCallback} from 'react'
import DeckAPI from '../api'
import PlayerHand from './PlayerHand'
import DealerHand from './DealerHand'
import {initializeCardData} from '../helpers'

function Game({deckId}) {
    // keeping track of the player hands once they are finished with their turn 
    const [finalPlayerValue,setFinalPlayerValue] = useState(0)
    const [finalDealerValue,setFinalDealerValue] = useState(0)
    // handle load
    const [loadingCards,setIsLoadingCards] = useState(false)
    // adds the value of they playersHand to the queue when they hit/bust/get to 21 , these values should be passed down to the dealer 
    const trackPlayerValue = (val) => {
        setFinalPlayerValue(val)
    }
    // update the dealer value once the dealer is done hitting, if this triggers then we run the evaluation 
    const trackDealerValue = (val) => {
        setFinalDealerValue(val)
    }
    
    const [playerState, setPlayerState] = useState([])
    const [dealerState, setDealerState] = useState([])

    const handleSetup = useCallback(async(deckId,players) => {
        const res = await DeckAPI.drawCard(deckId,(4))
        let cardsArr = (res.cards)
        let initialDraw = initializeCardData(cardsArr,players)
        setPlayerState([...initialDraw[1][0]])
        setDealerState([...initialDraw[0]])
        setIsLoadingCards(true)
    },[])

    useEffect(() => {
        // console.log('running useeffect in the game component to eval player vs dealer')
        if(finalDealerValue && finalPlayerValue){
            if(finalDealerValue > finalPlayerValue){
                console.log('Dealer Wins')
            }else if(finalDealerValue < finalPlayerValue){
                console.log('Player Wins')
            }else{
                console.log('Tie!')
            }
        }
    }, [finalDealerValue])

    // console.log(dealerState)
    return (
        !loadingCards ? 
        <div>
            <p>Loading</p>
            <button onClick={() => handleSetup(deckId,1)}>Start Game</button>
        </div>
        
        :
        <div style={styles.game}>
            <p>This is our Game component</p>
            {/* <button onClick={() => handleSetup(deckId,1)}>Start Game</button> */}
            <div style={{backgroundColor: 'blue'}}>
            <h2 style={{color:'white'}}>Final Player Value</h2>
            <p style={{fontSize:'32px'}}>{finalPlayerValue}</p>
            </div>
            <div style={{backgroundColor: 'red'}}>
            <h2 style={{color:'white'}}>Final Dealer Value</h2>
            <p style={{fontSize:'32px'}}>{finalDealerValue}</p>
            </div>
            
            <DealerHand initialCards={dealerState} finalPlayerValue={finalPlayerValue} trackDealerValue={trackDealerValue} deck={deckId}/>
            {/* console.log(playerStart) */}
            <p>{playerState.length}</p>

            {/* card objects need to be passed down, and number values handled in the reduce. This will allow robust handling of the ace.*/}
            <PlayerHand initialCards={playerState} trackPlayerValue={trackPlayerValue} deck={deckId}/>

            
            
        </div>
    )
}

const styles = {
    game:{
        backgroundColor:'green',
        fontSize:'36px'
    }
}

export default Game

// load a game with the
/*
const PlayerContext = React.createContext({});

// immer
import produce from "immer";

const PlayerProvider = ({ children, deckId }) => {
    const [playerState, setPlayerState] = useState({
        players: [],
        round: 0,
        turn: 0,
    });

    const createPlayer = useContext((hand) => {}, [deckId]);
    const draw = useContext((playerIndex) => {
        const card = await deckAPI.get(deckId, 'draw');
        // without immer
        // setPlayerState(play => {
        //    const _p = [...players];
        //    return { ...play, players: _p.splice(playerIndex, 1, {..._p[playerIndex], hand: }) }
        // });
        // with immer
        socket.send('draw', { player, card });
        setPlayerState(produce(play => {
            play.players[playerIndex].hand.push(card);
        }))
    }, [deckId]);


    return (
        <Player.Provider value={{ playerState, setPlayerState }}>
            {children}
        </Player.Provider>
    )
}

const { playerState: { players }, setPlayerState  } = React.useContext(PlayerContext);

<PlayerProvider deckId={}>
    <Game />
</PlayerProvider>
*/
/**
  // context
  players: Players[]
  round: numbers
  turn: round % players.length // 0, 1, 2
  Player {
    hand: { card: card_id, value: number },
    money: number,
    isDealer: boolean
  }
 */
