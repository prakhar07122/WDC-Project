//vue.js

var app = new Vue({
  el: '#app',
  data: {
    UserOrEmail: "",
    Password: ""
  }
});

var app1 = new Vue({
  el: '#app1',
  data: {
    Password: "",
    password1: "",
    password2: "",
    ShowPassword: false
  },
  methods:
  {
    passwordCheck: function () {
      if (this.password1 === this.password2) {
        this.error = false;
        document.getElementById('passStatus').innerText = 'Password match!';
        document.getElementById('passStatus').style.color = 'green';
      }
      else {
        this.error = true;
        document.getElementById('passStatus').innerText = 'Make sure your password match';
        this.errorMessage = "Make sure your password match";
        document.getElementById('passStatus').style.color = 'red';
      }
    }
  }
});

var app2 = new Vue({
  el: '#admin',
  data: {
    manage_user: [],
    manage_clubs: [],
    Password: "",
    password1: "",
    password2: "",
    ShowPassword: false
  },
  methods:
  {
    populate_users: function () {

      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
          app2.manage_user = JSON.parse(this.response);
        }
        else if (this.readyState === 4 && this.status >= 401) {
          alert("Incorrect Credential");
        }
      };
      req.open("GET", "/get-all-users", true);
      req.send();
    },
    remove_user: function (id) {
      var data = {};
      data.id = id;
      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
          location.reload();
        }
      };
      req.open("POST", "/remove-user", true);
      req.setRequestHeader("Content-type", "application/json");
      req.send(JSON.stringify(data));
    },
    remove_club: function (id) {
      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }
      };
      req.open("POST", "/remove-club", true);
      req.setRequestHeader("Content-type", "application/json");
      req.send(JSON.stringify({ id: id }));
    },

    populate_clubs: function () {

      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
          app2.manage_clubs = JSON.parse(this.response);
        }
        else if (this.readyState === 4 && this.status >= 401) {
          alert("Incorrect Credential");
        }
      };
      req.open("GET", "/get-all-clubs", true);
      req.send();
    },
    passwordCheck: function () {
      if (this.password1 === this.password2) {
        this.error = false;
        document.getElementById('passStatus').innerText = 'Password match!';
        document.getElementById('passStatus').style.color = 'green';
      }
      else {
        this.error = true;
        document.getElementById('passStatus').innerText = 'Make sure your password match';
        this.errorMessage = "Make sure your password match";
        document.getElementById('passStatus').style.color = 'red';
      }
    }
  },
  mounted() {
    this.populate_clubs();
    this.populate_users();
  }
});

function ShowPassword() {
  console.log("hello");

  password = document.getElementById("Password");
  if (password.type === "password") {
    password.type = "text";
  }
  else {
    password.type = "password";
  }
}

function RegShowPassword() {
  password = document.getElementById("RPassword");
  if (password.type === "password") {
    password.type = "text";
  }
  else {
    password.type = "password";
  }
}

function RegShowPassword2() {

  password = document.getElementById("ConfirmPassword");
  if (password.type === "password") {
    password.type = "text";
  }
  else {
    password.type = "password";
  }
}

// Get all the buttons with the class "remove_class"
var removeButtons = document.getElementsByClassName("remove");

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

//

// Get the modal
var clubcreate = document.getElementById('makeclub');
window.onclick = function (event) {
  if (event.target == clubcreate) {
    clubcreate.style.display = "none";
  }
}

function createclub() {

  let data = {
    ManagerName: document.getElementById('ManagerN').value,
    Club_name: document.getElementById('clubname').value,
    About_club: document.getElementById('About_club').value,
    category: document.getElementById('category').value
  }
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      window.location.href = "/admin.html";
    }
    else if (req.readyState == 4 && req.status == 400) {
      alert(Failed);
    }
  };
  req.open("POST", "/club");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(data));
}

function addAdmin() {

  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      alert("Admin Created");
      window.location.href = "/admin.html";
    }
    else if (req.readyState == 4 && req.status == 500) {
      alert("User Does Not Exist");
    }
  };
  let data = {
    newAdminEmail: document.getElementById('newadmin').value
  };
  req.open("POST", "/newadmin");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(data));
}

//Login

function login() {

  let user =
  {
    UserEmail: document.getElementById("UserEmail").value,
    Password: document.getElementById("Password").value
  }

  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
      alert("Login sucessful");
      window.location.href = "/main_page.html";
    }
    else if (this.readyState == 4 && this.status >= 401) {
      alert("Incorrect Credential");
    }
  };
  req.open("POST", "/login", true);
  req.setRequestHeader("Content-type", "application/json");
  req.send(JSON.stringify(user));
}

function Google_Login() {

  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert("logged in with google!!")
      window.location.href = "/";
    }
    else if (this.readyState == 4 && this.status >= 401) {
      alert("Incorrect Credential");
    }
  };
  req.open("POST", "/login", true);
  req.setRequestHeader("Content-type", "application/json");
  req.send(JSON.stringify(response));

}

//Register

var LoginBox1 = document.getElementById('app1');

//When the user clicks anywhere outside of the LoginBox1, close it
window.onclick = function (event) {
  if (event.target == LoginBox1) {
    LoginBox1.style.display = "none";
  }
}

function register() {
  //check if passwordCheck is true
  let Password1 = document.getElementById('RPassword').value;
  let Password2 = document.getElementById('ConfirmPassword').value;
  if (this.password1 === this.password2) {
    //if true, then send the data to the server
    console.log("In signup function");
    let data = {
      UserName: document.getElementById('UserName').value,
      UserEmail: document.getElementById('EmailID').value,
      GivenName: document.getElementById('FName').value,
      FamilyName: document.getElementById('LName').value,
      Password: document.getElementById('RPassword').value,
      Password2: document.getElementById('ConfirmPassword').value
    }
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        window.location.href = "/login.html";
      }
      else if (req.readyState == 4 && req.status == 400) {
        alert(Failed);
      }

    };
    req.open("POST", "/register");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
  }
  else {
    alert("Please check the password");
  }
}
