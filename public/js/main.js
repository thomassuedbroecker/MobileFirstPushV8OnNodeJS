$("#button").on("click", function() {
	console.log(">>> 1 In #button click");

	var message = $("#message").val();
	var value   = {'message':message};
  console.log(">>> 2 In #button click message ( %s )", JSON.stringify(value));


  // how to send a REST API request - http://stackoverflow.com/questions/921942/javascript-rest-client-library
  // http://api.jquery.com/jquery.ajax/
  $.ajax({
    url: 'http://samplemfppushintegration.mybluemix.net/sendPush',
    type: 'POST',
		dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(value),// or $('#myform').serializeArray()
    success: function(result) {
			  message = "PushMessage submitted (" + JSON.stringify(result) + ")";
			  alert(message);
		}
  });
});
