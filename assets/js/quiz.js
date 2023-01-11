const key = '3c8e64354d489af483aa7662746a4745';
var questionOutput = document.getElementById('question');
var answerButtons = document.getElementsByClassName('answer-button');
var correctIndex;

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
            console.log(data.quotes[0]);

            questionOutput.textContent = data.quotes[0].body;

            correctIndex = Math.floor(Math.random() * 4);
            answerButtons[correctIndex].textContent = data.quotes[0].author;
            answerButtons[correctIndex].removeEventListener('click', IncorrectAnswer);
            answerButtons[correctIndex].removeEventListener('click', CorrectAnswer);
            answerButtons[correctIndex].addEventListener('click', CorrectAnswer);


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