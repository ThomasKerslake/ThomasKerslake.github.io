var feed = new Instafeed({ // Creating an instafeed
  get: 'user',
  userId: '7097454956', // My instagram user ID
  accessToken: '7097454956.1677ed0.3e8d014c38b047a996dd1c298258e46b', // My instagram access token
  resolution: 'standard_resolution', // Setting the resolution for the instagram images to be 612x612
  // Using 'template' to set up how I want the instagram images to be displayed on my page
  template: '<div class="col-sm-4"><a href="{{link}}"><img src={{image}}></a><hr><p class="likes"><i class="fab fa-instagram"></i><i class="fa fa-heart"></i>{{likes}}</div>'
});

feed.run(); // Running the instafeed to collect the images and display them on my site


// On loading the page start function 'clock' with an interval of 1000ms
window.onload = setInterval(clock,1000);

function clock(){
  var i = new Date(); // Todays date

  	  var date = i.getDate(); // Gets todays date

  	  var month = i.getMonth(); // Gets current month (value)
  	  var monthArray = ["Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"]; // Array to hold all the different months
  	  month = monthArray[month]; // value of 'month' used within the Array to get current month

  	  var year = i.getFullYear(); // Gets current year

  	  var day = i.getDay(); // Gets current day (value)
  	  var dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  	  day = dayArray[day]; // value of 'day' used within the Array to get current day

  	  var hour =i.getHours(); // Gets current hour (digital)
      var min = i.getMinutes(); // Gets current minute
  	  var sec = i.getSeconds(); // Gets current second

  	  document.getElementById("myDate").innerHTML=day +" "+ date +" "+ month +" "+ year +" | "; // Assigns the collective values to an ID to be used within HTML/CSS
  	  document.getElementById("myClock").innerHTML=hour +":"+ min +":"+ sec; // Assigns the collective values to an ID to be used within HTML/CSS

}

$(document).ready(function(){
  $("a").on('click', function(event) {// Adds a smooth scroll affect to 'a' tags (links)
    if (this.hash !== "") {// Sets this.hash to have a value equal to nothing
      event.preventDefault()// Stops the default behavior or links
      var hash = this.hash;// Creates a variable called hash to store this.hash
      $('html, body').animate({ // 'animate' sets up the smooth scroll
        scrollTop: $(hash).offset().top
      }, 600, function(){ // '600' is the number of ms it will take to move to the hash
        window.location.hash = hash; // Adds a '#' to your URL at the end of the animation
      });
    } // End of the if statement
  });
});
