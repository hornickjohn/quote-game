const key = '3c8e64354d489af483aa7662746a4745';

//page elements for game
var quoteOutput = document.getElementById('quote');
var input = document.getElementById('qpm-input');

const totalQuotesPerRun = 5;
var recentIDs = [];
var quotes = [];
var currentQuoteIndex = 0;
var done = false;

//stats this session
var stats = {
    //max QPM and WPM this session
    q_max:0,
    w_max:0,
    totalwords:0,
    totalquotes:0,
    totaltime:0
}

//local storage stats
var statsOnLoad = JSON.parse(localStorage.getItem('woq_stats_qpm'));
if(statsOnLoad === null) {
    statsOnLoad = {
        maxqpm:0,
        maxwpm:0,
        totalwords:0,
        totalquotes:0,
        totaltime:0
    }
}

//globals for handling timer
var timer;
var time = 0;
var currentWordCount = 0;
var qOutput = document.getElementById('currentQPM');
var wOutput = document.getElementById('currentWPM');
var authOutput = document.getElementById('author');
var numOutput = document.getElementById('quote-num');
var sessionStats = document.getElementById('session-stats');

var filled = document.getElementById('filled');
var unfilled = document.getElementById('unfilled');
var wrong = document.getElementById('wrong');

function StartNew() {
    //get data
    GetGoodQuote(totalQuotesPerRun, FireGame);

    input.focus();
}

function FireGame() {
    document.getElementById('start').classList.add('hidden');

    currentQuoteIndex = 0;

    done = false;
    timer = setInterval(function () {
        time += 0.2;
        var QPM = Math.round(currentQuoteIndex * 60 / time);
        var WPM = Math.round(currentWordCount * 60 / time);
        currentQPM.textContent = 'Quotes per Minute: ' + QPM;
        currentWPM.textContent = 'Words per Minute: ' + WPM;
        if(done) {
            clearInterval(timer);
            if(stats.q_max < QPM) {
                stats.q_max = QPM;
            }
            if(stats.w_max < WPM) {
                stats.w_max = WPM;
            }
            stats.totalwords += currentWordCount;
            stats.totalquotes += totalQuotesPerRun;
            stats.totaltime += time;
            SaveStats();
            document.getElementById('start').classList.remove('hidden');
            sessionStats.textContent = "Max QPM: " + stats.q_max + " / Max WPM: " + stats.w_max;
        }
    }, 200);

    SetupQuote();
}

function SetupQuote() {
    numOutput.textContent = currentQuoteIndex + 1;
    authOutput.textContent = "- " + quotes[currentQuoteIndex].author;
    unfilled.textContent = quotes[currentQuoteIndex].body;
    filled.textContent = "";
    wrong.textContent = "";
}

//typing input handled
input.addEventListener('input', function() {
    if(wrong.textContent.length > 0 && wrong.textContent[0] === input.value) {
        filled.textContent += input.value;
        wrong.textContent = "";
        if(input.value === ' ') {
            ++currentWordCount;
        }
    } else if (wrong.textContent === "" && unfilled.textContent[0] === input.value) {
        filled.textContent += input.value;
        unfilled.textContent = unfilled.textContent.substring(1);
        if(input.value === ' ') {
            ++currentWordCount;
        }
    } else if(unfilled.textContent === "" && wrong.textContent === "") {
        //we're not in a game
    } else if(wrong.textContent === "" && IsAcceptableCharacter(input.value)) {
        wrong.textContent = unfilled.textContent[0];
        unfilled.textContent = unfilled.textContent.substring(1);
    }
    if(unfilled.textContent === "") {
        ++currentWordCount;

        ++currentQuoteIndex;
        if(currentQuoteIndex < quotes.length) {
            SetupQuote();
        } else {
            done = true;
        }
    }
    input.value = "";
});
input.addEventListener('focusout', function() {
    input.focus();
});

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

function GetGoodQuote(num, endfunc) {
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
            //fetch error, try again
            if(data.status !== undefined) {
                GetGoodQuote(num, endfunc);
                return;
            }
            recentIDs = [];
            quotes = [];
            for(var i = 0; i < data.quotes.length; i++) {
                if(!data.quotes[i].body.toLowerCase().includes('body') && 
                !recentIDs.includes(data.quotes[i].id) && 
                IsAcceptableString(data.quotes[i].body)) {
                    quotes.push(data.quotes[i]);
                    recentIDs.push(data.quotes[i].id)
                }
                if(quotes.length >= num) {
                    break;
                }
            }
            if(quotes.length < num) {
                GetGoodQuote(num, endfunc);
                return;
            } else {
                endfunc.apply();
            }
        });
}

function SaveStats() {
    var newStats = {maxqpm:0,maxwpm:0,totalquotes:0,totalwords:0,totaltime:0};
    newStats.maxqpm = Math.max(statsOnLoad.maxqpm, stats.q_max);
    newStats.maxwpm = Math.max(statsOnLoad.maxwpm, stats.w_max);
    newStats.totalquotes = statsOnLoad.totalquotes + stats.totalquotes;
    newStats.totalwords = statsOnLoad.totalwords + stats.totalwords;
    newStats.totaltime = statsOnLoad.totaltime + stats.totaltime;
    localStorage.setItem('woq_stats_qpm', JSON.stringify(newStats));
}