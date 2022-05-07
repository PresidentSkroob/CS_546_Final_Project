$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    if ($(ev.target).attr('id') == 'login-btn') {
      const requestConfig = {
        method: 'POST',
        url: '/users/login',
        data: {
          email: $('#floatingInput').val().trim(),
          password: $('#floatingPassword').val().trim(),
        },
      };
      $.ajax(requestConfig).then(
        (response) => {
          if (response.authenticated) {
            window.location.href = '/';
          } else {
            err(response.error);
          }
        },
        (response) => {
          err(response.responseJSON.error);
        }
      );
    }
  });
});
