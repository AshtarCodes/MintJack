import React,{useState,useEffect,useCallback, useContext} from 'react'
import { UserContext } from '../Context/UserContext'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import Game from './Game'

// fetch the deck and pass it down as a prop to the game component
const BlackjackTable = () => {
    const [deckId,setDeckId] = useState('')

    const {loggedInUserContext, setLoggedInUserContext} = useContext(UserContext)

    const fetchDeck = useCallback(async() => {
      let res = await axios.get('https://deckofcardsapi.com/api/deck/new/')
      setDeckId(res.data.deck_id)
      
    },[]) 
  
    useEffect(() => {
      axios.get('http://localhost:3000/loggedInUser')
      .then(res => {
          console.log(res.data)
          if(Object.keys(res.data).length > 0){
              setLoggedInUserContext(true)
          }
      })
      fetchDeck()
    },[fetchDeck])

    const logout = () =>{
      axios.get('http://localhost:3000/logout')
      .then(res => {
        setLoggedInUserContext(false)
      })
    }
    
    if(loggedInUserContext){
      return (
        <div>
          <h1>MintJack</h1>
          <button onClick={logout}>Log out</button>
          <Game deckId={deckId}/>
        </div>
      )
    } else{
      return(
        <Redirect to='/' />
      )
    }

    
}

// const styles = {
//     container:{
//         flex:1,
//         backgroundColor:'grey'
//     }
// }
export default BlackjackTable;
