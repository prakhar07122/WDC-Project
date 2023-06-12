function goToSettingPage() {
  // 获取目标页面的URL
  var targetPageUrl = "Your_details.html";

  // 导航到目标页面
  window.location.href = targetPageUrl;
}
function goToAdminPage() {
  // 获取目标页面的URL
  var targetPageUrl = "admin.html";

  // 导航到目标页面
  window.location.href = targetPageUrl;
}

var app = new Vue({
  el: '#main_page',
  data: {
    dta: "",
    username: "",
    Password: "",
    givenName: "",
    designation: "",
    SportClubs: [],
    FacultyClubs: [],
    OtherClubs: [],
    userClubs: [],
    selected: ''
  },
  computed: {
    showCreateButton() {
      return this.designation === 'admin';
    }
  },
  methods: {
    logout: function () {
      fetch('/logout')
        .then(response => response.json())
        .then(data => {
          window.location.href = '/main_page.html';
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    //Faisal did change this userpage.html?clubId to this AdminClubView.html?clubId
    sportClubChange(evnet) {
      window.location.href = '/AdminClubView.html?clubId=' + event.target.value;
    },
    facultyClubChange(evnet) {
      window.location.href = '/AdminClubView.html?clubId=' + event.target.value;
    },
    otherClubChange(evnet) {
      window.location.href = '/AdminClubView.html?clubId=' + event.target.value;
    },

    getUserClubs: function () {

    },
    populate: function () {
      fetch('/mainPage')
        .then(response => response.json())
        .then(data => {
          if (jQuery.isEmptyObject(data)) {
            $('.auth-display-none').removeClass('d-none');
            $('.auth-display').addClass('d-none');
            $('.logout-button').addClass('d-none');
            $('.admin-btn').addClass('d-none');
          } else {
            app.username = data.Username;
            app.designation = data.Designation;
            app.dta = data;

            if (app.designation === 'admin') {
              $('.admin-btn').show();
            } else {
              $('.admin-btn').hide();
            }
            $('.auth-display').removeClass('d-none');
            $('.login-button').addClass('d-none');
            $('.logout-button').removeClass('d-none');
            $('.auth-display-none').addClass('d-none');
            $('.admin-btn').removeClass('d-none');

            this.loadUserClubs();
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });

    },
    loadUserClubs: function () {
      fetch('/get_clubs')
        .then(response => response.json())
        .then(data => {
          this.userClubs = data;

        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    fetchSports: function () {
      fetch('/clubs-by-category?category=Sport')
        .then(response => response.json())
        .then(data => {
          this.SportClubs = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    fetchFaculty: function () {
      fetch('/clubs-by-category?category=Faculty')
        .then(response => response.json())
        .then(data => {
          this.FacultyClubs = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    fetchOther: function () {
      fetch('/clubs-by-category?category=Other')
        .then(response => response.json())
        .then(data => {
          this.OtherClubs = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  },
  mounted() {
    this.populate();
    this.fetchSports();
    this.fetchFaculty();
    this.fetchOther();
  }
});

function load_data(query = '') {
  fetch('/get_data?search_query=' + query + '').then(function (response) {
    return response.json();
  }).then(function (responseData) {
    console.log(responseData);
    var html = '<ul class="list-group">';
    if (responseData.length > 0) {
      for (var count = 0; count < responseData.length; count++) {
        var regular_expression = new RegExp('(' + query + ')', 'gi');

        html += '<a href="/userpage.html?clubId=' + responseData[count].ClubID + '" class="list-group-item list-group-item-action">' + responseData[count].Club_name.
          replace(regular_expression, '<span class="text-primary fw-bold">$1</span>') + '</a>';
      }
    }
    html += '</ul>';

    document.getElementById('search_result').innerHTML = html;

  });

}

var search_element = document.getElementById('autocomplete_search');

search_element.onkeyup = function () {
  var query = search_element.value;

  load_data(query);

}

$(document).ready(function () {

  $('.login-button').click(function () {
    window.location.href = '/login.html';
  });

});
