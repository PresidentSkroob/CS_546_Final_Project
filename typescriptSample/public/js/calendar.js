$(function () {
  var selectedHairdresser = $('#hairdressersdrop').val();
  var button = $('#submitbutton');
  button.hide();

  flatpickr('#datetime', {
    enableTime: true,
    minTime: '10:00',
    maxTime: '18:00',
    inline: true,
    minDate: 'today',
    disable: [
      function (date) {
        return date.getDay() === 0 || date.getDate() === new Date().getDate();
      },
    ],
    onChange: function (selectedDates, dateStr, instance) {
      selectedHairdresser = $('#hairdressersdrop').val();

      if (new Date(dateStr) === 'Invalid Date') {
        err('Error: Invalid date!');
        return;
      }

      var requestConfig = {
        method: 'POST',
        url: '/appointments/check',
        data: JSON.stringify({ dateStr: dateStr, hid: selectedHairdresser }),
        contentType: 'application/json',
      };

      $.ajax(requestConfig).then(function (res) {
        if (res.success === false) {
          err(res.error);
          button.hide();
        } else {
          $('.error-div').hide();
          button.show();
        }

        // console.log(res);
      });
    },
  });

  var datetime = $('#datetime');
  datetime.change(function () {
    // console.log("in change");
    if (isNaN(Date.parse(datetime.val()))) {
      err('Error: Invalid date!');
      button.hide();
    } else {
      $('.error-div').hide();
      button.show();
    }
  });

  // var dateForm = $('#datehairform');
  // dateForm.submit(function (event) {
  // 	event.preventDefault();
  // 	var dateTime = $('#datetime');
  // 	console.log(dateTime.val());
  // 	console.log(selectedHairdresser);

  // 	var requestConfig = {
  // 		method: "GET",
  // 		url: '/appointments/service',
  // 		data: JSON.stringify({
  // 			datestr: dateTime.val(),
  // 			hid: selectedHairdresser
  // 		}),
  // 		contentType: 'application/json',
  // 		success: function(data) {
  // 			window.location.href = "/appointments/service"
  // 		}
  // 	}

  // 	$.ajax(requestConfig);

  // });
});
