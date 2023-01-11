var trumpyeButton = document.getElementById('');
var quizButton = document.getElementById('');
var dadjokeOutput = document.getElementById('dad-joke');

/*
//event listener for trump/kanye button
trumpyeButton.addEventListener('click', function() {
    location.href="./trumpye.html";
});
//event listener for quiz button
quizButton.addEventListener('click', function() {
    location.href="./quiz.html";
});
*/

//display random quote
fetch('https://icanhazdadjoke.com/', {
    method:"GET",
    headers:{
        Accept:"application/json"
    }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        dadjokeOutput.textContent = data.joke;
    });