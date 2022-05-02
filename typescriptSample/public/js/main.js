$(function () {
  function onLoad() {
    const requestConfig = {
      method: 'GET',
      url: '/users/status',
      data: {},
    };
    $.ajax(requestConfig).then((response) => {
			if (response.authenticated) {
				$('#login-status').show()
			} else {
        err(response.error);
      }
    });
  }

	onLoad();
});
