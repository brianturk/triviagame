

var response = -1;                      //Value returned from the Open Trivia Database to let us know if everything went OK.  Want 0
var state = "begin"                     //Keep track of where we are in program
var right = 0;                          //# correct
var wrong = 0;                          //# wrong
var questions = {};                     //array of questions
var totalTime = 60;                     //Total time for the game
var questionTime = 10;                  //Time allowed for a question
var questionNumber = 0;                 //The question number we are on in the array of questions                
var correctAnswerSpot = 0;              //Spot in the four questions that the correct one is
var totalCountDownTimer;                //Interval for total countdown
var questionCountDownTimer;             //Interval for question countdown
var addCountdown;                       //Interval for after question result and before new question


$(document).ready(function () {

    $(document).on("click", "#gamestart", startGame);
    $(document).on("click", ".answer", answer);

    startGame()

    function startGame() {
        if (state === "begin") {  //first time in game
            state = "beforeStart"

            $("#main").html('<p class="card-text">Welcome to Sports Trivia.  Your goal is to get as many correct answers in 60 seconds.  You have ten seconds per question to answer.  There are up to 50 questions in each round.</p><p><button type="button" class="btn btn-danger" id="gamestart">Start Game</button>')

        } else if (state = "beforeStart") {
            $("#main").html('<p class="card-text">Getting questions from Open Trivia Database...')


            getNewQuestions();

            
        }
    }

    function getNewQuestions() {
        $.getJSON("https://opentdb.com/api.php?amount=50&category=21&type=multiple", function (data) {

            response = data["response_code"];
            if (response === 0) {   //got questions
                questions = data;

                // console.log(data['results']);
                //shuffle questions because open trivia db doesn't do that
                questions['results'] = shuffle(questions['results']);
                // console.log(questions['results']);  

                // Start timer and then show first question
                totalTime = 60;

                setQuestion();


            } else {   //error getting questions
                $("#main").html('<p class="card-text">Error getting questions from Open Trivia Database.</p><p><button type="button" class="btn btn-danger" id="gamestart">Try Again</button>')
            }

            state = "question";
        });
    }

    /**
     * Randomly shuffle an array
     * https://stackoverflow.com/a/2450976/1293256
     * @param  {Array} array The array to shuffle
     * @return {String}      The shuffled array
     */
    var shuffle = function (array) {

        var currentIndex = array.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;

    };

    function setQuestion() {
        clearInterval(addCountdown);

        //start timer for question
        totalCountDownTimer = setInterval(totalCountDown, 1000);
        questionTime = 10;
        questionCountDownTimer = setInterval(questionCountDown, 1000);

        var answers = [];
        var correctAnswer = "";

        correctAnswerSpot = Math.floor((Math.random() * 3));
        correctAnswer = questions['results'][questionNumber]['correct_answer'];
        var lastAnswer = "";

        if (correctAnswerSpot === 3) { lastAnswer = correctAnswer; }

        $.each(questions['results'][questionNumber]['incorrect_answers'], function (key, val) {
            if (correctAnswerSpot === key) {
                answers.push(correctAnswer);
                lastAnswer = val;
            } else {
                answers.push(val);
            }
        });

        answers.push(lastAnswer);

        $("#main").html('<p class="card_text">' + questions['results'][questionNumber]['question'] + '</p>'
            + '<p><button type="button" class="btn btn-danger button answer" id="answer_1">'
            + answers[0] + '</button>&nbsp'
            + '<button type="button" class="btn btn-danger button answer" id="answer_2">'
            + answers[1] + '</button>&nbsp'
            + '<button type="button" class="btn btn-danger button answer" id="answer_3">'
            + answers[2] + '</button>&nbsp'
            + '<button type="button" class="btn btn-danger button answer" id="answer_4">'
            + answers[3] + '</button></p>')
    }

    function answer() {
        if (state === "question") {
            $(this).css("background-color", "green");
            $(this).css("border-color", "green");
            if ($(this).attr("id") == "answer_" + (correctAnswerSpot + 1)) {   //correct answer
                right++;
                $('#right-audio')[0].play()
                showResult("<h3>Correct!  Next question coming up...</h3>");
            } else {    //wrong answer
                wrong++;
                $('#wrong-audio')[0].play()
                $("#answer_" + (correctAnswerSpot + 1)).css("background-color", "blue");
                $("#answer_" + (correctAnswerSpot + 1)).css("border-color", "blue");
                showResult("<h3>Wrong.  The correct answer is in blue.  Next question coming up...</h3>");
            }
        }
    }

    function showResult(htmlToDisplay) {
        state = "inanswer"
        questionNumber++;
        clearInterval(questionCountDownTimer);
        clearInterval(totalCountDownTimer);
        if (questionNumber > questions['results'].length) {  //end game because out of questions.  Shouldn't happen
            state = "beforeStart"
            $("#main").html('<p class="card-text">Game over.  You went through 50 questions.  You got ' + right + ' right, and ' + wrong + ' wrong.</p><p><button type="button" class="btn btn-danger" id="gamestart">Play Again</button>');
            right = 0;
            wrong = 0;
        } else {
            $("#main").append(htmlToDisplay);
            addCountdown = setInterval(function () {
                state = "question";
                setQuestion();
            }, 3000);
        }
        
    }

    function totalCountDown() {
        totalTime = totalTime - 1;
        setTimerImage(totalTime, 1, $("#tt1"));
        setTimerImage(totalTime, 2, $("#tt2"));
        if (totalTime <= 0) {  //end game
            state = "beforeStart";
            clearInterval(questionCountDownTimer);
            clearInterval(totalCountDownTimer);
            $("#main").html('<p class="card-text">Game over.  You got ' + right + ' right, and ' + wrong + ' wrong.</p><p><button type="button" class="btn btn-danger" id="gamestart">Play Again</button>')
            right = 0;
            wrong = 0;
        }
    }

    function questionCountDown() {
        questionTime--;
        setTimerImage(questionTime, 1, $("#qt1"));
        setTimerImage(questionTime, 2, $("#qt2"));
        if (questionTime <= 0) {
            $('#wrong-audio')[0].play()
            $("#answer_" + (correctAnswerSpot + 1)).css("background-color", "blue");
            $("#answer_" + (correctAnswerSpot + 1)).css("border-color", "blue");
            showResult("<h3>Time's Up.  The correct answer is in blue.  Next question coming up...</h3>");
        }
    }

    function setTimerImage(time, digit, object) {
        var num = 0;
        var image = "";

        if (digit === 1) num = Math.floor(time / 10);
        else num = time % 10;                              //must be second digit

        switch (num) {
            case 0: image = "assets/images/zero.png"; break;
            case 1: image = "assets/images/one.png"; break;
            case 2: image = "assets/images/two.png"; break;
            case 3: image = "assets/images/three.png"; break;
            case 4: image = "assets/images/four.png"; break;
            case 5: image = "assets/images/five.png"; break;
            case 6: image = "assets/images/six.png"; break;
            case 7: image = "assets/images/seven.png"; break;
            case 8: image = "assets/images/eight.png"; break;
            case 9: image = "assets/images/nine.png";
        }

        object.attr('src', image);

    }


})



