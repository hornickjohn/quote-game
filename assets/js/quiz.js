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
    incorrect:0
}

//globals for handling timer
const timeLimit = 10;
var timer;
var time;
var timeOutput = document.getElementById('time');

var sessionStats = document.getElementById('session-stats');

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
            if(data.status !== undefined || data.quotes[0].body.toLowerCase().includes('body') || recentIDs.includes(data.quotes[0].id)) {
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
            //TODO: we've run out of time


            clearInterval(timer);
        }
    }, 1000);
}

function UpdateSessionStats(lastCorrect) {
    sessionStats.innerHTML = "";
    var status = document.createElement('i');
    status.textContent = 'You got that last quote ';
    if(lastCorrect) {
        status.textContent += "correct!!!";
    } else {
        status.textContent += "incorrect. :(";
    }
    sessionStats.textContent = stats.correct + " / " + (stats.correct + stats.incorrect) + " - ";
    sessionStats.append(status);
}

function IncorrectAnswer(event) {
    stats.streak = 0;
    stats.incorrect++;
    UpdateSessionStats(false);
    NewQuestion();
}
function CorrectAnswer(event) {
    stats.streak++;
    stats.correct++;
    UpdateSessionStats(true);
    NewQuestion();
}

UpdateTimer();
NewQuestion();