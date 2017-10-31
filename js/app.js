/* global angular */
/* global $ */

// Main App //
var app = angular.module('timerApp', []);



// jQuery UI Stuff //
  $("#sortable").sortable();
  $("#sortable").disableSelection();
  $("#sortable").sortable({
    stop: function(event, ui) {
      
    }
  });
  
  
// Other Stuff //

var snd = new Audio("sound/bell.wav"); // buffers automatically when created