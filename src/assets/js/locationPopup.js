function onPinchange(){

var CSS_IMAGES_JS_BASE_URL=$("#CSS_IMAGES_JS_BASE_URL").val();
var baseUrl = $('#js_ssplWebCnst').attr('base_url');

$(document).ready(function(){	
	
	var CityName = $('#userLocation').attr('user_city_name');
	var location_skipped = $('#userLocation').attr('location_skipped');
	var PanIndiaCityName = '';
	if(CityName)
	{
		PanIndiaCityName = CityName.replace(/\+/g,' ');		
	}
	else
	{
		PanIndiaCityName = CityName;
	}	
	var UserLocationPincode = $('#userLocation').attr('user_pincode');	
	if((	
	((PanIndiaCityName === null && typeof PanIndiaCityName === "object") || PanIndiaCityName == '' || PanIndiaCityName== undefined) ||
	((UserLocationPincode === null && typeof UserLocationPincode === "object") || UserLocationPincode == '' || UserLocationPincode== undefined) ) && 	location_skipped==0
	){	
		load_location_popup(0);				
	}
	else
	{
		$("#userLocation").html(PanIndiaCityName);	
		
		if(!!PanIndiaCityName && PanIndiaCityName.toLowerCase()=='others')	
		{
			if(UserLocationPincode==0 || UserLocationPincode=='')
			{
				$(".js_userLocationSSPL").html('Select Location');
			}
			else
			{
				$(".js_userLocationSSPL").html(UserLocationPincode);
			}
		}
		else{
			if(UserLocationPincode==0 || UserLocationPincode=='')
			{
				$(".js_userLocationSSPL").html(PanIndiaCityName);
			}
			else
			{
				$(".js_userLocationSSPL").html(PanIndiaCityName+'('+UserLocationPincode+')');
			}
		}
		
		
	}
	
	$(document).on('click','.js_pin_location',function(){		
		load_location_popup(1);
	})
	

	$(document).on('hidden.bs.modal', '#location_popup', function(){		
		if($('#js_pincode_loaction_content').attr('setting_pin')!='Y')
		{
			if($('.js_pincode_location_message').attr('detected_pincode')=='' || $('.js_pincode_location_message').attr('detected_pincode')==0)		// if not detect location
			{
				if($('#userLocation').attr('location_skipped')==0 && $('#userLocation').attr('user_pincode')=='') // for 1st timers
				{					
					reset_pin();	// User skipped to choose location.
				}				
			}
			else	// if location detected
			{
				if($('.js_pincode_location_message').attr('detected_pincode')!=$('#userLocation').attr('user_pincode'))
				{					
					reset_pin($('.js_pincode_location_message').attr('detected_pincode'));				
				}
			}			
		}
	})

	$(document).on('keyup','#sspl_location_pin',function(){
		if($(this).val().length==6)
		{
			$('#js_sspl_pin_location_error').html('');
		}		
	})
	
	$(document).on('click','#set_pin_location',function(event){		
		event.preventDefault();	// stop form submitting		
		$('#js_pincode_loaction_content').attr('setting_pin','Y');
		var pin = $('#sspl_location_pin').val().trim();
		
		$('#js_sspl_pin_location_error').html('');
		
		if(pin.charAt(0) === "0") {			
			$('#js_sspl_pin_location_error').html('Pincode can\'t start with 0.');
			$('#sspl_location_pin').focus();
			return false;
		}		
		
		if(pin.length!=6 || isNaN(pin))
		{			
			$('#js_sspl_pin_location_error').html('Please enter valid 6 digit pincode.');			
			$('#sspl_location_pin').focus();
			return false;
		}
		
		var current_pin = $('#userLocation').attr('user_pincode');
		if(current_pin!=pin)
		{			
			if(pin!='')
			{				
				reset_pin(pin);			
			}
			else
			{
				$('#js_sspl_pin_location_error').append('Please enter your pincode');
			}
		}
		else
		{
			$('#location_popup').modal('hide'); 
		}		
	})			

	$(document).on('click','.js_not_detect_location_info',function(event){
		$('.js_not_detect_location_info_msg').slideDown(100);
		setTimeout(function(){ $('.js_not_detect_location_info_msg').slideUp(100); }, 5000);
	})	
	
	String.prototype.capitalize = function() {
		return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};
	
	
	
	//////////////////// //delivery date start ////////////////////
	
	let delivery_date_call_time = getCookie('DeliveryDateCallTime');
	var curr_date_del_time = new Date();
	var curr_mro_del_time = curr_date_del_time.getTime();
	
	if(true)
	{
		
		$.ajax({
			url: baseUrl+'index.php/webapi/location/get_delivery_date', 
			type: 'POST',
			dataType: 'json',
			data: {'page':'H','csrf_test_name':getCookie('sspl_csrf')},
			success: function (response) {	
			
				if(response.data.Msg!='')
				{
					curr_date_del_time.setTime(curr_date_del_time.getTime() + (30*60*1000));  //1hr
					let expires = "expires="+ curr_date_del_time.toUTCString();
					document.cookie = "DeliveryDateVal=" + response.data.Msg+ "; " + expires + "; Path=/";		
					document.cookie = "DeliveryDateCallTime=" + curr_mro_del_time+ "; " + expires + "; Path=/";
					$('.js_delivery_msg_cont').text(response.data.Msg);					
				}				
			},
			error: function (result){
				$('.js_delivery_msg_cont').text('');	
			}
		});		
	}
	else
	{
		let delivery_val = getCookie('DeliveryDateVal');
		$('.js_delivery_msg_cont').text(delivery_val);
	}
	//////////////////// //delivery date end ////////////////////
	
	
	
});

function reset_pin(pin)
{	
	$('#location_popup').modal('hide'); 
	
	if($('.location_bg_fade').length==0)
	{
		$('body').prepend('<div class=" location_bg_fade"></div>');
		$('.location_bg_fade').after('<div id="loader_div" class="cart_loader_content js_cart_loader_content"><img src="'+CSS_IMAGES_JS_BASE_URL+'incom_images/preload.gif" /></div>');			
	}

	//////////////////// //delivery date start ////////////////////
	//delete delivery date cookie in location change
	var curr_date_del_time = new Date();
	curr_date_del_time.setTime(curr_date_del_time.getTime() - (1*60*60*1000));  //1hr
	let expires = "expires="+ curr_date_del_time.toUTCString();
	document.cookie = "DeliveryDateVal=0; " + expires + "; Path=/";		
	document.cookie = "DeliveryDateCallTime=0; " + expires + "; Path=/";
	//////////////////// //delivery date end ////////////////////
	
	$.ajax({					
		url: baseUrl+"index.php/webapi/location/set_user_location",
		type: 'POST',
		data: {Pincode:pin,'csrf_test_name':getCookie('sspl_csrf')},				
		dataType: 'json',
		success: function (result) {
			
			var currentUrl = window.location.href;
			var delhi_pos = currentUrl.indexOf("delhi-ncr");
			if(result && result['Status'] && result['Status']==200)
			{
				if(result['Location']['WarehouseId'])
				{								
					var isPanIndia = "N";
					if(result['Location']['PanIndia']=='Y'){
						isPanIndia = "Y";
					}								
					
					
					///////////////////////////////// Old logic start ////////////////////////////
					getCountItems().then(function(cartCnt){		
						if(parseInt(cartCnt)>0)
						{
							if((delhi_pos > 0 && result['Location']['WarehouseId'] == 1) || (delhi_pos > 0 && result['Location']['WarehouseId'] == 3)){
								window.location.href = $('#base_url').val();
							}else{
								location.reload(true);	
							}
						}
						else
						{
							$.ajax({
								type: "POST",
								url: $('#base_url').val()+'index.php/sspl/clearcart',
								data:{"isPanIndia":isPanIndia,'csrf_test_name':getCookie('sspl_csrf')},
								async: false,
								success: function(msg){						
									if($.trim(msg) == 'fail'){
										$('.js_cart_loader_content').remove();
										$('.location_bg_fade').remove();
										alert('Something went wrong, please try again');
									}
									else
									{
										clearCartItemIndexedDB().then(function(response){
											if(response == 1){
												if((delhi_pos > 0 && result['Location']['WarehouseId'] == 1) || (delhi_pos > 0 && result['Location']['WarehouseId'] == 3)){
													window.location.href = $('#base_url').val();
												}else{
													location.reload(true);	
												}
											}		
										});			
									}												
								}
							});									
						}
					})
					////////////////////////////////////// Old logic end /////////////////////////////////
					
				}
				else
				{
					$('.js_cart_loader_content').remove();
					$('.location_bg_fade').remove();
					alert('Something went wrong. Please reload the page.');
				}
			}	
			else
			{
				$('.js_cart_loader_content').remove();
				$('.location_bg_fade').remove();
			}							
		}
	})	
}

function load_location_popup(open_by_choice)
{	
	var city_name = $('#userLocation').attr('user_city_name');
	var current_pincode = $('#userLocation').attr('user_pincode');
	
	var location_html = '<div class="clr"></div><form name="location_pin_submt" action="" method="post"><div class="popularRegionsBg"><div class="padBT30"><div class="col-md-12 pad10 popularRegions"><div class="clr height20"></div><h2 class="fontsize23 padmar0">Where do you want the delivery?</h2><div class="clr height20"></div><div class="col-md-10 col-md-offset-1 pad0 " ><div class="fontsize15 js_pincode_location_message" detected_pincode="0"></div><div class="clr "></div><div class="clr height20"><div class="js_not_detect_location_info_msg fontsize11 " style="display:none;color: #7d5c00;padding: 5px 0px;">*Please allow your browser location settings to auto detect your location.</div></div><div class="popularRegionsBgBrd"><span style="top: 10px;" class="js_pin_location_msg2"></span></div><div class="clr height30"></div><div class="col-md-10 col-md-offset-1 pad0"><div class="col-md-8 pad0"><input value="" class="form-control input-lg" placeholder="Enter Pincode" autocomplete="off" style="border-radius: 0px; border-top-left-radius: 6px; border-bottom-left-radius: 6px; box-shadow: none;" type="text" name="sspl_location_pin" id="sspl_location_pin" maxlength="6" onkeypress="return isNumberKey(event);"><div id="js_sspl_pin_location_error" class="text-danger text-left fontsize12"></div></div><div class="col-md-4 pad0"><input type="submit" value="Apply" name="set_pin_location" id="set_pin_location" class="btn btn-primary btn-block pad10" style="border-radius: 0px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; padding: 14px 10px;"></div></div><div class="clr height50"></div></div></div><div class="clr"></div></div></form><div class="clr"></div>';	
	
	$('#js_pincode_loaction_content').html(location_html);
	$('#location_popup').modal('show'); 

	if(open_by_choice==1)  // if user clicks to change location.
	{	
		if(city_name!='' && (current_pincode!='' || current_pincode!=0) && city_name.toLowerCase()!='others')
		{
			$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>Deliver in <strong>'+city_name.capitalize()+', '+current_pincode+'</strong>');		
		}
		else if(city_name=='')
		{
			$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>Deliver in <strong>'+current_pincode+'</strong>');		
		}
		else if(current_pincode=='' || current_pincode==0)
		{			
			load_autodetect_location();
		}
		if(city_name!='' &&  city_name.toLowerCase()=='others')
		{
			$('.js_pin_location_msg2').html(' enter a pincode');	
		}
		else
		{
			$('.js_pin_location_msg2').html('or enter a pincode');	
		}
		
	}
	else
	{
		load_autodetect_location();
	}		
} 

function load_autodetect_location()
{
	$('#js_pincode_loaction_content').attr('first_timers','Y');
	$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>We\'re detecting your location');
	$('.js_pin_location_msg2').html('or enter a pincode');
	if(navigator.geolocation) {	
		navigator.geolocation.getCurrentPosition(function(a) {	
			$('.js_pincode_location_message').html('<img src="https://res.sastasundar.com/incom/sspl_website/images/ssloader.gif" />');
			var catalogBaseUrl  = $('#js_ssplWebCnst').attr('catalog_base_url'); 				
			var crd = a.coords;						
			$.ajax({
				url: catalogBaseUrl+'location/getLocationByPincode',				
				type: 'POST',
				data: {latitude:crd.latitude,longitude:crd.longitude,'csrf_test_name':getCookie('sspl_csrf')},									
				dataType: 'json',
				success: function (location) {	
			
					if(!!location && !!location['Pincode'] && !isNaN(location['Pincode']) && location['CityName'].toLowerCase()!='others') 
					{							
						$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>Deliver in <strong>'+location['CityName'].capitalize()+', '+location['Pincode']+'</strong>');			
						$('.js_pin_location_msg2').html('or enter a pincode');	
						$('.js_pincode_location_message').attr('detected_pincode',location['Pincode']);
					}
					else
					{ 
						$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>We can\'t detect your location <span class="js_not_detect_location_info icon-info" style="position: relative;top: 2px; cursor:pointer;"></span>');
						$('.js_pin_location_msg2').html('enter a pincode');						
					}		
					$('.js_cart_loader_content').remove();
					$('.location_bg_fade').remove();					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 				
					$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>We can\'t detect your location <span class="js_not_detect_location_info icon-info" style="position: relative;top: 2px; cursor:pointer;"></span>');
					$('.js_pin_location_msg2').html('enter a pincode');
					$('.js_cart_loader_content').remove();
					$('.location_bg_fade').remove();
				}
			});
		}, 
		function(error) {		
			$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>We can\'t detect your location <span class="js_not_detect_location_info icon-info" style="position: relative;top: 2px; cursor:pointer;"></span>');
			$('.js_pin_location_msg2').html('enter a pincode');
			$('.js_cart_loader_content').remove();
			$('.location_bg_fade').remove();
		});
	 }		
	else{			
		$('.js_pincode_location_message').html('<i class="icon-location-1-nsm" style="font-size: 18px;color:#1879b7;position: relative;top: 2px;"></i>We can\'t detect your location <span class="js_not_detect_location_info icon-info" style="position: relative;top: 2px; cursor:pointer;"></span>');		
		$('.js_pin_location_msg2').html('enter a pincode');
		$('.js_cart_loader_content').remove();
		$('.location_bg_fade').remove();
	}	
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue+ "; " + expires + "; Path=/";
}

function getCookie(cname) {
    var re = new RegExp(cname + "=([^;]+)");
    var value = re.exec(document.cookie);
	var value2 = (value != null) ? decodeURIComponent(unescape(value[1])) : null;
	return (value2);
}

}
