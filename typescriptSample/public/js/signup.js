$(function () {
  $('#login-form button').click(function (ev) {
    ev.preventDefault(); // cancel form submission
    if ($(ev.target).attr('id') == 'signup-btn') {
      const firstName = $('#floatingFirstName').val().trim();
      if (firstName.length === 0) {
        return err('First name must not be empty or only spaces');
      }
      const lastName = $('#floatingLastName').val().trim();
      if (lastName.length === 0) {
        return err('Last name must not be empty or only spaces');
      }
      const email = $('#floatingInput').val().trim();
      if (email.length === 0) {
        return err('Email must not be empty or only spaces');
      }
      const password = $('#floatingPassword').val().trim();
      if (password.length === 0) {
        return err('Password must not be empty or only spaces');
      }

      const requestConfig = {
        method: 'POST',
        url: '/users/signup',
        data: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
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
        console.log(response)
          err(response.responseJSON.error);
        }
      );
    }
  });
});
