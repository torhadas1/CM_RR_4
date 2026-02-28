window.onload = function () {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    // If not logged in, redirect to login page
    window.location.href = 'log_in.html';
  }
};
$(document).ready(function () {
  // Check if there is any data in the local storage.
  if (localStorage.getItem('journalData')) {
    const journalData = JSON.parse(localStorage.getItem('journalData'));
    $('#journal_container').html(journalData);
  }
  $(function () {
    $(".draggable").each(function () {
      var elementId = $(this).attr('id');
      if ($('#journal_container').find('#' + elementId).length > 0) {
        $(this).removeClass('draggable').addClass('afterDrag');

      }
    });
  });
});
// Set the date we're counting down to
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

document.getElementById('clearStorage').addEventListener('click', function () {
  // Temporarily store isLoggedIn
  var isLoggedIn = localStorage.getItem('isLoggedIn');

  // Clear all items from local storage
  localStorage.clear();

  // Restore isLoggedIn
  localStorage.setItem('isLoggedIn', isLoggedIn);
  // Refresh the page
  location.reload();
});

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
      let newElem;
      if (ui.draggable.hasClass('draggable')) {
        newElem = $(ui.helper).clone(false);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.removeClass('draggable dragging');
        newElem.addClass('sortable');

        const title = ui.helper.data('title');
        const originalText = newElem.text().trim(); // Get the text content

        // Clear the element and rebuild it correctly
        newElem.empty()
          .append("<div class='title' contenteditable='true'>" + title + "</div>")
          .append("<div class='text-content'>" + originalText + "</div>") // Wrap text
          .append("<button class='remove'>X</button>");

        newElem.appendTo(this);
      }
      // This part handles re-sorting existing items, it's likely fine
      else if (ui.draggable.hasClass('sortable')) {
        newElem = $(ui.draggable);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-sortable-handle').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.appendTo(this);
      }

      // After adding, make sure it's expandable
      if (newElem) {
        setupExpandableItems(newElem);
      }

      // Make the container sortable
      $(this).sortable({ cancel: '.title' });
    }
  }// log the dropped element 
  );

  $(document).on('click', '.remove', function () {
    // Get the ID of the parent div
    var elementId = $(this).parent().parent().attr('id');

    // Change the class of the corresponding element in the main column back to 'draggable'
    $('#' + elementId).removeClass('afterDrag ui-draggable-disabled').addClass('draggable');
    $('#' + elementId).draggable('enable');
    $(this).parent().next('hr').remove();
    $(this).parent().parent().remove();

  });

});

$('#journal_container').sortable({
  cancel: '.title',

});





$(document).on('keydown', function (e) {
  if (e.keyCode === 13) {  // 'Enter' key code
    // prevent calculator btn from being triggered
    // if journal title is focused, do not perform calculation
    if ($('.title:focus').length > 0) {
      // stop the focus
      $('.title:focus').blur();
      return;
    }
  }
});


$("#sort1,#sort2").disableSelection();
//  Complete Investigation function
function showConfirmBox() {
  const journalData = $('#journal_container').html();
  localStorage.setItem('journalData', JSON.stringify(journalData));
  const count_down = $('#count_down').html();
  localStorage.setItem('count_down', count_down);
  document.getElementById("overlay").hidden = false;
}
function closeConfirmBox() {
  document.getElementById("overlay").hidden = true;
}

function isConfirm(answer) {
  if (answer) {
    alert("Answer is yes");
  } else {
    closeConfirmBox;
  }
  closeConfirmBox();
}


// This assumes you have a button with the id "nextPageButton"
$("#nextPageButton").click(function () {
  // This stores the journal contents before going to the next page
  const journalData = $('#journal_container').html();
  localStorage.setItem('journalData', JSON.stringify(journalData));

  // This is where you'd put your code to navigate to the next page
  if (localStorage.getItem('journalData')) {
    const journalData = JSON.parse(localStorage.getItem('journalData'));
    $('#Journal_container').html(journalData);
    $('.sortable').each(function () {
      $(this).sortable({ cancel: '.title' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');
    });
  }

  if (localStorage.getItem('3.Question 3 Maya Forest')) {
    window.location.href = "calculator_question_3.html";
  } if (localStorage.getItem('3.Question 3 Maya Forest')) {
    window.location.href = "calculator_question_2.html";
  } else {
    window.location.href = "calculator_question_1.html";
  }
});

function SaveToLocalStorage() {
  const journalData = $('#journal_container').html();
  localStorage.setItem('journalData', JSON.stringify(journalData));

  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('.report_answer').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('.select_box').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('.checkbox').each(function () {
    const id = $(this).attr('id');
    if ($(this).is(':checkbox')) {
      // If it's a checkbox and it's not checked, we don't save it
      if (!$(this).prop('checked')) {
        return;
      }
    }
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  let calculatorState = localStorage.getItem('calculator_state');

  if (calculatorState === 'review') {
    window.location.href = "calculator_review.html";
  } else if (calculatorState === '4') {
    window.location.href = "calculator_question_4.html";
  } else if (calculatorState === '3') {
    window.location.href = "calculator_question_3.html";
  } else if (calculatorState === '2') {
    window.location.href = "calculator_question_2.html";
  } else {
    window.location.href = "calculator_question_1.html";
    localStorage.setItem('calculator_state', '1');
  }
}
function PressAnalysisButtonToLocalStorage() {
  let calculatorState = localStorage.getItem('calculator_state');
  if (calculatorState === 'review') {
    window.location.href = "calculator_review.html";
  } else if (calculatorState === '4') {
    window.location.href = "calculator_question_4.html";
  } else if (calculatorState === '3') {
    window.location.href = "calculator_question_3.html";
  } else if (calculatorState === '2') {
    window.location.href = "calculator_question_2.html";
  }
  else if (calculatorState === '1') {
    window.location.href = "calculator_question_1.html";
  } else {
  }
}

// --- START: EXPAND/COLLAPSE LOGIC ---

/**
 * Sets up the structure and expand/collapse functionality for items.
 * @param {jQuery} [$items] - Optional. A specific item or items to set up.
 */
function setupExpandableItems($items) {
  const itemsToSetup = $items || $('.right_screen .sortable');

  itemsToSetup.each(function () {
    const $box = $(this);

    // --- 1. Ensure correct HTML structure ---
    // If the title is not in a title-bar, restructure it.
    if ($box.find('.title-bar').length === 0) {
      const $title = $box.find('.title');
      const $removeBtn = $box.find('.remove');
      const $titleBar = $('<div class="title-bar"></div>');
      $titleBar.append($title).append($removeBtn);
      $box.prepend($titleBar);
    }

    // If text is not wrapped in .text-content, wrap it.
    if ($box.find('.text-content').length === 0) {
      const originalText = $box.clone().children('.title-bar, .remove, .expand-arrow').remove().end().text().trim();
      $box.children().not('.title-bar, .remove, .expand-arrow').remove();
      const $textContent = $("<div class='text-content'></div>").text(originalText);
      $box.append($textContent);
    }

    // --- 2. Add expand arrow if needed ---
    const $text = $box.find('.text-content');
    // save the current expand arrow state
    const isExpanded = $box.hasClass('expanded');

    $box.find('.expand-arrow').remove(); // Prevent duplicates

    if ($text.text().trim().length > 21) {
      if (isExpanded) {
        // Add expand arrow only if not already expanded
        const $arrow = $('<button type="button" class="expand-arrow expanded">&#x25BC;</button>');
        $box.append($arrow);
        $arrow.css('display', 'flex'); // Use flex to align icon
      } else {
        const $arrow = $('<button type="button" class="expand-arrow">&#x25BC;</button>');
        $box.append($arrow);
        $arrow.css('display', 'flex'); // Use flex to align icon
      }
    }
  });
}

$(document).ready(function () {
  // --- Event Handlers using Delegation ---
  $('.right_screen').on('click', '.expand-arrow, .text-content', function (e) {
    e.stopPropagation();
    const $box = $(this).closest('.sortable, .draggable');
    if ($box.find('.expand-arrow').length > 0) {
      $box.toggleClass('expanded');
      $box.find('.expand-arrow').toggleClass('expanded');
    }
  });

  // --- Initial Setup ---
  // Run for all items already on the page (e.g., from localStorage)
  setupExpandableItems();

  // IMPORTANT: You must call setupExpandableItems() after you
  // dynamically add a new item to the right screen.
});

// --- END: EXPAND/COLLAPSE LOGIC ---
