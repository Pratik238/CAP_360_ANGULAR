
function Test(url){

 APIurl=url;
}
function oncallback(e) {
    var response = JSON.parse(e.data);
    
     switch (response.event)
     {
	case 'begin':
	  //call to forte checkout is successful
	  break;
	case 'success':
	  //transaction successful 
	  //(optional) validate from response.signature that this message is coming from forte
	  //display a receipt
      //alert('thanks for your order. the trace number is ' + response.trace_number);
      
     
    var APIurl = "http://localhost:5000/api/ForteConfig";
    url=APIurl;
    $.ajax({
        cache: false,
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        data: e.data,
        
        error: function (xhr, err) {
           
        },
        success: function (data) {
           
             alert('thanks for your order. the trace number is ' + response.trace_number);
             window.location.href="http://localhost:4200/login";
        }
    });

	  break;
       case 'failure':
	  //handle failed transaction            
	  alert('sorry, transaction failed. failed reason is ' + response.response_description);
	}
  }