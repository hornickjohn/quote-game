var currentlyTrump;

//globals for handling timer
const timeLimit = 10;
var timer;
var time;
var timeOutput = document.getElementById('time');

//stats this session
var stats = {
    streak:0,
    correct:0,
    incorrect:0
}
var sessionStats = document.getElementById('session-stats');

//navigates to home page
function quit() {
    location.href="index.html";
}

function startGame() {
    HideDisplay(true, false, false, false);
    UpdateTimer();

    if(Math.random() >= 0.5) {
        //USING TRUMP QUOTE
        currentlyTrump = true;
        
        fetch('https://tronalddump.io/random/quote')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("quote-output").textContent = data.value;
        });
    } else {
        //USING YE QUOTE
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

//user guessed trump
function trump() {
    if(currentlyTrump) {
        Win();
    } else {
        Lose();
    }
}

//user guessed ye
function ye() {
    if(!currentlyTrump) {
        Win();
    } else {
        Lose();
    }
}

function Win() {
    stats.correct++;
    stats.streak++;
    clearInterval(timer);
    HideDisplay(false, true, false, true);
    UpdateSessionStats();
}
function Lose() {
    stats.incorrect++;
    stats.streak = 0;
    clearInterval(timer);
    HideDisplay(false, false, true, true);
    UpdateSessionStats();
}

function HideDisplay(showAnswers, showWon, showLost, showStart) {
    if(showAnswers) {
        document.getElementById('answer-buttons').classList.remove('hidden');    
    } else {
        document.getElementById('answer-buttons').classList.add('hidden');
    }
    if(showWon) {
        document.getElementById('winner').classList.remove('hidden');  
    } else {
        document.getElementById('winner').classList.add('hidden');
    }
    if(showLost) {
        document.getElementById('loser').classList.remove('hidden');
    } else {
        document.getElementById('loser').classList.add('hidden');
    }
    if(showStart) {
        document.getElementById('start').classList.remove('hidden');
    } else {
        document.getElementById('start').classList.add('hidden');
    }
}

function UpdateTimer() {
    clearInterval(timer);
    time = timeLimit;
    timeOutput.textContent = time;
    timer = setInterval(function () {
        --time;
        timeOutput.textContent = time;
        if(time <= 0) {
            clearInterval(timer);
            Lose();
        }
    }, 1000);
}

function UpdateSessionStats() {
    sessionStats.textContent = stats.correct + " / " + (stats.correct + stats.incorrect);
    document.getElementById('streak').textContent = stats.streak;
}

//Initialize page
HideDisplay(false, false, false, true);