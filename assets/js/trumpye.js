var currentlyTrump;

function quit() {
    location.href="index.html";
}

function startGame() {
    document.getElementById('winner').style.display = "none";
    document.getElementById('loser').style.display = "none";

    if(Math.random() >= 0.5) {
        //WE ARE IN TRUMP
        currentlyTrump = true;
        
        fetch('https://tronalddump.io/random/quote')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("quote-output").textContent = data.value;
        });
    } else {
        //WE ARE IN YE
        currentlyTrump = false;

        fetch('https://api.kanye.rest/')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("quote-output").textContent = data.quote;
        });
    }
}

function trump() {
    if(currentlyTrump) {
        Win();
    } else {
        Lose();
    }
}

function ye() {
    if(!currentlyTrump) {
        Win();
    } else {
        Lose();
    }
}

function Win() {
    document.getElementById('winner').style.display = "block";
    document.getElementById('loser').style.display = "none";
}
function Lose() {
    document.getElementById('winner').style.display = "none";
    document.getElementById('loser').style.display = "block";
}