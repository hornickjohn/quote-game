function LoadStats() {
    var trumpyeStats = JSON.parse(localStorage.getItem('woq_stats_trumpye'));
    var quizStats = JSON.parse(localStorage.getItem('woq_stats_quiz'));
    var unscrambleStats = JSON.parse(localStorage.getItem('woq_stats_unscramble'));
    var qpmStats = JSON.parse(localStorage.getItem('woq_stats_qpm'));

    if(trumpyeStats !== null) {
        document.getElementById('trumpye_content').classList.remove('hidden');
        document.getElementById('trumpye_nocontent').classList.add('hidden');

        document.getElementById('trumpye_correct').textContent = trumpyeStats.correct;
        document.getElementById('trumpye_incorrect').textContent = trumpyeStats.incorrect - trumpyeStats.timedout;
        document.getElementById('trumpye_timedout').textContent = trumpyeStats.timedout;
        document.getElementById('trumpye_maxstreak').textContent = trumpyeStats.maxstreak;
    } else {
        document.getElementById('trumpye_content').classList.add('hidden');
        document.getElementById('trumpye_nocontent').classList.remove('hidden');
    }

    if(quizStats !== null) {
        document.getElementById('quiz_content').classList.remove('hidden');
        document.getElementById('quiz_nocontent').classList.add('hidden');

        document.getElementById('quiz_correct').textContent = quizStats.correct;
        document.getElementById('quiz_incorrect').textContent = quizStats.incorrect - quizStats.timedout;
        document.getElementById('quiz_timedout').textContent = quizStats.timedout;
        document.getElementById('quiz_maxstreak').textContent = quizStats.maxstreak;
    } else {
        document.getElementById('quiz_content').classList.add('hidden');
        document.getElementById('quiz_nocontent').classList.remove('hidden');
    }

    if(unscrambleStats !== null) {
        document.getElementById('unscramble_content').classList.remove('hidden');
        document.getElementById('unscramble_nocontent').classList.add('hidden');

        document.getElementById('unscramble_correct').textContent = unscrambleStats.correct;
        document.getElementById('unscramble_incorrect').textContent = unscrambleStats.incorrect;
        document.getElementById('unscramble_maxstreak').textContent = unscrambleStats.maxstreak;
    } else {
        document.getElementById('unscramble_content').classList.add('hidden');
        document.getElementById('unscramble_nocontent').classList.remove('hidden');
    }

    if(qpmStats !== null) {
        document.getElementById('qpm_content').classList.remove('hidden');
        document.getElementById('qpm_nocontent').classList.add('hidden');

        document.getElementById('qpm_maxqpm').textContent = qpmStats.maxqpm;
        document.getElementById('qpm_maxwpm').textContent = qpmStats.maxwpm;
        document.getElementById('qpm_averageqpm').textContent = Math.round(qpmStats.totalquotes * 600 / qpmStats.totaltime) / 10;
        document.getElementById('qpm_averagewpm').textContent = Math.round(qpmStats.totalwords * 600 / qpmStats.totaltime) / 10;
    } else {
        document.getElementById('qpm_content').classList.add('hidden');
        document.getElementById('qpm_nocontent').classList.remove('hidden');
    }
}

LoadStats();