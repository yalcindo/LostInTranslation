$(function(){

     //the translation form is processed
	$("#translate-form").submit(function(e){
		e.preventDefault();
		var translateFrom = $("#lang-from").val();
		var translateTo =  $("#lang-to").val();
		var theWord = $("#word").val();
		//creating data object to send to server
		var data={text:theWord,
		       from:translateFrom,
		       to:translateTo
		      };
		//the translatework route sends data 
		//to server and get backs processed data
        $.get("/translatework",data,function(data)
        {            
	        var source = $("#translation-template").html();
			var translationTemplate = Handlebars.compile(source);
		    $(".translation-div").html(translationTemplate(data));
	    });      
	});
    
    //quiz event handler
    $("#quiz-form").submit(function(e){
    	e.preventDefault();
    	var quizLang=$("#quiz-dropdown").val();
    	var data={lang:quizLang};
        $.get("/quizwork",data,function(data){
           console.log("data:",data)
           var sourceQuiz = $("#quiz-template").html();
			var quizTemplate = Handlebars.compile(sourceQuiz);

		    $(".quiz-div").append(quizTemplate({words:data}));

        });
    });

 



});