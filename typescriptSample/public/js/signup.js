$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    if ($(ev.target).attr('id') == 'signup-btn') {
      const requestConfig = {
        method: 'POST',
        url: '/users/signup',
        data: {
          email: $('#floatingInput').val().trim(),
          password: $('#floatingPassword').val().trim(),
          firstName: $('#floatingFirstName').val().trim(),
          lastName: $('#floatingLastName').val().trim(),
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
  });
});
