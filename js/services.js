/* Services and Factories */
/* global app */

app.service('Timers', function() {

  this.parseInput = function(str) {
    // Accepts a string and parses it into seconds
    // Can accept either hh:mm:ss format or seconds
    // Returns 0 if invalid

    // Test for Bad Input //
    var maxSeconds = (99 * 60 * 60) + (59 * 60) + 59;
    var formatTest = /^((\d{1,}[:]\d{1,}[:]\d{1,})|(\d{1,}[:]\d{1,})|(\d{1,}))$/;


    if (formatTest.test(str)) {
      str = str.split(":"); // Split into array
      str = str.reverse(); // Reverse it for math to work

      for (var i = 0; i < str.length; i++) {
        str[i] = parseInt(str[i]) * Math.pow(60, i);
      }
      str = str.reduce(function(a, b) {
        return a + b
      });
      
      if (parseInt(str) <= maxSeconds) {
      return parseInt(str);
      }
      else {
        return maxSeconds;
      }
    }


      else {
        return 0; // Return 0 if format is invalid
      }
    };
});
