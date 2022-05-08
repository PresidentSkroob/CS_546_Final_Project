$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    if ($(ev.target).attr('id') == 'login-btn') {
      const email = $('#floatingInput').val().trim();
      const password = $('#floatingPassword').val().trim();
      
      if (email.length === 0) {
        return err('Email must not be empty or only spaces')
      }

      if (password.length === 0) {
        return err('Password must not be empty or only spaces');
      }

      const requestConfig = {
        method: 'POST',
        url: '/users/login',
        data: {
          email: email,
          password: password
        },
      };
      $.ajax(requestConfig).then(
        (response) => {
          if (response.authenticated) {
            window.location.href = '/';
          } else {
            return err(response.error);
          }
        },
        (response) => {
          return err(response.responseJSON.error);
        }
      );
    }
  });
});
