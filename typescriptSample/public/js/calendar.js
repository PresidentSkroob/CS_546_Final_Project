// $(function() {
// 	$("#datetime").flatpickr({
// 		enableTime: true,
// 		minTime: "10:00",
// 		maxTime: "18:00",
// 		inline: true
// 	})


// });


$(function() {

	var dateTime = $('#datetime');

	flatpickr("#datetime", {
		enableTime: true,
		minTime: "10:00",
		maxTime: "18:00",
		inline: true,
		minDate: "today",
		disable: [ 
			function(date) { 
				return (date.getDay() === 0 || date.getDate() === new Date().getDate());
			}

		], 
		onChange: function(selectedDates, dateStr, instance) { 
			console.log(`dateStr in onChange: ${dateStr}`)
			var requestConfig = { 
				method: "POST",
				url: "/appointments/bydate",
				data: JSON.stringify({ dateStr: dateStr } ),
				contentType: 'application/json'
			}

			$.ajax(requestConfig).then(function (res) { 
				console.log(res);

			});



		}
	});
});