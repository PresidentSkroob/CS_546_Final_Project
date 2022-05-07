/* script.js
Display the current month using JavaScript. 
Will use the js object 'getMonth' 
*/

const date = new Date();

//create a GLOBAL function
const renderCalendar = () => {
  date.setDate(1);

  const month = date.getMonth();

  const monthDays = document.querySelector(".days");

  // Define the ending date for each month via 1) current year 2) current month
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // Varible to get the last days of previous month on the calendar
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  // Variable to store the index of the first month
  const firstDayIndex = date.getDay();

  // define the index number of the last of the current month
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  /* create the variable 'months' that will be an array numbered 0-11 */
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /* display the h1 headings for the current month */
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  /* in order to display the days - using a for loop 
create the variable for days
create the variable for days shown of the previous and future month on calendar
*/

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class=>"prev-date">${prevLastDay - x + 1} </div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
      // x += 10  means x=x+10
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innterHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
