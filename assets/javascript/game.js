

var response = -1;                      //Value returned from the Open Trivia Database to let us know if everything went OK.  Want 0
var state = "begin"                     //Keep track of where we are in program
var right = 0;                          //# correct
var wrong = 0;                          //# wrong
var questions = {};                     //array of questions
var totalTime = 60;                     //Total time for the game
var questionTime = 10;                  //Time allowed for a question
var questionNumber = 0;                 //The question number we are on in the array of questions
var correctAnswer = "";                 //
var correctAnswerSpot = 0;
var totalCountDownTimer;
var questionCountDownTimer;
var addCountdown;
var countdown = 3;

$(document).ready(function () {

    $(document).on("click","#gamestart",startGame);
    $(document).on("click",".answer",answer);

    startGame()


    function answer () {
        // if this.
        // alert("hello");
        if (state === "question") {
            $(this).css("background-color","green");
            $(this).css("border-color","green");
            // console.log($(this).attr("id"));
            // console.log(correctAnswerSpot+1);
            // console.log("answer_" + (correctAnswerSpot+1));
            if ($(this).attr("id") == "answer_" + (correctAnswerSpot+1)) {   //correct answer
                right++;
                showResult("<h3>Correct!  Next question coming up...</h3>");
            } else {    //wrong answer
                wrong++;
                showResult("<h3>Wrong.  Next question coming up...</h3>");
            }
        }
    }

    function showResult(htmlToDisplay) {
        state = "inanswer"
        questionNumber++;
        clearInterval(questionCountDownTimer);
        clearInterval(totalCountDownTimer);
        $("#main").append(htmlToDisplay);
        addCountdown = setInterval(function() {
            state = "question";
            setQuestion();
        },3000);
    }


    function startGame() {
        if (state === "begin") {  //first time in game
            state = "beforeStart"
      

            $("#main").html('<p class="card-text">Welcome to Sports Trivia.  Your goal is to get as many correct answers in 60 seconds.  You have ten second per question to answer.  There are up to 50 questions in each round.</p><p><button type="button" class="btn btn-danger" id="gamestart">Start Game</button>')

            

        } else if (state = "beforeStart") {
            $("#main").html('<p class="card-text">Getting questions from Open Trivia Database...')

            $.getJSON( "https://opentdb.com/api.php?amount=50&category=21&type=multiple", function( data ) {

                response = data["response_code"];
                if (response === 0) {   //got questions
                    questions = data;

                    console.log(questions);

                    // Start timer and then show first question
                    totalTime = 60;
                   
                    setQuestion();


                } else {   //error getting questions
                    $("#main").html('<p class="card-text">Error getting questions from Open Trivia Database.</p><p><button type="button" class="btn btn-danger" id="gamestart">Try Again</button>')
                }

                state = "question";
            });     
        }
    }


    function totalCountDown () {
        totalTime = totalTime - 1;
        setTimerImage(totalTime,1,$("#tt1"));
        setTimerImage(totalTime,2,$("#tt2"));
        if (totalTime <= 0) {  //end game
            state = "beforeStart";
            clearInterval(questionCountDownTimer);
            clearInterval(totalCountDownTimer);
            $("#main").html('<p class="card-text">Game over.  You got ' + right + ' right, and ' + wrong + ' wrong.</p><p><button type="button" class="btn btn-danger" id="gamestart">Start Game</button>')
            right = 0;
            wrong = 0;
        } 
    }

    function questionCountDown () {
        questionTime--;
        setTimerImage(questionTime,1,$("#qt1"));
        setTimerImage(questionTime,2,$("#qt2"));
        if (questionTime <= 0) {
            showResult("<h3>Time's Up.  Next question coming up...</h3>"); 
        }
    }


    function setTimerImage(time,digit,object) {
        var num = 0;
        var image = "";

        if (digit === 1) num = Math.floor(time/10);
        else  num = time % 10;                              //must be second digit

        switch (num) {
            case 0:     image = "assets/images/zero.png"; break;
            case 1:     image = "assets/images/one.png"; break;
            case 2:     image = "assets/images/two.png"; break;
            case 3:     image = "assets/images/three.png"; break;
            case 4:     image = "assets/images/four.png"; break;
            case 5:     image = "assets/images/five.png"; break;
            case 6:     image = "assets/images/six.png"; break;
            case 7:     image = "assets/images/seven.png"; break;
            case 8:     image = "assets/images/eight.png"; break;
            case 9:     image = "assets/images/nine.png";
        }

        object.attr('src',image);

    }

    

   


    function setQuestion () {
        clearInterval(addCountdown);

        //start timer for question
        totalCountDownTimer = setInterval(totalCountDown,1000);
        questionTime = 10;
        questionCountDownTimer = setInterval(questionCountDown,1000);

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

    ballColor = ['red', 'blue', 'green', 'yellow'];
    currBallColor = 0;

    // var iconColor = setInterval(function () {
    //     changeColor();
    // }, 5000);

    // $(window).blur(function () {
    //     clearInterval(iconColor);
    // })

    // $(window).focusin(function () {
    //     iconColor = setInterval(function () {
    //         changeColor();
    //     }, 5000);
    // })

    // function changeColor() {

    //     var changeColor = ballColor[currBallColor];
    //     $(".fa-baseball-ball").css("color", changeColor);

    //     // setTimeout(function () {
    //         $(".fa-basketball-ball").css("color", changeColor);
    //     // }, 1000);

    //     // setTimeout(function () {
    //         $(".fa-football-ball").css("color", changeColor);
    //     // }, 2000);

    //     // setTimeout(function () {
    //         $(".fa-futbol").css("color", changeColor);
    //     // }, 3000);


    //     if (currBallColor === 3) {
    //         currBallColor = 0;
    //     } else {
    //         currBallColor++;
    //     }
    // }



})



