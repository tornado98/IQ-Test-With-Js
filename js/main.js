window.onload = function () {
	var currentQuestionNumber = currentQuestion();
	displayQuiz(currentQuestionNumber);
}

var nextBtn = document.getElementById('next-question');
var prevBtn = document.getElementById('prev-question');
var refreshBtn = document.getElementById('refresh-quiz');
var finishBtn = document.getElementById('finish');
var question = document.getElementById('question');


nextBtn.onclick = goToNextQuestion;
prevBtn.onclick = goToPrevQuestion;
finishBtn.onclick = finishQuiz;
refreshBtn.onclick = refreshQuiz;

function currentQuestion() {
	return localStorage.currentQuestionNumber ? Number(localStorage.currentQuestionNumber) : 1;
}

function goToNextQuestion() {
	var currentQuestionNumber = currentQuestion();
	displayQuiz(currentQuestionNumber+1);
}

function goToPrevQuestion() {
	var currentQuestionNumber = currentQuestion();
	displayQuiz(currentQuestionNumber-1);
}

function answer(choice) {

	// save answer
	var currentQuestionNumber = currentQuestion();
	if (localStorage.answers) {
		var answers = localStorage.answers.split(",");
	}else {
		var answers = [];
	}
	answers[currentQuestionNumber] = choice;
	localStorage.setItem('answers', answers);

	// go to next question
	goToNextQuestion();
}

function displayQuiz(number) {

	if (number == 1) {
		prevBtn.setAttribute('disabled', 'true');
	}else {
		prevBtn.removeAttribute('disabled');
	}

	if (number == 35) {
		nextBtn.setAttribute('disabled', 'true');
	}else {
		nextBtn.removeAttribute('disabled');
	}
	if (number <= 35 && number >= 1) {
		localStorage.currentQuestionNumber = number;
		updatePictures(number);
		markSelecteds(number);
	}
	if (number == 36) {
		var info = document.getElementById('finish-info');
		info.style.display = "block";
		markSelecteds(35);
	}else {
		info.style.display = "none";
	}
}

function updatePictures(number) {

	var a = document.getElementById('choice-a');
	var b = document.getElementById('choice-b');
	var c = document.getElementById('choice-c');
	var d = document.getElementById('choice-d');
	var e = document.getElementById('choice-e');
	var f = document.getElementById('choice-f');

	question.setAttribute('src', 'img/q'+number+'.png');
	a.setAttribute('src', 'img/q'+number+'a.png');
	b.setAttribute('src', 'img/q'+number+'b.png');
	c.setAttribute('src', 'img/q'+number+'c.png');
	d.setAttribute('src', 'img/q'+number+'d.png');
	e.setAttribute('src', 'img/q'+number+'e.png');
	f.setAttribute('src', 'img/q'+number+'f.png');
}


function markSelecteds(number) {

	var answers = localStorage.answers ? localStorage.answers.split(",") : [];

	// update navigator links
	Array.from(document.getElementsByClassName('navigator-link')).forEach(function (self, step) {
		var index = step + 1;
		if (index == number) {
			self.classList.add('current');
			self.classList.remove('answered');
		}else {
			self.classList.remove('current');
			if (answers[index]) {
				self.classList.add('answered');
			}
		}
	});

	// update choices
	if (localStorage.answers) {
		Array.from(document.getElementsByClassName('choice-img')).forEach(function (self) {
			self.classList.remove('answered');
		});
		if (answers[number]) {
			var choiceImg = document.getElementById('choice-'+answers[number]);
			choiceImg.classList.add('answered');
		}
	}
}


function finishQuiz() {

	var corrects = countCorrectAnswers();
	var wrongsCount = document.getElementById('wrongs-count');
	var iq = document.getElementById('iq');
	wrongsCount.innerHTML = 35 -corrects;
	iq.innerHTML = 85 + Math.round((corrects*60)/35);

	var quizBox = document.getElementById('quiz-box');
	var resultBox = document.getElementById('result-box');
	quizBox.style.display = "none";
	resultBox.style.display = "block";
}


function refreshQuiz() {
	localStorage.removeItem('answers');
	localStorage.removeItem('currentQuestionNumber');
	location.reload();
}

function countCorrectAnswers() {
	var answers = localStorage.answers ? localStorage.answers.split(",") : [];
	if (answers.length) {
		var correctAnswers = ['', 'a', 'e', 'f', 'f', 'd', 'e', 'e', 'c', 'd', 'd', 'a', 'a', 'b', 'a', 'f', 'b', 'd', 'c', 'a', 'a', 'b', 'e', 'e', 'f', 'e', 'f', 'a', 'a', 'c', 'e', 'd', 'a', 'e', 'a', 'd'];

		var totalCorrects = 0;
		for (var i = 1; i <= answers.length; i++) {
			if (answers[i] == correctAnswers[i]) {
				totalCorrects++;
			}
		}

		return totalCorrects;

	}else {
		return 0;
	}
}
