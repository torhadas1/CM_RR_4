
$(document).ready(function () {
  var countDownDate;

  if (localStorage.getItem('countDownDate')) {
    countDownDate = localStorage.getItem('countDownDate');
  } else {
    countDownDate = new Date().getTime() + 35 * 60 * 1000;
  }


  // Update the count down every 1 second
  var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Pad the minutes and seconds with leading zeros if they are less than 10.
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    // Display the result in the element with id="count_down"
    document.getElementById("count_down").innerHTML = minutes + ":" + seconds;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("count_down").innerHTML = "Time's Up";
      // Create a pop-up dialog
      // alert("Time is over!");

      // If the user clicks "OK" (Restart), clear local storage
      // localStorage.clear();

      // Here you might also want to reset any state in your app that depends on local storage
      // localStorage.setItem('isLoggedIn', 'true');
      // countDownDate = new Date().getTime() + 35 * 60 * 1000;
      // window.location.href = "index.html";
      // And you could potentially restart the countdown or redirect the user
      // Reload the page
    } else {
      // Store countdown date to localStorage
      localStorage.setItem('countDownDate', countDownDate);
    }
  }, 1000);
})

// end analysis btn
function showConfirmBox() {
  // const journalData = $('#case_two').html();
  // localStorage.setItem('8.Case 2', JSON.stringify(journalData));

  $('.sortable').each(function () {
    const id = $(this).data('title');
    const value = $(this).text().replace(id, '').replace('X', '');
    localStorage.setItem('Case 3 ' + id, value);
  });
  document.getElementById("overlay").hidden = false;
  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('input[type=checkbox][name=case_3_radio]:checked').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  
}
function closeConfirmBox() {
  document.getElementById("overlay").hidden = true;
}

function isConfirm(answer) {
  if (answer) {
    alert("Answer is yes");
  } else {
    closeConfirmBox();
  }
}
$(function () {
  // Make elements with class 'draggable' draggable
  $(".draggable").draggable({
    cancel: ".title",
    helper: function () {
      return $(this).clone().css("z-index", 10).appendTo('body');
    },
    revert: function (valid) {
      if (!valid) {
        $(this).removeClass('afterDrag').addClass('draggable ui-draggable ui-draggable-handle');
        $(this).draggable('enable');

        return true;
      }
    },
    start: function (event, ui) {
      $(ui.helper).addClass('dragging');
      $(this).addClass('afterDrag').removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging');
      $(this).draggable('disable');

    },
    stop:
      function (event, ui) {
        $(ui.helper).removeClass('dragging');
      },
  })


  // Make the 'Journal_container' a droppable for the draggable
  $(".right_screen").droppable({
    accept: ".draggable",
    tolerance: "pointer",
    drop: function (event, ui) {
      if (ui.draggable.hasClass('draggable')) {

        var newElem = $(ui.helper).clone(false);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.removeClass('draggable');
        newElem.removeClass('dragging');
        var title = ui.helper.data('title');
        newElem.addClass('sortable')
        // Add a title to the new element
        newElem.prepend("<div class='title' contenteditable='true'>" + title + "</div>");
        // Add a horizontal line after the new element
        newElem.append("<button class='remove'>X</button>");
        newElem.appendTo(this);
        // $("<hr>").appendTo(this);
        $(this).sortable({ cancel: '.title' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');
      }
      else if (ui.draggable.hasClass('sortable')) {
        var newElem = $(ui.draggable);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-sortable-handle').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.next('hr').remove();
        newElem.removeClass('dragging');

        // newElem.appendTo(this);
        newElem.appendTo(this);
      }
      // Make the 'right_screen' container sortable
    }
    // Make the 'right_screen' container sortable
  }// log the dropped element 
  );

  $(document).on('click', '.remove', function () {
    var elementId = $(this).parent().attr('id');

    // Change the class of the corresponding element in the main column back to 'draggable'
    $('#' + elementId).removeClass('afterDrag ui-draggable-disabled').addClass('draggable');
    $('#' + elementId).draggable('enable');
    $(this).parent().remove();
    $(this).remove();
  });




  $(".sortable").sortable({})
});
