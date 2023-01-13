var currentlyTrump;

var recentQuotes = [];

//globals for handling timer
const timeLimit = 10;
var timer;
var time;
var timeOutput = document.getElementById('time');

//stats this session
var stats = {
    streak:0,
    correct:0,
    incorrect:0,
    timedout:0
}
var sessionStats = document.getElementById('session-stats');

//local storage stats
var statsOnLoad = localStorage.getItem('woq_stats_trumpye');
if(statsOnLoad === null) {
    statsOnLoad = {
        correct:0,
        incorrect:0,
        maxstreak:0,
        timedout:0
    }
}

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
            RecentQuote(data.value);
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

function RecentQuote(content) {
    recentQuotes.push(content);
    if(recentQuotes.length > 10) {
        recentQuotes.splice(0, 1);
    }
}

//user guessed trump
function trump() {
    if(currentlyTrump) {
        Win();
    } else {
        Lose(false);
    }
}

//user guessed ye
function ye() {
    if(!currentlyTrump) {
        Win();
    } else {
        Lose(false);
    }
}

function Win() {
    stats.correct++;
    stats.streak++;
    SaveStats();
    clearInterval(timer);
    HideDisplay(false, true, false, true);
    UpdateSessionStats();
}
function Lose(lostbytime) {
    stats.incorrect++;
    stats.streak = 0;
    if(lostbytime) {
        stats.timedout++;
    }
    SaveStats();
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
            Lose(true);
        }
    }, 1000);
}

function UpdateSessionStats() {
    sessionStats.textContent = stats.correct + " / " + (stats.correct + stats.incorrect);
    document.getElementById('streak').textContent = stats.streak;
}

function SaveStats() {
    var newStats = {c:0,i:0,s:0,t:0};
    newStats.c = statsOnLoad.correct + stats.correct;
    newStats.i = statsOnLoad.incorrect + stats.incorrect;
    newStats.s = Math.max(statsOnLoad.maxstreak,stats.streak);
    newStats.t = statsOnLoad.timedout + stats.timedout;
    localStorage.setItem('woq_stats_trumpye', JSON.stringify(newStats));
}

//Initialize page
HideDisplay(false, false, false, true);