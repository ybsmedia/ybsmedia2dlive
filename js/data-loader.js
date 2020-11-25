/*
 *	 CONFIGURATIONS
 */
var config_data_file = "local-data.txt";
var config_live_file = "js/live-data.php";
var config_animation_duration = 300; // Larger number for longer
var config_refresh_frequency = 3000//6000; // Every second = 1000
var config_live_counter = 0; //Default is 12 Used to delay LIVE data refresh. config_live_counter * config_refresh_frequency = live refresh
var config_fade_effect_counter = 0; //Default is config_refresh_frequency/2 Used to delay fade effect on page.

/*
 *	 VARIABLES
 */
// Determine if data was loaded for the first time
var initial_load = 1;
// Declare global variable
var default_duration = config_animation_duration;
var local_loaded = 0;
var live_enabled = 0;
// Make sure first load will get live data
var live_load_counter = config_live_counter;

// fade effect time (only fade effect show not call request.)
var fade_effect = 1;

/*
 *	FUNCTIONS
 */

function loadData() {
	// Declarations
	var local_array = [];
	var live_loaded = 0;
	// var local_value1 = '--';
	var live_set, live_value, live_mm2d1, live_mm2d2;
	var local_value1, local_value2, local_value3, local_date1, local_date2, local_date3;
	var local_date4, local_value4_m, local_value4_i, local_date5, local_value5_m, local_value5_i;


	var local_value2_key, local_value3_key;
	// Reconfigure default animation duration
	config_animation_duration = default_duration;
	
	// Get current date time 2020-02-14 16:30:01
	var datetime = "Updated: ";
	datetime += new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
	

	// if fade effect is off(0) then new request hit and get data to display else bypass
	if(config_fade_effect_counter == 0){
		var tt = new Date($.now());
		fade_effect = 1;
		// Get local text value
		$.ajax({
			url: config_data_file,
			dataType: "text",
			async: false,
			cache: false,
			success: function(data)
			{

	            // Process CSV to local_array
				var csv_data = data.split(/\r?\n|\r/);
				for(var count = 0; count<csv_data.length; count++)
				{
					var cell_data = csv_data[count].split(",");
					if (count == 0) {
						// Provide instant refresh if live mode is reenabled
						if (live_enabled == 0 && cell_data[1] == 1)
							live_load_counter = config_live_counter;
						// Get fetch mode (1 = enabled)
						live_enabled = cell_data[1];
					}
					// Put essential data into array
					if (count > 1) { // Ignore first two rows
						local_array.push(cell_data);
					}
				}
				
				// console.log(local_array);
				// Store values in variable to reuse
				local_value1 = local_array[0][1];
				local_value2 = local_array[1][1];
				local_value3 = local_array[2][1];
				
				local_date1 = datetime;
				local_date2 = local_array[1][0];
				local_date3 = local_array[2][0];
				
				local_date4 = local_array[3][0];
				local_value4_m = local_array[3][2];
				local_value4_i = local_array[3][3];
				local_value4_key = local_array[3][4];
				
				local_date5 = local_array[4][0];
				local_value5_m = local_array[4][2];
				local_value5_i = local_array[4][3];
				local_value5_key = local_array[4][4];

				local_value2_key = local_array[1][4];
				local_value3_key = local_array[2][4];
				
				// Display stored local data
				if (local_loaded == 0 || true) {
					// Load all values on first load. Ignore animation
					$('#data-date1').html(datetime);
					/*if(local_loaded==0){
						console.log("local_loaded==0 => " +local_value1);
						$('#data-value1').text(local_value1);	
					}*/
					
					$('#data-date2').text(local_date2);
					$('#data-value2').text(local_value2);
					$('#data-value2_key').text(local_value2_key);
					
					$('#data-date3').text(local_date3);
					$('#data-value3').text(local_value3);
					$('#data-value3_key').text(local_value3_key);
					
					$('#data-date4').text(local_date4);
					$('#data-value4-m').text(local_value4_m);
					$('#data-value4-i').text(local_value4_i);
					$('#data-value4-key').text(local_value4_key);
					
					$('#data-date5').text(local_date5);
					$('#data-value5-m').text(local_value5_m);
					$('#data-value5-i').text(local_value5_i);
					$('#data-value5-key').text(local_value5_key);
				}
				
				// Load local data completed
				local_loaded = 1;
			}
		});
		
		/*
		 *	SCRAP STOCK EXCHANGE DATA
		 */
		// Fetch script is enabled
		if (live_enabled == 1) {
			// Check if it time to refresh live data again
			if (live_load_counter >= config_live_counter) {
				// Get live json value to populate
				$.ajax({
					url: config_live_file,
					dataType: "json",
					async: false,
					cache: false,
					success: function(data) {
						// Update essential data into variable
						live_set = data.set;
						live_value = data.val;
						live_mm2d1 = data.mm2d1;
						live_mm2d2 = data.mm2d2;
						local_value1 =live_mm2d1 + live_mm2d2;
						// Load live data completed
						live_loaded = 1;
					}
					
				});
				// Reset counter to wait for new cycle
				live_load_counter = 0;
			} else {
			// Increase counter to live_load attempt
				live_load_counter++;
			
			}			
		}
		// $('#data-value1').text(local_value1);
	}else{
		// only show fade effect 
		config_fade_effect_counter = 0;
		fade_effect = 0;
		// Set and animate SET
		$('#data-main-set').fadeOut(config_animation_duration, function() {
			$('#data-main-set').fadeIn(config_animation_duration);
		});
		// Set and animate VALUE
		$('#data-main-val').fadeOut(config_animation_duration, function() {
			$('#data-main-val').fadeIn(config_animation_duration);
		});
		// Set and animate main 2D
		$('#data-value1').fadeOut(config_animation_duration, function() {
			$('#data-value1').fadeIn(config_animation_duration);
		});
		// 2pm 2D
		$('#data-value2').fadeOut(config_animation_duration, function() {
			$('#data-value2').fadeIn(config_animation_duration);
		});
		// 4pm 2D
		$('#data-value3').fadeOut(config_animation_duration, function() {
			$('#data-value3').fadeIn(config_animation_duration);
		});
	}

	if(fade_effect == 1){
		config_fade_effect_counter = 1;
	}
	

	// console.log("============================");
	/*
	 *	ANIMATE DATA REFRESH TOGETHER HERE
	 */
	
	if (initial_load == 0) {
		// Store default animation duration for later use
		default_duration = config_animation_duration;
		// Disable animation on first run
		config_animation_duration = 0;
	}
	
	// Display local data only - live failed or disable
	if (live_loaded != 1 && local_loaded == 1) {	
		// If live mode is enabled, animate anyway
		if (live_enabled == 1) {
			// Set and animate SET
			$('#data-main-set').fadeOut(config_animation_duration, function() {
				$('#data-main-set').text(live_set);
				$('#data-main-set').fadeIn(config_animation_duration);
			});
			// Set and animate VALUE
			$('#data-main-val').fadeOut(config_animation_duration, function() {
				$('#data-main-val').text(live_value);
				$('#data-main-val').fadeIn(config_animation_duration);
			});
		} else {
			// Hide Stock Header section
			$('#stock-header').fadeOut(config_animation_duration, function() {});
			
		}
		
		// Set and Main date
		/*$('#data-date1').fadeOut(config_animation_duration, function() {
			console.log("3");
			$('#data-date1').html(datetime);
			$('#data-date1').fadeIn(config_animation_duration);
		});*/
		// Set and animate main 2D
		$('#data-value1').fadeOut(config_animation_duration, function() {
			if (live_enabled != 1) {
				$('#data-value1').text(local_value1);
			}
			$('#data-value1').fadeIn(config_animation_duration);
		});
		// 2pm 2D
		$('#data-value2').fadeOut(config_animation_duration, function() {
			$('#data-value2').text(local_value2);
			$('#data-value2').fadeIn(config_animation_duration);
		});
		// 4pm 2D
		$('#data-value3').fadeOut(config_animation_duration, function() {
			$('#data-value3').text(local_value3);
			$('#data-value3').fadeIn(config_animation_duration);
		});
		
		// 6pm modern internet
		$('#data-value4-m').text(local_value4_m);
		$('#data-value4-i').text(local_value4_i);
		// 8pm modern internet
		$('#data-value5-m').text(local_value5_m);
		$('#data-value5-i').text(local_value5_i);
		
		// Display online data and local data
	} else if (live_loaded == 1 || config_fade_effect_counter) {
		// Display live and local data
		
		// Unhide Stock Header if it was hidden before
		$('#stock-header').css('display', 'block');
		
		// Set and animate SET
		$('#data-main-set').fadeOut(config_animation_duration, function() {
			$('#data-main-set').text(live_set);
			$('#data-main-set').fadeIn(config_animation_duration);
		});
		// Set and animate VALUE
		$('#data-main-val').fadeOut(config_animation_duration, function() {
			$('#data-main-val').text(live_value);
			$('#data-main-val').fadeIn(config_animation_duration);
		});
		// Set and Main date
		/*$('#data-date1').fadeOut(config_animation_duration, function() {
			$('#data-date1').html(datetime);
			$('#data-date1').fadeIn(config_animation_duration);
		});*/
		// Set and animate main 2D
		$('#data-value1').fadeOut(config_animation_duration, function() {
			$('#data-value1').text(live_mm2d1 + live_mm2d2);
			$('#data-value1').fadeIn(config_animation_duration);
		});
		
		/* LOCAL */
		// 2pm 2D
		$('#data-value2').fadeOut(config_animation_duration, function() {
			$('#data-value2').text(local_value2);
			$('#data-value2').fadeIn(config_animation_duration);
		});
		// 4pm 2D
		$('#data-value3').fadeOut(config_animation_duration, function() {
			$('#data-value3').text(local_value3);
			$('#data-value3').fadeIn(config_animation_duration);
		});
		// 6pm modern internet
		$('#data-value4-m').text(local_value4_m);
		$('#data-value4-i').text(local_value4_i);
		// 8pm modern internet
		$('#data-value5-m').text(local_value5_m);
		$('#data-value5-i').text(local_value5_i);
	}
	
	// Initial data load completed
	initial_load = 1;
	
}

// Begin action only when page is loaded
$(document).ready(function() {
	loadData(); // This will run on page load
	setInterval(function(){
	    loadData() // this will run after every 5 seconds
	}, config_refresh_frequency);
});