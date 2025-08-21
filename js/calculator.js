window.onload = function () {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    // If not logged in, redirect to login page
    window.location.href = 'log_in.html';
  }
};

$(document).ready(function () {
  // Check if there is any data in the local storage.
  var journal = document.getElementById("Journal_container")



  if (journal) {
    if (localStorage.getItem('journalData')) {
      const journalData = JSON.parse(localStorage.getItem('journalData'));
      $('#Journal_container').html(journalData);
      $('.sortable').each(function (event, ui) {
        var newElem = $(ui.helper).clone(false);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.removeClass('draggable');
        newElem.removeClass('dragging');
        newElem.addClass('sortable')
        // Add a title to the new element
        newElem.appendTo(this);
        // $("<hr>").appendTo(this);
        $(this).sortable({ cancel: '.title-bar' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');
        $(this).sortable({ cancel: '.title-bar .title' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');

        $(this).sortable({ cancel: '.text-content' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');

      });
      // Disable draggable and sortable in journal
      $('#Journal_container .draggable').draggable('disable');
      $('#Journal_container .sortable').sortable('disable');

    }
  }

  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    if (localStorage.getItem(id)) {
      const value = localStorage.getItem(id);
      $(this).val(value);
    }
  });
  $('.report_answer').each(function () {
    const id = $(this).attr('id');
    if (localStorage.getItem(id)) {
      const value = localStorage.getItem(id);
      $(this).val(value);
    }
  })
  $('.select_box').each(function () {
    const id = $(this).attr('id');
    if (localStorage.getItem(id)) {
      const value = localStorage.getItem(id);
      $(this).val(value);
    }
  })
  if (localStorage.getItem('5.graph_type')) {
    const value = localStorage.getItem('5.graph_type');
    $('input[name="page"][value="' + value + '"]').prop('checked', true);
  }

  $(function () {
    $(".input_answer, .report_answer").droppable({
      accept: ".draggable, .sortable, .history-result, #result",
      drop: function (event, ui) {
        let totalValue = ui.helper.text();
        let dataTitle = ui.helper.attr('data-title');
        let otherTitle = ui.helper.attr('title');
        let value = ui.helper.find('.text-content').text();
        if (ui.helper.hasClass('history-result')) {
          //check that the dropped element is not from the right screen
          if (!ui.helper.closest('.right_screen').length) {
            value = ui.helper.text(); // For history results, use the text directly
          }
        }
        // check if value id is result
        if (ui.helper.attr('id') === "result") {
          value = ui.helper.text();
        }

        if (value.includes("%")) {
          // Replace % with an empty string, convert to number and divide by 100
          value = Number(value.replace("%", "")) / 100;
        }

        if (isNaN(value)) {
          value = ''; // Default to 0 if not a number
        }
        $(this).val(value);
      }
    });
  })

  $(function () {
    // Make the calculator's input field droppable
    $("#inputField").droppable({
      accept: ".draggable, .sortable, .history-result", // Add history-result
      drop: function (event, ui) {
        let totalValue = ui.helper.text();
        let dataTitle = ui.helper.attr('data-title');
        let otherTitle = ui.helper.attr('title');
        let value;
        value = ui.helper.find('.text-content').text(); // For other elements, find text-content

        if (ui.helper.hasClass('history-result')) {
          //check that the dropped element is not from the right screen
          if (!ui.helper.closest('.right_screen').length) {
            value = ui.helper.text(); // For history results, use the text directly
          }
        }
        // check if value id is result
        if (ui.helper.attr('id') === "result") {
          value = $("#result").text();
        }

        if (value === "AC") {
          $(this).val('');
        } else if (value === "C") {
          $(this).val($(this).val().slice(0, -1));
        } else if (value === "=") {
          try {
            const expression = $(this).val();
            const result = eval(expression);
            if (isNaN(result)) {
              alert('Invalid Expression');
            } else {
              $(this).val(result);
              $('#result').text(result);
            }
          } catch (error) {
            alert('Invalid Expression');
          }
        } else {
          // Check if value contains %
          if (value.includes("%")) {
            // Replace % with an empty string, convert to number and divide by 100
            value = Number(value.replace("%", "")) / 100;
          }
          const lastChar = $(this).val().slice(-1);

          // If the last character is a math sign, append the value instead of replacing
          if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === ')' || lastChar === '(' || lastChar === '/') {
            if (isNaN(value)) {
              value = ''; // Default to 0 if not a number
            }
            $(this).val($(this).val() + value);
          } else {
            if (isNaN(value)) {
              value = ''; // Default to 0 if not a number
            }
            $(this).val(value);
          }

        
      }
    }
    });
});



$(function () {
  // Make elements with class 'draggable' draggable
  $(".draggable").draggable({
    cancel: '.title-bar',
    helper: function () {
      return $(this).clone().css("z-index", 1100).appendTo('body');
    },
    revert: 'invalid',
    start: function (event, ui) {
      $(ui.helper).addClass('dragging');
      $(ui.draggable).addClass('dragging');
    }
  });

  // $(".sortable").sortable({})

  // Make the 'Journal_container' a droppable for the draggable
  $(".right_screen").droppable({
    accept: ".draggable, .sortable",
    tolerance: "pointer",
    drop: function (event, ui) {
      let newElem;

      if (ui.draggable.hasClass('draggable')) {
        newElem = $(ui.helper).clone(false);
        newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
        newElem.removeClass('draggable');
        newElem.removeClass('dragging');
        newElem.removeClass('history-result')
        newElem.addClass('sortable')

        const originalText = newElem.text().trim(); // Get the text content

        // Add a title to the new element
        newElem.prepend("<div class='title' id='' contenteditable='true'>Calculator result</div>");
        // Add a horizontal line after the new element
        // Clear the element and rebuild it correctly
        newElem.empty()
          .append("<div class='title' contenteditable='true'> Calculator result </div>")
          .append("<div class='text-content'>" + originalText + "</div>") // Wrap text
          .append("<button class='remove'>X</button>");

        newElem.appendTo(this);
        // $("<hr>").appendTo(this);
        $(this).sortable({ cancel: '.title-bar' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');

      }
      else if (ui.draggable.hasClass('sortable')) {
        newElem = $(ui.draggable);
        newElem.removeClass('ui-sortable ui-draggable ui-draggable-handle ui-sortable-handle').css({ 'position': 'relative', 'left': '', 'top': '' });
        // newElem.appendTo(this);
        newElem.addClass('sortable')
        newElem.removeClass('draggable');
        newElem.removeClass('dragging');
        newElem.appendTo(this);
        $(this).sortable();

      }
      // if the dropped element as result as an id reset the element id
      else if (ui.helper.attr('id') === "result") {
        newElem = $(ui.helper).clone(false);
        newElem.attr('id', ''); // Reset the ID

        newElem.appendTo(this);
      }
      if (newElem) {
        setupExpandableItems(newElem);
      }
      // Make the 'right_screen' container sortable
    }
    // Make the 'right_screen' container sortable
  }// log the dropped element 
  );

  $(document).on('click', '.remove', function () {
    $(this).parent().next('hr').remove();
    $(this).closest('div').remove();
  });


});

if (localStorage.getItem('calculator_tutorial_shown')) {
  $('#Journal_container').sortable({
    cancel: '.title-bar',
    helper: 'clone',
    start: function (event, ui) {
      ui.helper.find('.title-bar').hide();
      ui.helper.css('width', 'fit-content');
      ui.helper.css('height', 'fit-content');

    },
    stop: function (event, ui) {
      ui.item.find('.title-bar').show();
    }
  });
}



$(document).ready(function () {
  $('.calculator-btn').click(function () {
    const value = $(this).data('value');
    performCalculation(value);
  });

  $(document).on('keydown', function (e) {
    if (e.keyCode === 13) {  // 'Enter' key code
      // prevent calculator btn from being triggered
      $('.calculator-btn').prop('disabled', true);
      // if journal title is focused, do not perform calculation
      if ($('.title:focus').length > 0) {
        // stop the focus
        $('.title:focus').blur();
        return;
      }
      performCalculation("=");
      $('.calculator-btn').prop('disabled', false);
    }
  });



  $(document).on('click', '.remove', function () {
    $(this).parent().next('hr').remove();
    $(this).closest('div').remove();
  });
})

function performCalculation(value) {
  if (value === "AC") { // Clear the input field when 'AC' is clicked
    $('#inputField').val('');
    // Also clear the history display and its storage
    // $('#historyDisplay').empty();
    // localStorage.removeItem('calculatorHistory');
  } else if (value === "C") { // Remove the last character when 'C' is clicked
    $('#inputField').val($('#inputField').val().slice(0, -1));
  } else if (value === "=") { // Evaluate the expression when '=' is clicked
    try {
      const expression = $('#inputField').val();
      const result = eval(expression);
      if (isNaN(result)) {
        alert('Invalid Expression');
      } else {
        // format result
        let formattedResult = parseFloat(result.toFixed(2)).toString();
        if (formattedResult.indexOf('.') !== -1) {
          while (formattedResult[formattedResult.length - 1] === '0') {
            formattedResult = formattedResult.slice(0, -1);
          }
          if (formattedResult[formattedResult.length - 1] === '.') {
            formattedResult = formattedResult.slice(0, -1);
          }
        }
        $('#inputField').val(formattedResult);
        $('#result').text(formattedResult);

        // --- Add to History ---
        const historyText = expression + ' = ' + formattedResult;
        const $historyItem = $('<div class="history-item"></div>');
        const $expressionSpan = $('<span class="history-expression"></span>').text(expression + ' = ');
        const $resultSpan = $('<div class="history-result draggable"></div>')
          .text(formattedResult)
          .attr('data-title', historyText); // Keep full context in data-title

        // Make ONLY the result part draggable
        $resultSpan.draggable({
          helper: 'clone',
          revert: 'invalid',
          appendTo: 'body',
          zIndex: 1100
        });

        // Append the non-draggable expression and the draggable result
        $historyItem.append($expressionSpan).append($resultSpan);
        $('#historyDisplay').prepend($historyItem);

        // Save history to localStorage
        localStorage.setItem('calculatorHistory', $('#historyDisplay').html());
        // --- End of Add to History ---
      }
    } catch (error) {
      alert('Invalid Expression');
    }
  } else {
    $('#inputField').val($('#inputField').val() + value);
  }
}
$(document).on('click', '.remove', function () {
  $(this).parent().next('hr').remove();
  $(this).closest('div').remove();
});
})


function showConfirmBox() {
  const journalData = $('#Journal_container').html();
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


  document.getElementById("overlay").hidden = false;

}
function SaveToLocalStorage() {
  // Remove this line: saveAnswersToJournal();

  // Only save the existing journal data (don't add new answers)
  const journalData = $('#Journal_container').html();
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
}
document.getElementById('clearStorage').addEventListener('click', function () {
  // Temporarily store isLoggedIn
  var isLoggedIn = localStorage.getItem('isLoggedIn');

  // Clear all items from local storage
  localStorage.clear();

  // Restore isLoggedIn
  localStorage.setItem('isLoggedIn', isLoggedIn);
  // Refresh the page
  window.location.href = "index.html";
});


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

/**
 * Saves input answers to the research journal as draggable elements
 * This function is called when moving to the next question
 */
function saveAnswersToJournal() {
  // Find all input elements with class 'input_answer'
  $('.input_answer').each(function () {
    const $input = $(this);
    const value = $input.val().trim();
    const title = $input.attr('title') || $input.attr('name') || 'Answer'; // Get title from title attribute, name, or default

    // Only add to journal if the input has a value
    if (value && value !== '') {
      // Create the new draggable element with the correct structure
      const $newElement = $('<div class="sortable"></div>');

      // Add title bar with title and remove button
      const $titleBar = $('<div class="title-bar"></div>');
      const $titleDiv = $('<div class="title" contenteditable="true"></div>').text(title);
      const $removeBtn = $('<button class="remove">X</button>');
      $titleBar.append($titleDiv).append($removeBtn);
      $newElement.append($titleBar);

      // Add text content
      const $textContent = $('<div class="text-content"></div>').text(value);
      $newElement.append($textContent);

      // Add to the top of the journal container after the first element
      $('#Journal_container').children().first().after($newElement);

      // Set up expand/collapse functionality for this new element
      setupExpandableItems($newElement);
    }
  });

  // Save the updated journal to localStorage
  const journalData = $('#Journal_container').html();
  localStorage.setItem('journalData', JSON.stringify(journalData));
}

/**
 * Function called specifically when moving to the next question
 * This saves answers to journal AND to localStorage
 */
function moveToNextQuestion() {
  // Save answers to journal (only when moving forward)
  saveAnswersToJournal();

  // Also save to regular localStorage
  SaveToLocalStorage();

  // // Set the calculator state and navigate
  // localStorage.setItem('calculator_state','2');
  // location.href='calculator_question_2.html';
}

// Tutorial functionality
let timerInterval;
let isPaused = false;
let countDownDate;
let pausedTimeRemaining = 0;

$(document).ready(function () {
  // Initialize timer and tutorial
  initializeTimerAndTutorial();

  // Add event listener for tutorial continue button
  $('#continueButton, #tutorialContinueBtn, .tutorial-continue-btn').on('click', function () {
    closeTutorial();
  });
});

function initializeTimerAndTutorial() {
  if (!localStorage.getItem('calculator_tutorial_shown')) {
    showTutorial();
  } else {
    startTimer();
  }
}

function startTimer() {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Set the date we're counting down to
  if (localStorage.getItem('countDownDate')) {
    countDownDate = parseInt(localStorage.getItem('countDownDate'));
  } else {
    countDownDate = new Date().getTime() + 35 * 60 * 1000;
  }

  // Update the count down every 1 second
  timerInterval = setInterval(function () {
    if (isPaused) return; // Skip if paused

    var now = new Date().getTime();
    var distance = countDownDate - now;

    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    if (document.getElementById("count_down")) {
      document.getElementById("count_down").innerHTML = minutes + ":" + seconds;
    }

    if (distance < 0) {
      clearInterval(timerInterval);
      if (document.getElementById("count_down")) {
        document.getElementById("count_down").innerHTML = "Time's Up";
      }
    } else {
      localStorage.setItem('countDownDate', countDownDate);
    }
  }, 1000);
}

function showTutorial() {
  // Show tutorial popup
  const tutorialPopup = document.getElementById('tutorialPopup');
  if (tutorialPopup) {
    tutorialPopup.style.display = 'block';
  }

  // Actually pause the timer
  isPaused = true;

  // Calculate and store remaining time from the EXISTING timer
  if (countDownDate) {
    var now = new Date().getTime();
    pausedTimeRemaining = countDownDate - now;
  } else if (localStorage.getItem('countDownDate')) {
    // Use the existing timer from localStorage (from previous page)
    countDownDate = parseInt(localStorage.getItem('countDownDate'));
    var now = new Date().getTime();
    pausedTimeRemaining = countDownDate - now;
  } else {
    // Only if no timer exists at all, start a new 35-minute timer
    pausedTimeRemaining = 35 * 60 * 1000;
  }

  // Show "Paused"
  if (document.getElementById("count_down")) {
    document.getElementById("count_down").innerHTML = "Paused";
  }

  // Disable calculator buttons and input
  $('.calculator-btn').prop('disabled', true);
  $('#inputField').prop('disabled', true);
  $('.end_btn').prop('disabled', true);

  // Disable result interactions - COMPREHENSIVE APPROACH
  $('#result').removeClass('draggable'); // Remove draggable class
  if ($('#result').hasClass('ui-draggable')) {
    $('#result').draggable('disable'); // Disable if already initialized
  }
  $('#result').attr('draggable', 'false'); // Disable HTML5 draggable
  // $('#result').css('cursor', 'default'); // Change cursor

  // disable menu options
  $('.menu').css('pointer-events', 'none');
  // Disable journal interactions
  $('#Journal_container .draggable').draggable('disable');
  $('#Journal_container .sortable').sortable('disable');

  $('#Journal_container [contenteditable="true"]').attr('contenteditable', 'false').addClass('tutorial-disabled');
}

function closeTutorial() {
  // Hide tutorial popup
  const tutorialPopup = document.getElementById('tutorialPopup');
  if (tutorialPopup) {
    tutorialPopup.style.display = 'none';
  }

  // Resume timer with the remaining time (preserve the original timer)
  isPaused = false;

  // Set countdown date to resume from where it was paused
  countDownDate = new Date().getTime() + pausedTimeRemaining;
  localStorage.setItem('countDownDate', countDownDate);

  // Enable calculator buttons and input
  $('.calculator-btn').prop('disabled', false);
  $('#inputField').prop('disabled', false);
  $('.end_btn').prop('disabled', false);
  $('.menu').css('pointer-events', 'auto');

  // Re-enable calculator results interactions - COMPREHENSIVE APPROACH
  $('#result').addClass('draggable'); // Add draggable class back
  $('#result').prop('disabled', false);
  $('#result').attr('draggable', 'true'); // Keep HTML5 draggable enabled



  // Initialize/re-enable jQuery UI draggable
  if ($('#result').hasClass('ui-draggable')) {
    $('#result').draggable('enable');
  } else {
    $('#result').draggable({
      helper: 'clone',
      revert: 'invalid',
      appendTo: 'body',
      zIndex: 1100
    });
  }
  $(".draggable").draggable({
    cancel: '.title-bar',
    helper: function () {
      return $(this).clone().css("z-index", 1100).appendTo('body');
    },
    revert: 'invalid',
    start: function (event, ui) {
      $(ui.helper).addClass('dragging');
      $(ui.draggable).addClass('dragging');
    }
  });

  // Re-enable journal interactions
  $('#Journal_container .tutorial-disabled').attr('contenteditable', 'true').removeClass('tutorial-disabled');
  $('#Journal_container').sortable({
    cancel: '.title-bar',
    helper: 'clone',
    start: function (event, ui) {
      ui.helper.find('.title-bar').hide();
      ui.helper.css('width', 'fit-content');
      ui.helper.css('height', 'fit-content');
    },
    stop: function (event, ui) {
      ui.item.find('.title-bar').show();
    }
  });

  // Enable expand/collapse functionality
  $('.right_screen').on('click', '.expand-arrow, .text-content', function (e) {
    e.stopPropagation();
    const $box = $(this).closest('.sortable, .draggable');
    if ($box.find('.expand-arrow').length > 0) {
      $box.toggleClass('expanded');
      $box.find('.expand-arrow').toggleClass('expanded');
    }
  });

  // Mark tutorial as shown and start timer
  localStorage.setItem('calculator_tutorial_shown', 'true');
  startTimer();
}
/**
 * Sets up the structure and expand/collapse functionality for items.
 * @param {jQuery} [$items] - Optional. A specific item or items to set up.
 */
function setupExpandableItems($items) {
  const itemsToSetup = $items || $('.right_screen .sortable');

  itemsToSetup.each(function () {
    const $box = $(this);
    // remove the id from element if it is result
    if ($box.attr('id') === "result") {
      $box.removeAttr('id');
    }
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

    if ($text.text().trim().length > 25) {
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
  // only if tutorial pop up is closed


  // --- Initial Setup ---
  // Run for all items already on the page (e.g., from localStorage)
  setupExpandableItems();
  if (localStorage.getItem('calculator_tutorial_shown')) {
    $('.right_screen').on('click', '.expand-arrow, .text-content', function (e) {
      e.stopPropagation();
      const $box = $(this).closest('.sortable, .draggable');
      if ($box.find('.expand-arrow').length > 0) {
        $box.toggleClass('expanded');
        $box.find('.expand-arrow').toggleClass('expanded');
      }
    });
  }
})
$(document).ready(function () {
  // ... existing ready function code ...

  // --- Load Calculator History ---
  const savedHistory = localStorage.getItem('calculatorHistory');
  if (savedHistory) {
    $('#historyDisplay').html(savedHistory);

    // Make ONLY the loaded result spans draggable
    $('#historyDisplay .history-result').each(function () {
      $(this).draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: 'body',
        zIndex: 1100
      });
    });
  }
});
$(document).ready(function () {
  if (document.getElementById('continueButtonGraph')) {
    document.getElementById('continueButtonGraph').addEventListener('click', function () {
      var radios = document.getElementsByName('page');
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          localStorage.setItem('5. graph_type', radios[i].id)
          window.location.href = radios[i].value;
          break;
        }
      }
    });
  }
})

$(function () {
  // Use event delegation for droppable - this will work for dynamically created elements too
  $(document).on('mouseenter', '.history-result:not(.ui-droppable-processed)', function () {
    $(this).addClass('ui-droppable-processed').droppable({
      accept: "*", // Accept itself for dropping
      tolerance: "pointer"
    });
  });

  $(".input_answer, .report_answer").droppable({
    accept: ".draggable, .sortable, .history-result", // Add history-result to accepted types
    drop: function (event, ui) {
      let totalValue = ui.helper.text();
      let dataTitle = ui.helper.attr('data-title');
      let otherTitle = ui.helper.attr('title');
      let value;

      // Handle different types of draggable elements
      if (ui.helper.hasClass('history-result')) {
        value = ui.helper; // For history results, use the text directly
      }
      else if (ui.helper.attr('id') === "result") {
        value = ui.helper; // For result, use the text directly
      }
      else {
        value = ui.helper.find('.text-content').text(); // For other elements, find text-content
      }

      if (value.includes("%")) {
        // Replace % with an empty string, convert to number and divide by 100
        value = Number(value.replace("%", "")) / 100;
      }
      // make sure the value is a number
      if (isNaN(value)) {
        value = ''; // Default to 0 if not a number
      }
      $(this).val(value);
    }
  });
})

// when editing a journal title, disable the calculator buttons
$('#Journal_container').on('focus', '.title', function () {
  $('.calculator-btn').prop('disabled', true);
});

$('#Journal_container').on('blur', '.title', function () {
  $('.calculator-btn').prop('disabled', false);
});


$(document).ready(function () {
  // Initialize result draggable ONLY if tutorial is not shown
  if (localStorage.getItem('calculator_tutorial_shown')) {
    $('#result').draggable({
      helper: 'clone',
      revert: 'invalid',
      appendTo: 'body',
      zIndex: 1100
    });
  }
});


