// SCROLL TO BOTTOM TO SEE HOW EVERTHING WORKS

const hours = document.querySelector('[hours]') as HTMLElement
const minutes = document.querySelector('[minutes]') as HTMLElement
const seconds = document.querySelector('[seconds]') as HTMLElement

const match = document.querySelector('[match]') as HTMLElement
const playground = document.querySelector('[playground]') as HTMLElement
const popup = document.querySelector('[popup]') as HTMLElement
const popupTime = document.querySelector('[popup-time]') as HTMLElement
const playAgainBtn = document.querySelector('[play-again]') as HTMLButtonElement

const emojisData = [
    {name:'fire', emoji:'🔥'},
    {name:'fire', emoji:'🔥'},
    
    {name:'heart-break', emoji:'💔'},
    {name:'heart-break', emoji:'💔'},
    
    {name:'crown', emoji:'👑'},
    {name:'crown', emoji:'👑'},

    {name:'lips', emoji:'💋'},
    {name:'lips', emoji:'💋'},

    {name:'100', emoji:'💯'},
    {name:'100', emoji:'💯'},

    {name:'thumbs-up', emoji:'👍'},
    {name:'thumbs-up', emoji:'👍'},

    {name:'laugh', emoji:'🤣'},
    {name:'laugh', emoji:'🤣'},

    {name:'please', emoji:'🤗'},
    {name:'please', emoji:'🤗'},
]


let temporayChosen:string[] = [] //stores what the user selects
let cardsGottenRight:string[] = [] //all the ids the user has gotten correct
let acceptUserNextInput:boolean = true //if false user next input will not be taken into account

let timer:any; //the timer function
let secondsCount:number = 0; //seconds count when user is playing


// run at start up
startUp()

// the popup button
playAgainBtn.addEventListener('click', startUp)

// resets everything in the game
function startUp(){
    secondsCount = 0
    temporayChosen = []
    cardsGottenRight = []
    displayCards()
    hideElement(popup)
    match.style.opacity = '0'
    timer = setInterval(timeCount, 1000)
    
}

function displayCards(){
    playground.innerHTML = '' // removers all the cards
    emojisData.sort(() => Math.random() - 0.5).forEach((el, index)=>{ //shuffle the emojis data and display
        let card = document.createElement('div')
        card.classList.add('card')
        card.textContent = '?'
        card.setAttribute('data-id', index.toString())
        card.setAttribute('card', '')
        card.addEventListener('click', cardClick)
        playground.append(card)
    })
}

function cardClick(this:HTMLElement){
    if(acceptUserNextInput === false) return //restricts the user clicking more than expected

    let dataId = this.getAttribute('data-id') //get the data-id of the clicked card
    if(typeof(dataId) === 'string'){ //typescript insist
        temporayChosen.push(dataId)
        let intDataId = parseInt(dataId) //typescript insist
        this.textContent = emojisData[intDataId].emoji //show the corressponding emoji in the dom
    }

    if(temporayChosen.length === 2) {
        acceptUserNextInput = false //user cant choose any card during this process. process ends at displayCardsGottenRight func
        checkForMatch()
    }
}

function checkForMatch(){
    if(emojisData[parseInt(temporayChosen[0])].name === emojisData[parseInt(temporayChosen[1])].name){
        // add them to the right cards and make the match text visible
        temporayChosen.forEach(id => cardsGottenRight.push(id))
        
        if(cardsGottenRight.length === emojisData.length){ //all cards have been selected
            popupTime.textContent = `${hours.textContent}:${minutes.textContent}:${seconds.textContent}`
            clearInterval(timer)
            showElement(popup, 'flex')
        }   
        
        match.style.opacity = '1' //make the match text visible
        setTimeout(()=>{
            match.style.opacity = '0'
        },1000)
    }
    temporayChosen = []
    displayCardsGottenRight()
}

function displayCardsGottenRight(){
    let cardsInDom = document.querySelectorAll('[card]')
    setTimeout(()=>{
        // get the data-id's and place their content with the correspnding emojis data value
        for (let index = 0; index < cardsInDom.length; index++){
            let cardDataId = cardsInDom[index].getAttribute('data-id')
            if(cardsGottenRight.some(crd => crd === cardDataId)){
                cardsInDom[index].textContent = emojisData[index].emoji
            }else{
                cardsInDom[index].innerHTML = '?'
            }
        }
        acceptUserNextInput = true //user can now choose
    },1000)
}

// count up timer
function timeCount(){
    ++secondsCount;
    let hr = Math.floor(secondsCount / 3600)
    let min = Math.floor((secondsCount - hr*3600) / 60)
    let secs = secondsCount - (hr*360 + min*60)
    seconds.textContent = secs.toString()
    minutes.textContent = min.toString()
    hours.textContent = hr.toString()
}

// Heplpers
// hides a showing element in the DOM
function hideElement(domElement:HTMLElement | null){
    if(domElement) return domElement.style.display = "none"
    return null
}
// shows a hidden element in a DOM
function showElement(domElement:HTMLElement | null, property:string){
    if(domElement)return domElement.style.display = property
    return null
}

// HOW IT WORKS
// 1. Each time the user clicks on a card, we push the card's data-id to temporaryChosen.
// 2. Once the temporaryChosen's length becoms 2, we run the checkMatch funtion.
// 3. In the checkMatch function, we use each of the data-ids in the temporary chosen to check
    // wheather their corresponding names match. Example is shown below
    //eg => emojiData[temporayChosen[0]].name === emojiData[temporayChosen[1]].name
// 4. if the checkMatch func return true, we the push those data-id to cardsGottenRight.
    // we then clear the temporayChosen and we wait for the user next input.
// 5. we run the isplayCardsGottenRight func
//6. In the displayCardsGottenRight func, we check the id's of each item stored in cardsGottenRight and match
    // with the cards in the dom. if their id match, we compare both their emojis to that of the emojiData
// 7. if the match, we replace the "?" in the dom with their matched emoji

// P.S: i got tired explaing how it works especially from lne 6.