const key = '3c8e64354d489af483aa7662746a4745';
var questionOutput = document.getElementById('question');
var answerButtons = document.getElementsByClassName('answer-button');
var correctIndex;
var recentIDs = [];

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
            //TODO potentially keep track of previously answered quotes to ensure no repeats
            if(data.quotes[0].author.toLowerCase().includes('author') || 
            recentIDs.includes(data.quotes[0].id)) {
                NewQuestion();
                return;
            }

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
                else if(!usedAuthors.includes(data.quotes[i].author)) {
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

function IncorrectAnswer(event) {
    alert('wrong');
    NewQuestion();
}
function CorrectAnswer(event) {
    alert('right');
    NewQuestion();
}

NewQuestion();