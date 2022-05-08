$(function () {
  $('#logout-url').click((ev) => {
    ev.preventDefault(); // cancel form submission
    const requestConfig = {
      method: 'GET',
      url: '/users/logout',
      data: {},
    };
    $.ajax(requestConfig).then(
      (response) => {
        if (response.success) {
          $('.login-status').hide();
          $('.portal').hide();
        } else {
          err(response.error);
        }
      },
      (response) => {
        err(response.responseJSON.error);
      }
    );
  });
});

/**
 * Displays an error message to the user
 *
 * @param {string} msg - error message to show
 */
function err(msg) {
  if (typeof msg !== 'string' || msg.length === 0) {
    msg = 'invalid error message';
  }
  $('.error-msg').text(msg);
  $('.error-div').show();
  window.scrollTo(0, 0);
}
