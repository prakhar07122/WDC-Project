// Get all the "Event description" buttons
const descriptionButton = document.querySelectorAll('.btn.btn-secondary.event_description');

// // Get all the description modals
var descriptionModals = document.getElementsByClassName("descriptionmodal");

// Iterate over each description button
descriptionButton.forEach((button, index) => {
  // Add a click event listener to each button
  button.addEventListener('click', () => {
    // Display the corresponding modal
    descriptionModals[index].style.display = 'block';
  });
});
//////////////////////////////////////////////////////////////////////////////////

// Get all the "close" spans
var closeSpans = document.querySelectorAll('.modal.descriptionmodal .close');
// Iterate over each close span
closeSpans.forEach((span, index) => {
  // Add a click event listener to each span
  span.addEventListener('click', () => {
    // Hide the corresponding modal
    descriptionModals[index].style.display = 'none';
  });
});
////////////////////////////////////////////////////////////////////////////

var join_button = document.getElementById("join");

join_button.addEventListener('click', () => {
  if (join_button.innerText === "Join") {
    join_button.innerText = "Leave";
  }
  else {
    join_button.innerText = "Join";
  }
});

var app = new Vue({
  el: "#events",
  data: {
    Club_name: '',
    Event_title: '',
    Venue: '',
    Date: '',
    event_description: ''
  },
  methods: {
    // rsvp_me: function(Club_name, Event_title, Venue, Date, event_description){
    rsvp_me: function () {
      let data = {};
      data.Club_name = "Club_name";
      data.Event_title = "Event_title";
      data.Venue = "Venue";
      data.Date = "Date";
      data.event_description = "event_description";
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.readyState === 200) {
          location.reload();
        }
      };
      req.open("POST", "/rsvp-me", true);
      req.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      req.send(JSON.stringify(data));
    },
    populate_rsvp_date: function () {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          if (this.responseText === '') {
            app.is_user_logged_in = false;
          }
          else {
            let data = JSON.parse(this.response);
            app.all_rsvp = data;
          }
        }
      };
      req.open("GET", "/get-rsvp");
      req.send();
    },
    mounted() {
      this.populate_rsvp_date();
    }
  }
});
