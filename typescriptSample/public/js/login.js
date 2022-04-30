// $(() => {
// 	$('#login-form button').click((event) => {
// 		event.preventDefault();
// 		console.log('aaaa');
// 		const t = $(this);
// 		console.log($(this).attr('value'));
// 		switch ($(this).attr('value')) {
// 			case 'login-btn':
// 				console.log('bbbb');
// 				const requestConfig = {
// 					method: 'POST',
// 					url: apiLink,
// 					data: {
// 						username: 'alice',
// 						password: 'alice',
// 					},
// 				};
// 				$.ajax(requestConfig).then((response) => {
// 					alert(response);
// 				});
// 				break;
// 			case 'register-btn':
// 				break;
// 			case 'priv-login':
// 				break;
// 			default:
// 				err('invalid button. contact support.');
// 		}
// 	});
// });

$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    console.log('trying?');
    if ($(ev.target).attr('id') == 'login-btn') {
      //do button 1 thing
      const requestConfig = {
        method: 'POST',
        url: '/users/login',
        data: {
          email: $('#floatingInput').val().trim(),
          password: $('#floatingPassword').val().trim(),
        },
      };
      $.ajax(requestConfig).then((response) => {
        if (response.authenticated) {
          window.location.href = '/';
        } else {
          err(response.error);
        }
      });
    }
    if ($(this).attr('value') == 'button-two') {
      alert('Button Two Pressed, NOT SUBMITTING');
    }
    if ($(this).attr('value') == 'button-three') {
      alert('Button Three Pressed, NOT SUBMITTING');
    }
  });
});
