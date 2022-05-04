$(function () {
  /**
   * Makes an AJAX request to the server to get a QR code and display it
   *
   */
  function onLoad() {
    const requestConfig = {
      method: 'POST',
      url: '/contact/qr',
      data: { url: window.location.origin },
    };
    $.ajax(requestConfig).then((response) => {
      if (response.success) {
        $('#qr-img').attr('src', response.img);
        $('#qr-img').show();
      } else {
        err(response.error);
      }
    });
  }

  onLoad();

});
