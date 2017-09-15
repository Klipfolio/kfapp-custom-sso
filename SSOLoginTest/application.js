		var ssoUrl = "https://app.klipfolio.com"
		var ssoToken = "";
		var ssoCompany = "";
		var requestType;
		
		$('#sso_url').val(ssoUrl);
		$('#sso_token').val(ssoToken);
		$('#cid').val(ssoCompany);
		

$('#button-sso').click( function(){
    
	    ssoUrl = $('#sso_url').val();
        ssoToken = $('#sso_token').val();
        ssoCompany = $('#cid').val();
        requestType = $('#request_type').find(':selected').text();       

			$.ajax({

				url : ssoUrl + "/users/sso_auth",
				type: requestType,
				xhrFields:{
					withCredentials:true
				},
				headers:{
					"KF-SSO": ssoToken,
					"KF-Company": ssoCompany
				},
				dataType:"json",
				success : function(data){
					console.log(data)
                    $('#result').html("<h2>SSO Success</h2><p>Logged in as: "+ data.user.email +
                                      "<p>Test your session by going to <a href='" + ssoUrl + "/dashboard' target='_blank'>Klipfolio Dashboard</p>");
				},
				error : function(err){
					console.log("sso auth failed",err)
                    var errMsg = JSON.parse( err.responseText);
                    console.log(errMsg)
                    $('#result').html("<h2 class='fail'>SSO Failed<h2><p>Error: (#"+errMsg.error_code+") "
                                      +errMsg.error_message+"</p>");
				}
			})

		})


$('#button-sso-logout').click( function(){
        ssoToken = $('#sso_token').val();
        ssoCompany = $('#cid').val();
		
			$.ajax({

				url : ssoUrl + "/sso_logout",
				type: "post",
				xhrFields:{
					withCredentials:true
				},
				headers:{
					"KF-SSO": ssoToken,
					"KF-Company": ssoCompany
				},
				dataType:"json",
				success : function(data){		
					console.log("logout",data)
					
					var error = data.error;
					
					if(error == null){
						$('#result').html("<h2>Successfully logged out</h2><p>");
					}else{
					 $('#result').html("<h2>" +error+ "</h2><p>");
					}
				},
				error : function(err){
				    var errMsg = JSON.parse( err.responseText);
					var errMsg2 = JSON.parse( errMsg.error_message);
					console.log(errMsg2)
                    console.log(errMsg)
                    $('#result').html("<h2 class='fail'>SSO Logout Failed<h2><p>" +errMsg+ "</p>");
				}
			})
			
		})
