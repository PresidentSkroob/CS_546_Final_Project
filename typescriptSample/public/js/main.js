$(function () {
	$('#logout-url').click((ev) => {
    ev.preventDefault(); // cancel form submission
    const requestConfig = {
      method: 'GET',
      url: '/users/logout',
      data: {},
    };
    $.ajax(requestConfig).then((response) => {
			if (response.success) {
				$('.login-status').hide();
			} else {
        err(response.error);
			}
    });
  });
});
