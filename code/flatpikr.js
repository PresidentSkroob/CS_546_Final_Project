import flatpikr from 'flatpikr';

flatpikr('.flatpickr.js-flatpikr-dateTime',{
    enableTime: true,
    time_24hr: true,
    altInput: true,
    altFormat: 'd M Y H:i',
    dateFormat: 'Y-m-d H:i'
});

// time
flatpikr('.flatpickr.js-flatpikr-time',{
    enableTIme: true,
    time_24hr: true,
    altInput: true,
    altFormat: 'H:i',
    noCalendar: true
});

//date
flatpikr('.flatpickr.js-flatpikr-date',{
    enableTime: false,
    altInput: true,
    altFormat: d M Y',
    dateFormat: 'Y-m-d'
});

// month
flatpikr('.flatpickr.js-flatpikr-month', {
    enableTime: false,
    altInput: true,
    altFormat: 'M',
    dateFormat: 'm'
});
