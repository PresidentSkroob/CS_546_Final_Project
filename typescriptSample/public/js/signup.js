$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    console.log('trying?');
    if ($(ev.target).attr('id') == 'signup-btn') {
      //do button 1 thing
      const requestConfig = {
        method: 'POST',
        url: '/users/signup',
        data: {
          email: $('#floatingInput').val().trim(),
          password: $('#floatingPassword').val().trim(),
          firstName: $('#floatingFirstName').val().trim(),
          lastName: $('#floatingLastName').val().trim()
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
