$(document).ready(function () {
  // Check if there is any data in the local storage.
  var journal = document.getElementById("Journal_container")
  if (journal) {
    if (localStorage.getItem('journalData')) {
      const journalData = JSON.parse(localStorage.getItem('journalData'));
      $('#Journal_container').html(journalData);
    }
  }

  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    if (localStorage.getItem(id)) {
      const value = localStorage.getItem(id);
      $(this).val(value);
    }
  });



})

// end analysis btn
function showConfirmBox() {
  document.getElementById("overlay").hidden = false;
  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('.select_box').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  $('input[type=radio]:checked').each(function () {
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

$(document).ready(function () {
  $('.calculator-btn').click(function () {
    const value = $(this).data('value');
    performCalculation(value);
  });

  $(document).on('keydown', function (e) {
    if (e.keyCode === 13) {  // 'Enter' key code
      // prevent calculator btn from being triggered
      $('.calculator-btn').prop('disabled', true);

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
        const $resultSpan = $('<span class="history-result draggable"></span>')
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



$(function () {
  $(".input_answer, .report_answer").droppable({
    accept: ".draggable, .sortable, .history-result", // Add history-result
    drop: function (event, ui) {
      let value;
      
      if (ui.helper.hasClass('history-result')) {
        value = ui.helper.text(); // For history results, use text directly
      } else {
        let totalValue = ui.helper.text();
        let dataTitle = ui.helper.attr('data-title');
        value = totalValue.replace(dataTitle, '').replace('X', '').replace(/[^0-9.]/g, '').trim();
      }
      
      $(this).val(value);
    }
  });
})

$(function () {
  $("#inputField").droppable({
    accept: ".draggable, .history-result", // Add history-result
    drop: function (event, ui) {
      let value;
      
      if (ui.helper.hasClass('history-result')) {
        value = ui.helper.text(); // For history results, use text directly
      } else {
        let totalValue = ui.helper.text();
        let dataTitle = ui.helper.attr('data-title');
        value = totalValue.replace(dataTitle, '').replace('X', '').replace(/[^0-9.%]/g, '').trim();
      }

      // ... rest of your existing calculator input logic ...
      if (value.includes("%")) {
        value = Number(value.replace("%", "")) / 100;
      }
      const lastChar = $(this).val().slice(-1);
      if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '(' || lastChar === ')' || lastChar === '/') {
        $(this).val($(this).val() + value);
      } else {
        $(this).val(value);
      }
    }
  });
});


$(function () {
  // Make elements with class 'draggable' draggable
  $(".draggable").draggable({
    cursorAt: { left: 5 },
    helper: function () {
      return $(this).clone().css("z-index", 1100).appendTo('body');
    },
    revert: 'invalid',

  });
})

let timerInterval;
let isPaused = false;
let countDownDate;
let pausedTimeRemaining = 0;

$(document).ready(function () {
  // Initialize timer and tutorial
  initializeTimerAndTutorial();
  
  // Add event listener for tutorial continue button
  $('#tutorialContinueBtn').on('click', function() {
    closeTutorial();
  });
});

function initializeTimerAndTutorial() {
  if (!localStorage.getItem('case1_tutorial_shown')) {
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

  // Disable interactions during tutorial
  $('.calculator-btn').prop('disabled', true);
  $('#inputField').prop('disabled', true);
  $('.input_answer').prop('disabled', true);
  $('.draggable').draggable('disable');
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

  // Enable interactions
  $('.calculator-btn').prop('disabled', false);
  $('#inputField').prop('disabled', false);
  $('.input_answer').prop('disabled', false);
  $('.draggable').draggable('enable');
  
  // Mark tutorial as shown and start timer
  localStorage.setItem('case1_tutorial_shown', 'true');
  startTimer();
}

// --- Load Calculator History ---
// const savedHistory = localStorage.getItem('calculatorHistory');
// if (savedHistory) {
//   $('#historyDisplay').html(savedHistory);
//   // Re-initialize draggable functionality for loaded history items
//   $('#historyDisplay .history-result').draggable({
//     helper: 'clone',
//     revert: 'invalid',
//     appendTo: 'body',
//     zIndex: 1100
//   });
// }
// --- End of Load History ---
