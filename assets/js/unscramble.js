const key = '3c8e64354d489af483aa7662746a4745';

//page elements for game
var scrambledOutput = document.getElementById('scrambled');
var authorOutput = document.getElementById('author');
var input = document.getElementById('input');
var messageOutput = document.getElementById('message');

var recentIDs = [];

//stats this session
var stats = {
    streak:0,
    correct:0,
    incorrect:0
}

//globals for handling timer
const timeLimit = 60;
var timer;
var time;
var timeOutput = document.getElementById('time');

var sessionStats = document.getElementById('session-stats');

var currentAnswer = "";
var currentScramble = [];
var currentScrambleElements;

var statsOnLoad = localStorage.getItem('woq_stats_unscramble');
console.log(statsOnLoad);
if(statsOnLoad === null) {
    statsOnLoad = {
        correct:0,
        incorrect:0,
        maxstreak:0
    }
}

//if enter is pressed and no game is currently in session, start one
document.onkeyup = function(event) {
    if (currentAnswer === "" && event.key === "Enter") {
        StartNew();
    }
};

//listen for typing in textbox, update game accordingly
input.addEventListener('input', function() {
    //do nothing if not in a game
    if(currentAnswer === "") {
        return;
    }

    //clear crossouts
    for(var i = 0; i < currentScrambleElements.length; i++) {
        currentScrambleElements.item(i).style.textDecoration = "none";
    }

    var inputWords = input.value.toLowerCase().split(' ');
    for(var i = 0; i < inputWords.length; i++) {
        for(var j = 0; j < currentScramble.length; j++) {
            if(currentScramble[j] === inputWords[i] && currentScrambleElements[j].style.textDecoration !== "line-through") {
                currentScrambleElements[j].style.textDecoration = "line-through";
                break;
            }
        }
    }

    if(input.value.toLowerCase().includes(currentAnswer.toLowerCase())) {
        Win();
    }
});

function StartNew() {
    fetch('https://favqs.com/api/quotes', {
        method:"GET",
        headers:{
            Authorization: "Token token=" + key
        }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ClearPage();

            //if request error, retry
            if(data.status !== undefined) {
                StartNew();
                return;
            }
            var quote = undefined;
            //get a quote with good data and an appropriate length
            for(var i = 0; i < data.quotes.length; i++) {
                if(!(data.quotes[i].body.toLowerCase().includes('body') || 
                data.quotes[i].body.length < 20 || 
                data.quotes[i].body.length > 100 || 
                recentIDs.includes(data.quotes[i].id) || 
                !IsAcceptableString(data.quotes[i].body))) {
                    quote = data.quotes[i];
                    break;
                }
            }
            //if we failed to find a good quote in data, retry
            if(quote === undefined) {
                StartNew();
                return;
            }

            UpdateTimer();

            //store this as a recent ID so we don't repeat it
            recentIDs.push(quote.id);
            if(recentIDs.length > 10) {
                recentIDs.splice(0,recentIDs.length - 10);
            }

            //scramble words in quote
            var words = quote.body.split(' ');
            var scrambledWords = [];
            while(words.length > 0) {
                var index = Math.floor(Math.random() * words.length);
                scrambledWords.push(words[index]);
                words.splice(index,1);
            }

            currentScramble = [];
            currentAnswer = quote.body;

            //print to page
            for(var i = 0; i < scrambledWords.length; i++) {
                currentScramble.push(scrambledWords[i].toLowerCase());
                var span = document.createElement('span');
                span.classList.add('crossout');
                span.textContent = scrambledWords[i];
                scrambledOutput.append(span);
                scrambledOutput.innerHTML += " ";
            }
            currentScrambleElements = document.getElementsByClassName('crossout');
            authorOutput.textContent = "- " + quote.author;
        });
}

function UpdateTimer() {
    clearInterval(timer);
    time = timeLimit;
    timeOutput.textContent = time;
    timer = setInterval(function () {
        --time;
        timeOutput.textContent = time;
        if(time <= 0) {
            Lose();
        }
    }, 1000);
}

function Win() {
    clearInterval(timer);

    currentAnswer = "";
    stats.correct++;
    stats.streak++;

    SaveStats();

    messageOutput.textContent = "Well done! Current win streak: " + stats.streak + "!\n\nPress 'enter' to continue.";
    UpdateSessionStats(true);
}
function Lose() {
    clearInterval(timer);

    messageOutput.textContent = "Ran out of time. :(\n\nQuote was: " + currentAnswer + "\n\nPress 'enter' to continue.";
    currentAnswer = "";
    stats.incorrect++;
    stats.streak = 0;

    SaveStats();

    UpdateSessionStats(false);
}

function SaveStats() {
    var newStats = {c:0,i:0,s:0};
    newStats.c = statsOnLoad.correct + stats.correct;
    newStats.i = statsOnLoad.incorrect + stats.incorrect;
    newStats.s = Math.max(statsOnLoad.maxstreak,stats.streak);
    localStorage.setItem('woq_stats_unscramble', JSON.stringify(newStats));
}

function UpdateSessionStats(lastCorrect) {
    sessionStats.textContent = stats.correct + " / " + (stats.correct + stats.incorrect);
}

function ClearPage() {
    scrambledOutput.innerHTML = "";
    authorOutput.innerHTML = "";
    messageOutput.innerHTML = "";
    input.value = "";
    input.focus();
}

function IsAcceptableCharacter(char) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.?\'":; '.includes(char);
}
function IsAcceptableString(str) {
    for(var i = 0; i < str.length; i++) {
        if(!IsAcceptableCharacter(str[i])) {
            return false;
        }
    }
    return true;
}