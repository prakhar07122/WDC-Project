// var join_button = document.getElementById("join");

// join_button.addEventListener('click', () => {
//   if (join_button.innerText === "Join") {
//     join_button.innerText = "Leave";
//   }
//   else {
//     join_button.innerText = "Join";
//   }
// });



//X button in adminclubview page

// Get all the buttons with the class "remove_class"
var removeButtons = document.getElementsByClassName("remove_class");

// Iterate over each remove button
for (var i = 0; i < removeButtons.length; i++) {
  // Add a click event listener to each button
  removeButtons[i].addEventListener("click", function () {
    // Get the parent element of the button (divRow)
    var divRow = this.parentElement;

    // Remove the divRow from its parent (divTable)
    divRow.parentNode.removeChild(divRow);
  });
}


// Get all the "Event description" buttons
var descriptionButton = document.querySelectorAll('.btn.btn-secondary.event_description');

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



// Get all the "inviet" buttons
// var invietbutton = document.querySelectorAll(".invite");

// // // Get all the inviet modals
// var inviteModals = document.getElementsByClassName("private");

// // Iterate over each description button
// invietbutton.forEach((button, index) => {
//   // Add a click event listener to each button
//   button.addEventListener('click', () => {
//     // Display the corresponding modal
//     inviteModals[index].style.display = 'block';
//   });
// });


// // Get all the "close" spans
// var invietSpans = document.querySelectorAll('.private');

// // Iterate over each close span
// invietSpans.forEach((span, index) => {
//   // Add a click event listener to each span
//   span.addEventListener('click', () => {
//     // Hide the corresponding modal
//     inviteModals[index].style.display = 'none';
//   });
// });


//////////////////////////////////////////////////////database stuff//////////////////////////////////////////////////////////////////////////



function getmembrs() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/club_members", true);
  xhttp.onload = function () {
    if (xhttp.status === 200) {
      var club_members = JSON.parse(xhttp.responseText);
      var divTable = document.getElementById('divTable');
      // var divTable = document.querySelector(".divTable");
      var no = 1;
      club_members.forEach(function (member) {
        // console.log(member.Username);

        // Create a new divRow element
        var divRow = document.createElement("div");
        divRow.classList.add("divRow");

        // Create and append divCells for each property
        var divCellNo = document.createElement("div");
        divCellNo.classList.add("divCell");
        divCellNo.innerText = no++;
        divRow.appendChild(divCellNo);

        var divCellUsername = document.createElement("div");
        divCellUsername.classList.add("divCell");
        divCellUsername.innerText = member.Username;
        divRow.appendChild(divCellUsername);

        var divCellEmail = document.createElement("div");
        divCellEmail.classList.add("divCell");
        divCellEmail.innerText = member.Email;
        divRow.appendChild(divCellEmail);

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("remove_class");
        deleteButton.type = "button";
        deleteButton.innerText = "X";
        divRow.appendChild(deleteButton);

        deleteButton.addEventListener("click", () => {
          divRow.parentNode.removeChild(divRow);
        });
        // Append the new divRow to divTable
        divTable.appendChild(divRow);
      });
    }
  };
  xhttp.send();
}

var save_EventID;


function getevents() {
  var xhttp = new XMLHttpRequest();
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('clubId');
  xhttp.open("GET", "/club_events?id=" + myParam, true);
  xhttp.onload = function () {
    if (xhttp.status === 200) {
      var club_events = JSON.parse(xhttp.responseText);
      var optionSelected = document.querySelector("#eventmodal input[type='radio']:checked").id;

      club_events.forEach(function (event) {
        // console.log(event.EventName);

        // Create the new event item
        var newEventItem = document.createElement("li");
        newEventItem.className = "ligap";
        newEventItem.textContent = event.EventName + ", " + event.Location + ", " + new Date(event.Date).toISOString().slice(0, 9);
        save_EventID = event.EventID;
        console.log("this event id", event.EventID);
        var flexContainer = document.createElement("div");
        flexContainer.className = "flex-container";

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("btn");
        deleteButton.classList.add("btn-secondary");
        deleteButton.classList.add("delete");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        var eventDescButton = document.createElement("button");
        eventDescButton.classList.add("btn");
        eventDescButton.classList.add("btn-secondary");
        eventDescButton.classList.add("event_description");
        eventDescButton.type = "button";
        eventDescButton.textContent = "Event description";

        // <button v-on:click ="rsvp_me" id="rsvp" class="btn btn-secondary" type="button">Click to send join request</button>

        var eventStat = document.createElement("div");

        var yesno = event.EventStatus;
        eventStat.classList.add("event_stat");
        if (yesno === 1) {
          eventStat.textContent = "Private";
        }
        else {
          eventStat.textContent = "Public";
        }


        flexContainer.appendChild(deleteButton);
        flexContainer.appendChild(eventDescButton);
        flexContainer.appendChild(eventStat);


        var RSVP_btn = document.createElement("button");
        RSVP_btn.classList.add("btn");
        RSVP_btn.classList.add("btn-secondary");
        RSVP_btn.classList.add("private");
        RSVP_btn.type = "button";
        RSVP_btn.textContent = "RSVP";
        flexContainer.appendChild(RSVP_btn);
        RSVP_btn.onclick = function () { rsvp_me(myParam, event.EventName, event.Location, event.EventDescription, new Date(event.Date).toISOString().slice(0, 9)); };



        newEventItem.appendChild(flexContainer);


        // Get the event description modal
        var eventDescriptionModal = document.createElement("div");
        eventDescriptionModal.classList.add("modal");
        eventDescriptionModal.classList.add("descriptionmodal");

        var modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        var closeSpan = document.createElement("span");
        closeSpan.className = "close";
        closeSpan.textContent = "x";

        var descriptionParagraph = document.createElement("p");
        descriptionParagraph.textContent = event.EventDescription;

        modalContent.appendChild(closeSpan);
        modalContent.appendChild(descriptionParagraph);

        eventDescriptionModal.appendChild(modalContent);

        // Append the new event item and event description modal to the respective containers
        var eventList = document.getElementById("event_list");
        var modalGroup = document.getElementById("modals_group");
        eventList.append(newEventItem);
        modalGroup.appendChild(eventDescriptionModal);

        // addEventListener to the description modal
        eventDescButton.addEventListener("click", () => {
          eventDescriptionModal.style.display = "block";
        });

        closeSpan.addEventListener("click", () => {
          eventDescriptionModal.style.display = "none";
        });

      });
    }
  };
  xhttp.send();
}



// 获取当前 URL 和 clubId
const currentUrl = window.location.href;
// console.log("currentUrl");
// console.log(currentUrl);
const url = new URL(currentUrl);
// console.log("url");
// console.log(url);
const searchParams = new URLSearchParams(url.search);
// console.log("searchParams");
// console.log(searchParams);
const clubId = searchParams.get("clubId"); // 修改为与服务器端路由中的查询参数名称一致
console.log("ClubID");
console.log(clubId);
// get_manager_name(clubId);


function getclub() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/clubinfo", true);
  xhttp.onload = function () {
    if (xhttp.status === 200) {
      var clubinfo = JSON.parse(xhttp.responseText);
      var about_text = document.querySelector('#myModal p');

      about_text.innerText = clubinfo[clubId - 1].About_club;
    }
  };
  xhttp.send();
}



var app2 = new Vue({
  el: '#AdminClubView',
  data: {
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    Id: ""
    //add more data if you want,if the data come from seesion
    //you need to use populate() down there.
  },
  methods: {
    populate: function () {
      fetch('/mainPage')
        .then(response => response.json())
        .then(data => {
          // console.log("FF");
          // console.log(data);

          app2.username = data.Username;
          app2.Id = data.UserID;
          app2.email = data.Email;
          app2.firstname = data.FamilyName;
          app2.lastname = data.GivenName;
          //if you wanna add designation
          //go to data, add designation = ""
          //and write app.designation = data.Designation
        })
        .catch(error => {
          console.error('Error:', error);
        });

    },
    get_manager_name: function (id) {


      fetch('/mainPage')
        .then(response => response.json())
        .then(data => {
          console.log("this is my data: ", data);
          console.log("club id is: ", id);
          var q = '/get_manager?ClubID=' + id;
          fetch(q)
            .then(function (response) {
              console.log("respns jason ");
              return response.json();
            })
            .then(function (responseData) {
              console.log("my data base info", responseData);
              // console.log("my useris: ", data.GivenName);
              document.getElementById("club_name").innerText = responseData[0].Club_name + " Club";
              var joinButton = document.getElementById("join");
              var done_btn = document.getElementById("done");
              var club_manager_name = responseData[0].Manager;

              function joinButtonClick() {
                console.log("Join button clicked!");

                if (joinButton.innerText === "Join") {
                  joinButton.innerText = "Leave";
                }
                else {
                  joinButton.innerText = "Join";
                }

                let member =
                {
                  ClubID: id,
                  UserID: data.UserID
                };

                if (joinButton.innerText === "Leave") {
                  var xhttp_add = new XMLHttpRequest();
                  xhttp_add.open("POST", "/add_member", true);
                  xhttp_add.setRequestHeader("Content-type", "application/json");
                  console.log("here");
                  xhttp_add.send(JSON.stringify(member));
                }

                else if (joinButton.innerText === "Join") {
                  var xhttp_del = new XMLHttpRequest();
                  xhttp_del.open("DELETE", "/delete_member", true);
                  xhttp_del.setRequestHeader("Content-type", "application/json");
                  console.log("here");
                  xhttp_del.send(JSON.stringify(member));
                }
              }
              joinButton.addEventListener("click", joinButtonClick);


              function done_btnButtonClick() {

                var radioButtonValue;
                if (document.getElementById('option1').checked) {
                  radioButtonValue = 1; // Private
                }
                else {
                  radioButtonValue = 0; // Public
                }

                let eventtobase =
                {
                  EventName: document.querySelector("#eventmodal #Event_name").value,
                  Date: document.querySelector("#eventmodal #date").value,
                  EventDescription: document.querySelector("#eventmodal textarea").value,
                  EventStatus: radioButtonValue,
                  ClubID: id,
                  Location: document.querySelector("#eventmodal #Event_location").value
                };

                var xhttp_add = new XMLHttpRequest();
                xhttp_add.open("POST", "/add_eventtobase", true);
                xhttp_add.setRequestHeader("Content-type", "application/json");
                console.log("done");
                xhttp_add.send(JSON.stringify(eventtobase));

              }
              done_btn.addEventListener("click", done_btnButtonClick);

              var deleteButtons = document.getElementsByClassName("btn btn-secondary delete");
              // Attach a click event listener to each delete button
              for (var i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener("click", function () {
                  // Get the index of the clicked delete button
                  var index = Array.from(deleteButtons).indexOf(this);
                  console.log("Clicked delete button index:", index);

                  if (index !== -1) {

                    var radioButtonValue = document.getElementsByClassName("ligap")[index].children[0].children[2].innerText;
                    if (radioButtonValue === "Private") {
                      radioButtonValue = 1; // Private
                    }
                    else {
                      radioButtonValue = 0; // Public
                    }

                    // console.log("this index", index);
                    let del_event =
                    {
                      EventDescription: document.getElementsByClassName("descriptionmodal")[index].children[0].children[1].innerText,
                      EventStatus: radioButtonValue,
                      ClubID: id
                    };


                    console.log(del_event);
                    var xhttp_del = new XMLHttpRequest();
                    xhttp_del.open("DELETE", "/delete_event", true);
                    xhttp_del.setRequestHeader("Content-type", "application/json");
                    console.log("del_event");
                    xhttp_del.send(JSON.stringify(del_event));
                  }

                });
              }

              var del_user_btn = document.getElementsByClassName("remove_class");
              // Iterate over each remove button
              for (var x = 0; x < del_user_btn.length; x++) {
                // Add a click event listener to each button
                del_user_btn[x].addEventListener("click", function () {
                  // Get the parent element of the button (divRow)
                  var divRow = this.parentElement;

                  console.log("this row", divRow.getElementsByClassName('divCell')[2].textContent);

                  let del_member_db =
                  {
                    Email: divRow.getElementsByClassName('divCell')[2].textContent
                  };


                  console.log(del_member_db);
                  var xhttp_del = new XMLHttpRequest();
                  xhttp_del.open("DELETE", "/delete_member_from_db", true);
                  xhttp_del.setRequestHeader("Content-type", "application/json");
                  console.log("del_member_db");
                  xhttp_del.send(JSON.stringify(del_member_db));

                });
              }

              function hide() {
                document.getElementById("divTable").style.display = "none";
                document.getElementById("h2_userinformation").style.display = "none";
                document.getElementById("add_event").style.display = "none";
              }


              //check the culb manager and if user logged in.
              if (data.length === 0) {
                console.log('not logged in');
                document.getElementById("event_list").style.display = "none";
                document.getElementById("join").style.display = "none";
                hide();
              }

              else if (club_manager_name !== data.Username) {
                document.getElementById("admin").innerText = "User name: " + data.Username;
                hide();

                var delete_none = document.getElementsByClassName("delete");
                for (let i = 0; i < delete_none.length; i++) {
                  delete_none[i].style.display = "none";
                }

                // var event_stat_none = document.getElementsByClassName("event_stat");
                // for (let i = 0; i < event_stat_none.length; i++) {
                //   event_stat_none[i].style.display = "none";
                // }

              }

              else {
                document.getElementById("join").style.display = "none";
              }

            });

          // var event_table = '/club_events';
          // fetch(event_table)
          //   .then(function (response) {
          //     console.log("event_table jason ");
          //     return response.json();
          //   })
          //   .then(function (responseData) {
          //     console.log("this is for rsvp", responseData);

          //   });

        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  },
  mounted() {
    this.populate();
    this.get_manager_name(clubId);
  }
});


function rsvp_me(clubid, eventtitle, venue, description, date) {
  let rsvpinfo = {};
  rsvpinfo.Club_id = clubid;
  rsvpinfo.Event_title = eventtitle;
  rsvpinfo.Venue = venue;
  rsvpinfo.event_description = description;
  rsvpinfo.Date = date;
  var xhttp_del = new XMLHttpRequest();
  xhttp_del.open("POST", "/rsvp-me", true);
  xhttp_del.setRequestHeader("Content-type", "application/json");
  xhttp_del.send(JSON.stringify(rsvpinfo));
}

document.addEventListener("DOMContentLoaded", getevents);
document.addEventListener("DOMContentLoaded", getclub);
// document.addEventListener("click", addmember);
document.addEventListener("DOMContentLoaded", getmembrs);
// document.addEventListener("DOMContentLoaded", getmanager);





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


// Get the delete buttons
var eventListt = document.getElementById("event_list");

eventListt.addEventListener("click", function (event) {

  if (event.target.classList.contains("delete")) {
    // Get the closest li element
    var listItem = event.target.closest("li");
    var index = Array.from(listItem.parentElement.children).indexOf(listItem);
    listItem.remove();

    var descriptionModal = document.getElementsByClassName("descriptionmodal")[index];
    descriptionModal.remove();
  }
});


var addevent_modal = document.getElementById("eventmodal");
var addevent_btn = document.getElementById("add_event");
var done_btn = document.getElementById("done");
var close_btn = document.getElementsByClassName("close")[1];

//add event
addevent_btn.onclick = function () {
  addevent_modal.style.display = "block";
};

close_btn.onclick = function () {
  addevent_modal.style.display = "none";
};

done_btn.onclick = function () {
  addevent_modal.style.display = "none";
};


// Get the "Done" button
var doneButton = document.getElementById("done");

// Add click event listener to the "Done" button
doneButton.addEventListener("click", function () {
  // Get the input values
  var eventTitle = document.querySelector("#eventmodal input[type='text'][placeholder='Event name']").value;
  var location = document.querySelector("#eventmodal input[type='text'][placeholder='Event location']").value;
  var date = document.querySelector("#eventmodal input[type='date']").value;
  var description = document.querySelector("#eventmodal textarea").value;
  var optionSelected = document.querySelector("#eventmodal input[type='radio']:checked").id;

  // Create the new event item
  var newEventItem = document.createElement("li");
  newEventItem.className = "ligap";
  newEventItem.textContent = eventTitle + ", " + location + ", " + date;

  var flexContainer = document.createElement("div");
  flexContainer.className = "flex-container";

  var deleteButton = document.createElement("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-secondary");
  deleteButton.classList.add("delete");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  var eventDescButton = document.createElement("button");
  eventDescButton.classList.add("btn");
  eventDescButton.classList.add("btn-secondary");
  eventDescButton.classList.add("event_description");
  eventDescButton.type = "button";
  eventDescButton.textContent = "Event description";

  var eventStat = document.createElement("div");
  eventStat.classList.add("event_stat");
  eventStat.textContent = optionSelected === "option1" ? "Private" : "Public";

  flexContainer.appendChild(deleteButton);
  flexContainer.appendChild(eventDescButton);
  flexContainer.appendChild(eventStat);

  var RSVP_btn = document.createElement("button");
  RSVP_btn.classList.add("btn");
  RSVP_btn.classList.add("btn-secondary");
  RSVP_btn.classList.add("private");
  RSVP_btn.type = "button";
  RSVP_btn.textContent = "RSVP";
  flexContainer.appendChild(RSVP_btn);

  newEventItem.appendChild(flexContainer);


  // Get the event description modal
  var eventDescriptionModal = document.createElement("div");
  eventDescriptionModal.classList.add("modal");
  eventDescriptionModal.classList.add("descriptionmodal");

  var modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  var closeSpan = document.createElement("span");
  closeSpan.className = "close";
  closeSpan.textContent = "x";

  var descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = description;

  modalContent.appendChild(closeSpan);
  modalContent.appendChild(descriptionParagraph);

  eventDescriptionModal.appendChild(modalContent);

  // Append the new event item and event description modal to the respective containers
  var eventList = document.getElementById("event_list");
  var modalGroup = document.getElementById("modals_group");
  eventList.append(newEventItem);
  modalGroup.appendChild(eventDescriptionModal);

  /////////////////////////////////////////////////////////////////////////////////////

  var divTable = document.createElement("div");
  divTable.className = "divTable";

  var headerRow = document.createElement("div");
  headerRow.className = "headerRow";

  var noCell = document.createElement("div");
  noCell.className = "divCell";
  noCell.innerHTML = "<b>No</b>";

  var usernameCell = document.createElement("div");
  usernameCell.className = "divCell";
  usernameCell.innerHTML = "<b>User name</b>";

  var removeCell = document.createElement("div");
  removeCell.className = "divCell";
  removeCell.innerHTML = "<b>Remove</b>";

  headerRow.appendChild(noCell);
  headerRow.appendChild(usernameCell);
  headerRow.appendChild(removeCell);
  divTable.appendChild(headerRow);


  // addEventListener to the description modal
  eventDescButton.addEventListener("click", () => {
    eventDescriptionModal.style.display = "block";
  });

  closeSpan.addEventListener("click", () => {
    eventDescriptionModal.style.display = "none";
  });

});


if (!hasRefreshed) {
  // If it hasn't been refreshed, refresh the page
  localStorage.setItem('hasRefreshed', 'true');
  location.reload();
}
