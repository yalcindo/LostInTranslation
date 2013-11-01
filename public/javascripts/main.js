$(function(){
	//encapsulating data related values
	  var counters={
		quizCounter:1,
		correctCounter:0,
		wrongCounter:0,
		nextQuiz:[],
		quizIndex:0,
		quizNum:1,
		quizLang:"spa"
      };

    var createQuiz=function(word){
        var sourceQuiz = $("#quiz-template").html();
		var quizTemplate = Handlebars.compile(sourceQuiz);
		return $(".quiz-div").html(quizTemplate({words:word}));
    };
    var restartQuiz=function(word){
        var sourceQuiz = $("#restart-template").html();
		var quizTemplate = Handlebars.compile(sourceQuiz);
		return $(".quiz-div").html(quizTemplate({words:word}));
    };
	var createNextQuiz=function(word){
		var sourceQuiz = $("#next-template").html();
		var quizTemplate = Handlebars.compile(sourceQuiz);
		return $(".quiz-div").html(quizTemplate({words:word}));
    };
    var createCorrectRespond = function(divInput,message){
		return divInput.html("<div>"+message+"<br>"+
			"<button type='button' class='btn btn-primary btn-next'>Next</button>"+
						  	"</div>");
    };
    var createWrongRespond=function(divInput,message){
        return  divInput.html("<div> WRONG!!!"+"<br>"+"Correct Answer: "+message+"<br>"+
            "<button type='button' class='btn btn-primary btn-next'>Next</button>"+
						  "</div>");
    };
    var checkQuizAnswer=function(){
    	  if(counters.wrongCounter===3){
        	restartQuiz("you made three mistakes start over");
        	counters.quizCounter=0;
        	counters.wrongCounter=0;
        }else if(counters.quizCounter<8){
	    	createQuiz(counters.nextQuiz[counters.quizIndex][counters.quizCounter]);
	    	counters.quizCounter++;
	    }
       else {
        	createNextQuiz("Go to the next Quiz");
        	counters.quizIndex++;
        	counters.quizCounter=0;
        	counters.wrongCounter=0;
        }
    };
    var createQuizSuccess =function(word){
    	var sourceQuiz = $("#quizSuccess-template").html();
		var quizTemplate = Handlebars.compile(sourceQuiz);
		return $(".quizsuccess-div").append(quizTemplate({words:word}));

    };
    var createQuizEnd = function(word){
    	var sourceQuiz = $("#quizEnd-template").html();
		var quizTemplate = Handlebars.compile(sourceQuiz);
		return $(".quiz-div").html(quizTemplate({words:word}));

    };
// --------------------Translation Section

	$("#translate-form").submit(function(e){
		e.preventDefault();
		var translateFrom = $("#lang-from").val();
		var translateTo = $("#lang-to").val();
		var theWord = $("#word").val();
		//the translatework route sends data 
		//to server and get backs processed data
        $.get("/translatework",{text:theWord,from:translateFrom,to:translateTo},function(data1)
        {            
	        var source = $("#translation-template").html();
			var translationTemplate = Handlebars.compile(source);
		    $(".translation-div").html(translationTemplate(data1));
	    });      
	});
	// -----------------------QUIZ Section------------------------
    //quiz event handler
    // creates the initial quiz question
    $("#quiz-form").submit(function(e){
    	e.preventDefault();
    	counters.quizLang=$("#quiz-dropdown").val();
    	var data2={lang:counters.quizLang};
        $.get("/quizwork",data2,function(data2){
        	//dummydata is @nextQuiz
            counters.nextQuiz=data2;
			createQuiz(data2[0][0]);		
        });
    });

   //?????quiz  input on keyup is not working ask the question
   // dynamicall created content
    $(".quiz-div").on("keyup",".quiz-input",function(e){

		if(e.keyCode===13){
			var val = $(this).val();
			var wordCompare=$(this).parent().data("id");
			var $inputLoc=$(this).parent();
		
            var getCorrectAnswer=function(jqueryObject,word){	
                return $.get("/quizcorrectanswer",{text:word,from: "eng",to: "spa"},function(data){
                  createWrongRespond(jqueryObject,data.translation);
            	});
            	
            };

			$.get("/quizanswer",{mytext: val,from: "spa",to: "eng"},function(data){
				
				if(data.translation.toUpperCase()===wordCompare.toUpperCase())
				{
					counters.correctCounter++;
					createCorrectRespond($inputLoc,"Good job");
				}
				else
				{
					counters.wrongCounter++;
					getCorrectAnswer($inputLoc,wordCompare);  
				}
			});
		}
    });
   // clik next button
    $(".quiz-div").on("click",".btn-next",function(e){
    	checkQuizAnswer();
    });
    // if the user enters three wrong answers,it starts index 0
    $(".quiz-div").on("click",".btn-restart",function(e){
   		checkQuizAnswer();
    });

    $(".quiz-div").on("click",".btn-nextQuiz",function(e){
        if(counters.quizNum === 3){
        	console.log("counters.quizNum: ",counters.quizNum);
	     	createQuizEnd("You completed three succesful Quizes");
    	}else{
	    	checkQuizAnswer();
	    	console.log("counters.quizNum: ",counters.quizNum);
	    	createQuizSuccess("quiz " + counters.quizNum + " successful");
	    	
	    	counters.quizNum++;
     }
    });
});