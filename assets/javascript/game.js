

var response = -1;
var questions = 0;
var state = "begin"
var right = 0;
var wrong = 0;
var totalright = 0;
var totalwrong = 0;
var questions = {};
var totalTime = 60;
var questionTime = 10;
var questionNumber = 0;
var correctAnswer = "";

$(document).ready(function () {

    $(document).on("click","#gamestart",startGame);
    $(document).on("click","#answer",answer);

    startGame()


    function answer () {
        
    }

    function startGame() {
        if (state === "begin") {  //first time in game
            state = "beforeStart"
      

            $("#main").html('<p class="card-text">Welcome to Sports Trivia.  Your goal is to get as many correct answers in 60 seconds.  You have five second per question to answer.  There are up to 50 questions in each round.</p><p><button type="button" class="btn btn-danger" id="gamestart">Start Game</button>')

            

        } else if (state = "beforeStart") {
            $("#main").html('<p class="card-text">Getting questions from Open Trivia Database...')

            $.getJSON( "https://opentdb.com/api.php?amount=50&category=21&type=multiple", function( data ) {

                response = data["response_code"];
                // console.log(data[1]["results"]["category"]);
                if (response === 0) {   //got questions
                    questions = data;

                    console.log(questions);

                    // Start timer and then show first question
                    totalTime = 60;
                    setInterval(totalCountDown,1000);
                    setQuestion();


                } else {   //error getting questions
                    $("#main").html('<p class="card-text">Error getting questions from Open Trivia Database.</p><p><button type="button" class="btn btn-danger" id="gamestart">Try Again</button>')
                }
            });     
        }
    }


    function totalCountDown () {
        console.log(totalTime);
        if (totalTime !=0) {
            totalTime = totalTime - 1;
            $("#total-time").text(totalTime);
        } else {
            //end it
        }
    }

    function questionCountDown () {
        if (questionTime != 0) {
            questionTime--;
            $("#question-time").text(questionTime);
        } else {
            //show -- to slow
            //set no answer and set next question
        }
    }


    function setQuestion () {
        //start timer for question
        questionTime = 10;
        setInterval(questionCountDown,1000);

        var answers = [];
       

        correctAnswerSpot = Math.floor((Math.random() * 3));
        correctAnswer = questions['results'][questionNumber]['correct_answer'];
        var lastAnswer = "";
        
        if (correctAnswerSpot === 3) { lastAnswer = correctAnswer;}

        $.each(questions['results'][questionNumber]['incorrect_answers'],function(key,val) {
            if (correctAnswerSpot === key) {
                answers.push(correctAnswer);
                lastAnswer = val;
            } else {
                answers.push(val);
            }
        });

        answers.push(lastAnswer);

        $("#main").html(questions['results'][questionNumber]['question']
                    + '<br><br><p><button type="button" class="btn btn-light button answer">' 
                    + answers[0] + '</button>&nbsp'
                    + '<button type="button" class="btn btn-light button answer">' 
                    + answers[1] + '</button>&nbsp'
                    + '<button type="button" class="btn btn-light button answer">' 
                    + answers[2] + '</button>&nbsp'
                    + '<button type="button" class="btn btn-light button answer">' 
                    + answers[3] + '</button></p>')
    }

    ballColor = ['red', 'blue', 'green', 'yellow'];
    currBallColor = 0;

    setInterval(function () {
        changeColor();
    }, 5000);


    function changeColor() {

        var changeColor = ballColor[currBallColor];
        $(".fa-baseball-ball").css("color", changeColor);

        setTimeout(function () {
            $(".fa-basketball-ball").css("color", changeColor);
        }, 1000);

        setTimeout(function () {
            $(".fa-football-ball").css("color", changeColor);
        }, 2000);

        setTimeout(function () {
            $(".fa-futbol").css("color", changeColor);
        }, 3000);


        if (currBallColor === 3) {
            currBallColor = 0;
        } else {
            currBallColor++;
        }
    }



})



