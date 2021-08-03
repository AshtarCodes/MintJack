import React,{useState,useEffect,useCallback} from 'react'
import DeckAPI from '../api'
import { parseCardValue } from '../helpers'
import Card from './Card'

const DealerHand = ({deck,initialCards,finalPlayerValue,trackDealerValue}) => {
    const [loadedCards,setLoadedCards] = useState(false)
    const [dealerValue,setDealerValue] = useState(0)
    const [currentCards,setCurrentCards] = useState([])
    
    const drawCard = async () => {
        try {
            const res = await DeckAPI.drawCard(deck)
            let cardData = res.cards[0] // one card {...} 
            console.log(cardData,'cardData')
            return cardData;            
        } catch (e) {
            console.log('cardError')
            console.error(e)
        }
    }
    const handleHit = async() => {
        // console.log(initialCards) // [{...},{...}]
        
        const nextCard = await drawCard();      
        console.log('next card: ',nextCard)
        setCurrentCards([...currentCards,nextCard]) /// All cards in player hand: [{...},{...}]

        let nextCardValue = parseCardValue(nextCard.value) //  Value of next card, NOT initial card values: 11       

        // console.log('all aces: ',numOfAces(),' initial aces: ',numOfInitialAces())

        // TODO: resolve edge case of if there are two initial aces, and a hit results in > 21, or if there are 3+ aces in a hand
        setDealerValue((prev) => {
            let current;
            if((hasAce() || nextCard.value === 'ACE') && (prev + nextCardValue) > 21){
                //distinguish between initial ace and next card ace
                let aceCase = 1;
                // if initial ace, and next Ace
                if(hasInitialAce() && nextCard.value === 'ACE'){
                    if ((prev + aceCase) > 21){ // make both aces value of one
                        current = prev + aceCase - 10
                        tagAnAce()
                        tagAnAce()
                    } else { // make next ace value of one
                        current = prev + aceCase
                        tagAnAce()
                    }

                // if no initial ace and next is ace
                } else if ((!hasInitialAce()) && nextCard.value === 'ACE'){
                    current = prev + aceCase; // make next ace value of one
                    tagAnAce()
                // if initial ace and no next ace
                } else if (hasInitialAce() && nextCard.value !== 'ACE'){
                    current = prev + nextCardValue - (10 * numOfUntaggedAces()) // make an initial ace value of one
                    tagAnAce()
                }
            } else {
                current = prev + nextCardValue
            }
            return current;
        })

        


        // check if hand has an ace, and return num of aces if yes
        function numOfAces () {           
               
                return currentCards.reduce((acc,{value}) => {
                    if (value === 'ACE'){
                        acc++
                    }
                    return acc;
                } ,0)            
        }
        function hasAce () {
            return currentCards.some(card => card.value === "ACE");
        }

        function hasInitialAce () {
            return initialCards.some(card => card.value === "ACE")
        }
        function numOfInitialAces(params) {
            
                return initialCards.reduce((acc,{value}) => {
                    if (value === 'ACE'){
                        acc++
                    }
                    return acc;
                } ,0) 
        }
        function tagAnAce () {
            let nextAce = currentCards.find(card => card.value === 'ACE')
            if (nextAce) nextAce.found = true;            
        }
        function untagAnAce () {
            let nextAce = currentCards.find(card => card.value === 'ACE')
            if (nextAce) nextAce.found = false;  
        }
        function numOfUntaggedAces () {
            if (numOfAces() === numOfInitialAces()){ // if state has actually updated
                if (currentCards.some(card => card.value === "ACE" && !card.found)){
                    return currentCards.reduce((acc,{value, found}) => {
                        if (value === 'ACE' && !found){
                            acc++
                        }
                        return acc;
                    } ,0)
                }
            } else {
                if ( initialCards.some(card => card.value === "ACE" && !card.found) || currentCards.some(card => card.value === "ACE" && !card.found)){
                    let current = currentCards.reduce((acc,{value, found}) => {
                        if (value === 'ACE' && !found){
                            acc++
                        }
                        return acc;
                    } ,0)
                    let initial = initialCards.reduce((acc,{value, found}) => {
                        if (value === 'ACE' && !found){
                            acc++
                        }
                        return acc;
                    } ,0)
                    return current + initial;
                }
            }
            return 0;
        }

    }


    const loadCards = useCallback(() => {
        let val = initialCards.reduce((a,c) => a + parseCardValue(c.value),0)
        setDealerValue(val)
        setCurrentCards(initialCards)
    },[])
    useEffect(() => {
        loadCards()
        setLoadedCards(true)
    },[])

    
    // if playervalue changes, check for player win condition
    // if they win, call a function which draws until dealer hits their value condition
    // when there is a final dealer value, then compare playerValue and DealeraValue to handle final win and payouts
    // useEffect(() => {
    //     //TODO: disable user actions on win or bust
    //     checkWin(finalPlayerValue)
    //     function checkWin (playerValue) {
    //         if (playerValue > 21){
    //             alert('You busted!')
    //             console.log('busted!')
    //             handleHit()
                
    //         } else if (playerValue === 21) {
    //             alert('21!')
    //             console.log('21!')
    //             handlehit()
    //         } else {
    //             handleHit()
    //         }
    //     }
        
    // },[finalPlayerValue])
    // if a dealer value is under 17 then we hit 
    // const handleFinal = useCallback(async() => {
    //     console.log(dealerValue,'dealerValue in Dealerhand')
    //     checkDealer(dealerValue)
    //     function checkDealer(dealerValue){
    //         if(dealerValue && dealerValue < 17){
    //         handleHit()
    //         }
    //     }
    // },[])
    
    useEffect(() => {
        if (finalPlayerValue && dealerValue < 17){
            checkDealer(dealerValue)

            function checkDealer(dealerValue){
                if(dealerValue && dealerValue < 17){
                handleHit()
                }
            }
        } else if(dealerValue >= 17) {
            trackDealerValue(dealerValue)
        }
        
    }, [dealerValue,finalPlayerValue])

    return (
        !loadedCards ? 
        <p>Loading</p>
        :
        <div>
            <h2>Dealer</h2> 
            {/* <p>Dealer Score</p> */}
            {/* <p>{dealerValue}</p> */}
            {/* <button onClick={handleHit}>Hit Dealer</button> */}
            {currentCards.map((card) => {
                return <Card key={card.code} cardName={card.code} cardImg={card.image}/>
            })}
        </div>
    )
}

export default DealerHand