const gridContainer = document.getElementById("grid");
const play = document.getElementById("play");
const rows = [4];
const columns = [16];
let gridArray = Array.from({ length: rows }, () => Array(columns).fill(null)); // Initialize empty 2D array 
let drumArray = [];
let loopPlaying = false;

function generateGrid(){
    for(let i = 0; i < rows; i++){
        for(let j = 0 ; j < columns; j++){
        const index = i * columns + j + 1; // Convert row/col into 1D index
        const button = document.createElement("button");
        button.classList.add("grid-item");

        if(index <= 16){
            button.textContent ="kick"
            button.dataset.type = "kick";
        } else if(index >= 16 && index <= 32){
            button.textContent ="claps";
            button.dataset.type = "clap";
        } else if(index > 32 && index <= 48){
            button.textContent ="hat";
            button.dataset.type = "closed_hat";
        } else if(index > 48 && index <= 64){
            button.textContent ="open hat";
            button.dataset.type = "open hat";
        };
    
        if((j + 1) % 4 === 0){
            button.classList.add("gap-right"); // Adds a margin to the right after every 4th beat
        };

        button.dataset.index = index - 1;
        drumArray.push(index - 1);
        button.value = "inactive"; // Apply Inactive Default State
     
        gridArray[i][j] = button.value; // Convert row/col into 2D Array
        gridContainer.appendChild(button); // Append Div to Container
        }
    };
    console.log(gridArray);
    console.log(drumArray);
};

generateGrid();

const buttons = document.querySelectorAll("#grid button");

buttons.forEach((button, buttonIndex) => {
    button.addEventListener('click', (e) =>{
        const row = Math.floor(buttonIndex / columns);  // Select correct row
        const col = buttonIndex % columns; // Select correct column
        if (button.value === "inactive"){
            button.value = "active";
            button.classList.add("activeState");
            gridArray[row][col] = "active";
        } else {
            button.value = "inactive";
            button.classList.remove("activeState");
            gridArray[row][col] = "inactive";
        }

        console.log(button.textContent + " is " + button.value + " "+ buttonIndex);
        console.log(gridArray); // Doesnt add the value to the original array 
    })
});
let intervalid 

function playLoop(){
    let currentColumn = 0;
    let interval = 115;
    // if(loopPlaying === true){
    //     loopPlaying = false;
    //     return
    // }
 
    function firstColumn(){
        if(currentColumn >= columns){
            return;
        }

        buttons.forEach(button => button.classList.remove("highlighted"));

        for (let i = 0; i < rows; i++){
            console.log(`row ${i}, Column ${currentColumn} → ${gridArray[i][currentColumn]}`);
            let buttonIndex = i * columns + currentColumn;  // Find buttonIndex from 2D array 
            buttons[buttonIndex].classList.add("highlighted");
            // Play Kick
            if (buttons[buttonIndex].dataset.type === "kick" && buttons[buttonIndex].value === "active"){
                console.log("play kick");
                playKick()
            } else if(buttons[buttonIndex].dataset.type === "closed_hat" && buttons[buttonIndex].value === "active"){
                console.log("play kick");
                playClosedHat()
            } else if(buttons[buttonIndex].dataset.type === "clap" && buttons[buttonIndex].value === "active"){
                console.log("play kick");
                playClap()
            }
        };
            console.log("looped through "+ currentColumn + " beat");
            currentColumn++;   
            loopPlaying = true;
    }

    firstColumn(); // Call immediately so as to avoid delay at end of loop

    intervalid = setInterval(() => {
        if(currentColumn >= columns){
            clearInterval(intervalid);
            console.log("Finished loop");
            playLoop();
            return;
        }

        firstColumn();

    }, interval); // Only call interval once the first column has been proccessed
};

// Need a function to pause the loop 

play.addEventListener('click', (e) =>{
    clearInterval(intervalid);
    currentColumn = 0;
    playLoop();
});


// const kick = new Audio("kick.wav");
// const closedHat = new Audio("kick.wav");
// const clap = new Audio("clap.wav");

// function playKick(){
//     kick.volume = 0.4;
//     kick.play();
// }


let kickBuffer = null;
let closedhatBuffer = null;
let clapBuffer = null;
const kick = new (window.AudioContext || window.webkitAudioContext)();
const closedHat = new (window.AudioContext || window.webkitAudioContext)();
const clap = new (window.AudioContext || window.webkitAudioContext)();

fetch("kick.wav")
    .then(response =>response.arrayBuffer())
    .then(arrayBuffer => kick.decodeAudioData(arrayBuffer))
    .then(decodeBuffer => {
        kickBuffer = decodeBuffer
})
    .catch(e=> console.error(e))

fetch("closed_hat.wav")
    .then(response =>response.arrayBuffer())
    .then(arrayBuffer => closedHat.decodeAudioData(arrayBuffer))
    .then(decodeBuffer => {
        closedhatBuffer = decodeBuffer
})
    .catch(e=> console.error(e))

fetch("clap.wav")
    .then(response =>response.arrayBuffer())
    .then(arrayBuffer => clap.decodeAudioData(arrayBuffer))
    .then(decodeBuffer => {
        clapBuffer = decodeBuffer
})
    .catch(e=> console.error(e))
    
let lastSoundTime = 0;

function playKick(){
    const now = Date.now();
    if(now - lastSoundTime < 100) return;
    lastSoundTime
    if(!kickBuffer) return; // Ensure the sound is loaded
    const kickSource = kick.createBufferSource();
    kickSource.buffer = kickBuffer;
    const gainNodeKick = kick.createGain();
    gainNodeKick.gain.setValueAtTime(0.10, kick.currentTime); 
    gainNodeKick.gain.linearRampToValueAtTime(0.2, kick.currentTime + 0.05);
    kickSource.connect(gainNodeKick);
    gainNodeKick.connect(kick.destination);
    kickSource.start();
};

function playClosedHat(){
    const now = Date.now();
    if(now - lastSoundTime < 100) return;
    lastSoundTime
    if(!closedhatBuffer) return; // Ensure the sound is loaded
    const closedHatSource = closedHat.createBufferSource();
    closedHatSource.buffer = closedhatBuffer;
    const gainNodeClosedHat = closedHat.createGain();
    gainNodeClosedHat.gain.setValueAtTime(0.05, closedHat.currentTime); 
    gainNodeClosedHat.gain.linearRampToValueAtTime(0.0 1, closedHat.currentTime + 0.05);
    closedHatSource.connect(gainNodeClosedHat);
    gainNodeClosedHat.connect(closedHat.destination);
    closedHatSource.start();
};

function playClap(){
    const now = Date.now();
    if(now - lastSoundTime < 100) return;
    lastSoundTime
    if(!clapBuffer) return; // Ensure the sound is loaded
    const clapSource = clap.createBufferSource();
    clapSource.buffer = clapBuffer;
    const gainNodeClap = clap.createGain();
    gainNodeClap.gain.setValueAtTime(0.10, clap.currentTime); 
    gainNodeClap.gain.linearRampToValueAtTime(0.2, clap.currentTime + 0.05);
    clapSource.connect(gainNodeClap);
    gainNodeClap.connect(clap.destination);
    clapSource.start();
};