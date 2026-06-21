console.log('connected');

const questions = [
    {
        id: 1,
        question: 'Which country won the 2022 FIFA World cup?',
        options: ['Brazil', 'Argentina', 'Germany', 'France'],
        correct: 1, //index of correct option (0-based)
    },
    {
        id: 2,
        question: 'How many players are there on the field for one football team during a match?',
        options: ['9', '10', '11', '12'],
        correct: 2,
    },
    {
        id: 3,
        question: 'Which player is known as CR7?',
        options: ['Lionel messi', 'Neymer jr', 'Kylian Mbappe', 'Christiano Ronaldo'],
        correct: 3,
    },
    {
        id: 4,
        question: 'Which club is nicknamed The Red Devils?',
        options: ['Liverpool', 'Arsenal', 'Chelsea', 'Manchester United'],
        correct: 3,
    },
    {
        id: 5,
        question: 'What color card is shown by the referee to send a player off the field for a bad faul?',
        options:['Red Card', 'Green Card', 'White Card', 'Yellow Card'],
        correct: 0,
    }
];

//state-these change as the quiz runs
let currentIndex = 0;
let score = 0;
let hasAnswered = false;
//state-these as timer runs
let timerLeft = 10;
let timer;

// Element references - query once, reuse everywhere
const startScreen = document.getElementById('start-screen');
const timerElement = document.getElementById('timer')
const questionScreen = document.getElementById('question-screen');
const endScreen = document.getElementById('end-screen');
const questionText = document.getElementById('question-text');
const optionContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const nextBtn = document.getElementById('next-btn');
const finalScore = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');

//Attach event listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('retry-btn').addEventListener('click', resetQuiz);

function startQuiz() {
    currentIndex = 0;
    score = 0;
    hasAnswered = false;
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    showQuestion();
}
function showQuestion() {
    startTimer();
    hasAnswered = false;
    nextBtn.classList.add('hidden');
    const q = questions[currentIndex];

    //update counter + progress
    questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    progressFill.style.width = ((currentIndex / questions.length) * 100) + '%';

    //Render question and options
    questionText.textContent = q.question;
    optionContainer.innerHTML = '';
    q.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.classList.add('option-btn');
        btn.dataset.index = i;
        btn.addEventListener('click', handleAnswer);
        optionContainer.appendChild(btn);
    });
}

function startTimer() {
    //Stop previous timer
    clearInterval(timer);

    //Reset timer to 10 seconds
    timeLeft = 10;

    //Remove red warning color from previous question
    timerElement.classList.remove('warning');

    //Display starting time
    timerElement.textContent = 'Time Left: ${timeLeft}s';

    timer = setInterval(() => {
        timeLeft--;

        //Update timer display
        timerElement.textContent = `Time Left: ${timeLeft}s`;

        //Turn timer red when 5 seconds remain
        if (timeLeft <= 5) {
            timerElement.classList.add('warning');
        }

        //Automatically move to next question when time runs out
        if(timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function handleAnswer(e){
    if (hasAnswered) return; // prevent double-clicking
    hasAnswered = true;

    const selected = parseInt(e.target.dataset.index);
    const correct = questions[currentIndex].correct;
    const allButtons = optionContainer.querySelectorAll('.option-btn');

    //lock all buttons
    allButtons.forEach(btn => btn.classList.add('disabled'));

    //Always highlight the correct answer
    allButtons[correct].classList.add('correct');

    //Mark selected wrong if incorrect
    if (selected === correct) {
        score++;
    } else {
        e.target.classList.add('incorrect');
    }

    //show next button - update text on last question
    nextBtn.classList.remove('hidden');
    if (currentIndex === questions.length - 1) {
        nextBtn.textContent = 'See Result';
    }
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showEndScreen();
    }
}

function showEndScreen() {
    questionScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    progressFill.style.width = '100%';  //fill to completion

    //Display score
    finalScore.textContent = `${score} / ${questions.length}`;

    //Performance message
    const pct = (score / questions.length) *100;
    if  (pct ===100) scoreMessage.textContent = 'Perfect score! Outstanding!';
    else if   (pct ===80) scoreMessage.textContent = 'Great work - nearly there!';
    else if (pct >= 60) scoreMessage.textContent = 'Good effort - keep practicing!';
    else     scoreMessage.textContent = 'Review the material and try again';
}

function resetQuiz() {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}