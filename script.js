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
            button.textContent ="snare";
            button.dataset.type = "snare";
        } else if(index > 32 && index <= 48){
            button.textContent ="hat";
            button.dataset.type = "hat";
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
    let interval = 200;
    if(loopPlaying === true){
        loopPlaying = false;
        return
    }
 
    function firstColumn(){
        if(currentColumn >= columns){
            return;
        }

        buttons.forEach(button => button.classList.remove("highlighted"));

        for (let i = 0; i < rows; i++){
            console.log(`row ${i}, Column ${currentColumn} → ${gridArray[i][currentColumn]}`);
            let buttonIndex = i * columns + currentColumn;  // Find buttonIndex from 2D array 
            buttons[buttonIndex].classList.add("highlighted");
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

play.addEventListener('click', (e) =>{
    clearInterval(intervalid);
    currentColumn = 0;
    playLoop();
});