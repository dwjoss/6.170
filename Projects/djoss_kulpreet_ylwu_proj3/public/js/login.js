/*
	Author: Kulpreet
*/

$(function() {
	// Handle Submission of the Login Form using AJAX
	$("#login-form").submit(function(e)
	{
		$('#alert-error').hide(); 
	    $.ajax(
	    {
	        url : $(this).attr("action"),
	        type: "POST",
	        data : $(this).serializeArray(),
			success: function(data, textStatus) {
				window.location.href = '/';
			},
	        error: function(data, textStatus, errorThrown) 
	        {
	            $('#alert-error').show();     
	        }
	    });
	    e.preventDefault();
	});
	
	// Handle Submission of the Create Accounts form using AJAX
	$("#create-account-form").submit(function(e)
	{
		$('#create-error').hide();
	    $.ajax(
	    {
	        url : $(this).attr("action"),
	        type: "POST",
	        data : $(this).serializeArray(),
			success: function(data, textStatus) {
				window.location.href = '/';
			},
	        error: function(jqXHR, textStatus, errorThrown) 
	        {
	            $('#create-error').show();     
	        }
	    });
	    e.preventDefault();
	});
});