const key = '3c8e64354d489af483aa7662746a4745';

//page elements for quiz questions
var questionOutput = document.getElementById('question');
var answerButtons = document.getElementsByClassName('answer-button');
var correctIndex;
var recentIDs = [];

//stats this session
var stats = {
    streak:0,
    correct:0,
    incorrect:0,
    timedout:0
}
var sessionStats = document.getElementById('session-stats');

var statsOnLoad = localStorage.getItem('woq_stats_quiz');
if(statsOnLoad === null) {
    statsOnLoad = {
        correct:0,
        incorrect:0,
        maxstreak:0,
        timedout:0
    }
}

//globals for handling timer
const timeLimit = 10;
var timer;
var time;
var timeOutput = document.getElementById('time');

function NewQuestion() {
    ClearPage();

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
            //check for bad or undefined data, or a repeat question
            if(data.status !== undefined || data.quotes[0].body.toLowerCase().includes('body') || data.quotes[0].body.toLowerCase().includes('<br>') || recentIDs.includes(data.quotes[0].id)) {
                NewQuestion();
                return;
            }

            UpdateTimer();

            questionOutput.textContent = data.quotes[0].body;

            //set correct answer button
            correctIndex = Math.floor(Math.random() * 4);
            answerButtons[correctIndex].textContent = data.quotes[0].author;
            answerButtons[correctIndex].removeEventListener('click', IncorrectAnswer);
            answerButtons[correctIndex].removeEventListener('click', CorrectAnswer);
            answerButtons[correctIndex].addEventListener('click', CorrectAnswer);

            //go through quotes and grab other authors to offer as incorrect answers
            var usedAuthors = [data.quotes[0].author];
            var currentButton = 0;
            for(var i = 1; i < data.quotes.length; i++) {
                if(currentButton >= 4) {
                    break;
                }
                else if(currentButton == correctIndex) {
                    ++currentButton;
                }
                else if(data.quotes[i].author !== undefined && !usedAuthors.includes(data.quotes[i].author) && !data.quotes[i].author.toLowerCase().includes('author')) {
                    usedAuthors.push(data.quotes[i].author);
                    answerButtons[currentButton].textContent = data.quotes[i].author;
                    ++currentButton;
                }
            }
            //if we reached the end of the data and haven't filled all the buttons, restart
            if(!(currentButton >= 4)) {
                NewQuestion();
                return;
            }

            //store this as a recent ID so we don't repeat it
            recentIDs.push(data.quotes[0].id);
            if(recentIDs.length > 10) {
                recentIDs.splice(0,recentIDs.length - 10);
            }
        });
}

function ClearPage() {
    //TODO reset timer and stuff?
    questionOutput.textContent = "";
    for(var i = 0; i < answerButtons.length; i++) {
        answerButtons[i].textContent = "";

        //Set all button listeners to incorrect
        answerButtons[i].removeEventListener('click', IncorrectAnswer);
        answerButtons[i].removeEventListener('click', CorrectAnswer);
        answerButtons[i].addEventListener('click', IncorrectAnswer)
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
            IncorrectAnswer('timeless');
        }
    }, 1000);
}

//eventIndex 0 = incorrect, 1 = correct, 2 = ran out of time
function UpdateSessionStats(eventIndex) {
    sessionStats.innerHTML = "";
    var status = document.createElement('i');
    if(eventIndex !== 2) {
        status.textContent = 'You got that last quote ';
        if(eventIndex === 1) {
            status.textContent += "correct!!!";
        } else {
            status.textContent += "incorrect. :(";
        }
    } else {
        status.textContent = "Ran out of time on that last one. :(";
    }
    sessionStats.textContent = stats.correct + " / " + (stats.correct + stats.incorrect) + " - ";
    sessionStats.append(status);
}

function IncorrectAnswer(event) {
    var ind = 0;
    if(event === 'timeless') {
        ind = 2;
        stats.timedout++;
    }
    stats.streak = 0;
    stats.incorrect++;
    SaveStats();
    UpdateSessionStats(ind);
    NewQuestion();
}
function CorrectAnswer(event) {
    stats.streak++;
    stats.correct++;
    SaveStats();
    UpdateSessionStats(1);
    NewQuestion();
}

function SaveStats() {
    var newStats = {c:0,i:0,s:0,t:0};
    newStats.c = statsOnLoad.correct + stats.correct;
    newStats.i = statsOnLoad.incorrect + stats.incorrect;
    newStats.s = Math.max(statsOnLoad.maxstreak,stats.streak);
    newStats.t = statsOnLoad.timedout + stats.timedout;
    localStorage.setItem('woq_stats_quiz', JSON.stringify(newStats));
}

UpdateTimer();
NewQuestion();