/* Controllers */
/* global app */
/* global angular */
/* global snd */


app.controller('QueueController', function($interval, Timers) {

  var queue = this;

  // Array for Timers //
  queue.timers = [
    {
      text: 'New Timer 1',
      done: false,
      clock: 10,
      timeRemaining: 10,
      continue: true
    }
    ];

  // Array for expired timers //
  queue.archive = [];


  // Method to return total time (in seconds) of timers array //
  // Not sure if this is an ideal way to do this //
  queue.timers.totalTime = function() {
    var sum = 0;
    angular.forEach(queue.timers, function(timer) {
      if (timer.done === false) {
        sum += parseInt(timer.timeRemaining);
      }
    });
    if (isNaN(sum)) {
      sum = 0;
    }
    return sum;
  };


  /////////////////////////////////////
  // Methods for adding/removing etc //
  /////////////////////////////////////

  // Add a New Timer + Timer Model //
  queue.newTimer = function() {
    queue.timers.push({
      text: 'New Timer ' + (queue.timers.length + 1),
      done: false,
      clock: 10,
      timeRemaining: 10,
      continue: true
    });
  };

  queue.removeTimer = function(timer) {
    var i = queue.timers.indexOf(timer);
    if (i > -1) {
      queue.timers.splice(timer, 1);
    }
  }

  queue.resetTimer = function(timer) {
    timer.timeRemaining = timer.clock;
    timer.done = !timer.done;
  }

  queue.removeArchivedTimer = function(timer) {
    var i = queue.archive.indexOf(timer);
    if (i > -1) {
      queue.archive.splice(timer, 1);
    }
  }

  queue.restore = function(timer) {
    queue.timers.push(angular.copy(timer));
    var i = queue.archive.indexOf(timer);
    if (i > -1) {
      queue.archive.splice(i, 1);
    }
  }


  queue.sumTimers = function() {
    var sum = 0;
    angular.forEach(queue.timers, function(timer) {
      if (timer.done === false) {
        sum += parseInt(timer.timeRemaining);
      }
    });
    return sum;
  };

  queue.display = function() {
    var sum = queue.timers.totalTime();
    return queue.toHMS(sum);
  };

  //////////////////////////////////
  // Conversion/Parsing Functions //
  //////////////////////////////////

  queue.parseTimeInput = function(str) {
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


  queue.parseHMS = function(str) {
    // Function to convert HMS time into seconds
    var sum = 0;
    str = String(str); // Convert numbers to strings
    str = str.split(':');
    str[0] = str[0] * 3600;
    str[1] = str[1] * 60;
    str[2] = str[2] * 1;
    return str.reduce(function(a, b) {
      return a + b
    });


  };



  queue.toHMS = function(secs) {
    // Converts seconds into HH:MM:SS format
    // Returns a string

    var h = 0;
    var m = 0;
    var s = 0;

    // Function to pad time with a zero
    function zeroPad(n) {
      n = String(n);
      if (n.length === 1) {
        n = "0" + n;
      }
      return n;
    };

    // Convert the total time into hms format //
    h = Math.floor(secs / 3600);
    secs = secs - (h * 3600);
    m = Math.floor(secs / 60);
    s = secs % 60;

    h = zeroPad(h);
    m = zeroPad(m);
    s = zeroPad(s);

    // Output  hh:mm:ss
    return h + ":" + m + ":" + s;
  };


  queue.index = function(timer, timers) {
    return timers.indexOf(timer);
  }


  //////////////////////////////////
  // Methods to control the timer //
  //////////////////////////////////

  // Maybe there's a more elegant way of doing this?//
  var promise;
  queue.startTimer = function(timer) {
    if (timer) {
      promise =
        $interval(function() {
          queue.countDown(timer, promise);
        }, 1000);
    }
  };

  queue.stopTimer = function(timer) {
    $interval.cancel(promise);
  }
  queue.countDown = function(timer, promise) {
    if (timer.timeRemaining > 1) {
      timer.timeRemaining--;
    }
    else { // Executes when timer is finished
      timer.timeRemaining = 0;
      timer.done = true;
      snd.play();
      queue.archive.push(angular.copy(timer));
      if (timer.continue === true) {
        queue.startTimer(queue.timers[queue.timers.indexOf(timer) + 1]);
      }
      queue.removeTimer(timer); // Removes the timer from the queue
      $interval.cancel(promise); // Cancels the timer


    }
  };

});
