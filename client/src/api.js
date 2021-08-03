import axios from "axios";

class DeckAPI {
    static async drawCard(deckId,numOfCards=1){
            try {
                const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numOfCards}`)
                console.log(res.data.cards)
            return res.data  
            } catch (err) {
                console.error(err)
            }                    
    }
    static async drawOne(deckId){
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        console.log(res.data.cards[0])
        return res.data.cards[0]

    }
    
    
}

export default DeckAPI;