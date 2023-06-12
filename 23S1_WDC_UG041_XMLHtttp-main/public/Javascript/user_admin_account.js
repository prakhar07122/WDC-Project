////////////////YOUR DETAILS////////////////////////////////////////////////////////////////////////

function displayaccount() {
  document.getElementById("account_spase").style.display = "none";
  document.getElementById("contact_spase").style.display = "block";
}
function displaycontact() {
  document.getElementById("account_spase").style.display = "block";
  document.getElementById("contact_spase").style.display = "none";
}

/////////////////////////////////////////////////////////USER ADMIN//////////////////////////
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


////////////////////////////////////////////////////////ADMIN////////////////////////////////
//block
var addevent_modal = document.getElementById("eventmodal");
var description_modal = document.getElementById("descriptionmodal");
var addevent_btn = document.getElementById("add_event");


//none
var done_btn = document.getElementById("done");
var des = document.getElementById("event_description");
var close_des_id = document.getElementById("close_des");
var close_btn = document.getElementsByClassName("close")[1];
var close_des = document.getElementsByClassName("close")[2];


//description_modal
// des.onclick = function() {
//   description_modal.style.display = "block";
// };

// close_des_id.onclick = function() {
//   description_modal.style.display = "none";
// };

// close_des.onclick = function() {
//   description_modal.style.display = "none";
// };



// close_des.onclick = function() {
//   description_modal.style.display = "none";
// };


//add event
// addevent_btn.onclick = function() {
//   addevent_modal.style.display = "block";
// };

// close_btn.onclick = function() {
//   addevent_modal.style.display = "none";
// };

// done_btn.onclick = function() {
//   addevent_modal.style.display = "none";
// };




// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target === modal) {
//     addevent_modal.style.display = "none";
//   }
// };


var app = new Vue({
  el: '#Your_details',
  data: {
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    Id: ""
  },
  methods: {
    populate: function () {
      fetch('/mainPage')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          app.username = data.Username;
          app.email = data.Email;
          app.Id = data.UserID;
          app.firstname = data.GivenName;
          app.lastname = data.FamilyName;

        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    update_details: function () {
      var data = {};
      data.firstname = document.getElementById('firstname').value;
      data.lastname = document.getElementById('lastname').value;
      data.email = document.getElementById('email').value;
      data.id = app.Id;

      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          window.location.href = "/Your_details.html";
        }
      };
      req.open("POST", "/update_user_details");
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify(data));
    }
  },
  mounted() {
    this.populate();
  }
});
