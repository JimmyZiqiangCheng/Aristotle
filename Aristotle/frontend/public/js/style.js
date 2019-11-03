$(document).ready(function(){
	$("input[type=password]").keyup(function(){
	    var ucase = new RegExp("[A-Z]+");
		var lcase = new RegExp("[a-z]+");
		var num = new RegExp("[0-9]+");
		
		if($("#password1").val().length >= 8){
			$("#8char").removeClass("fa-minus");
			$("#8char").addClass("fa-check");
			$("#8char").css("color","#00A41E");
		}else{
			$("#8char").removeClass("fa-check");
			$("#8char").addClass("fa-minus");
			$("#8char").css("color","#FF0004");
		}
		
		if(ucase.test($("#password1").val())){
			$("#ucase").removeClass("fa-minus");
			$("#ucase").addClass("fa-check");
			$("#ucase").css("color","#00A41E");
		}else{
			$("#ucase").removeClass("fa-check");
			$("#ucase").addClass("fa-minus");
			$("#ucase").css("color","#FF0004");
		}
		
		if(lcase.test($("#password1").val())){
			$("#lcase").removeClass("fa-minus");
			$("#lcase").addClass("fa-check");
			$("#lcase").css("color","#00A41E");
		}else{
			$("#lcase").removeClass("fa-check");
			$("#lcase").addClass("fa-minus");
			$("#lcase").css("color","#FF0004");
		}
		
		if(num.test($("#password1").val())){
			$("#num").removeClass("fa-minus");
			$("#num").addClass("fa-check");
			$("#num").css("color","#00A41E");
		}else{
			$("#num").removeClass("fa-check");
			$("#num").addClass("fa-minus");
			$("#num").css("color","#FF0004");
		}
		
		if($("#password1").val() == $("#password2").val()){
			$("#pwmatch").removeClass("fa-minus");
			$("#pwmatch").addClass("fa-check");
			$("#pwmatch").css("color","#00A41E");
		}else{
			$("#pwmatch").removeClass("fa-check");
			$("#pwmatch").addClass("fa-minus");
			$("#pwmatch").css("color","#FF0004");
		}
	});
});
