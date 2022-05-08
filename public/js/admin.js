$(function () {
  $('.levelDrop').change((e) => {
    const id = $(e.currentTarget).parent().attr('id');
    const lvl = $(e.currentTarget)
      .find('option:selected')
      .val()
      .trim()
      .toLowerCase();
    console.log(lvl);
    if (lvl !== 'user' && lvl !== 'admin' && lvl !== 'hairdresser') {
      return err('Level must be one of (client|admin|hairdresser)');
    }
    const requestConfig = {
      method: 'PATCH',
      url: `/users/${id}`,
      data: { level: lvl },
    };
    $.ajax(requestConfig).then(
      (response) => {
        if (response.error) {
          err(response.error);
        }
      },
      (response) => {
        err(response.responseJSON.error);
      }
    );
  });

  $('h3').click((e) => {
    $(e.currentTarget).siblings('div').eq(0).toggle();
  });
});
