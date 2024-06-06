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
  document.getElementById("overlay").hidden = false;
  $('.input_answer').each(function () {
    const id = $(this).attr('id');
    const value = $(this).val();
    localStorage.setItem(id, value);
  });
  const selectedRadio = $('input[type=radio][name=case_3_radio]:checked');
  const id = selectedRadio.attr('id');
  const value = selectedRadio.val();
  localStorage.setItem(id, value);

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
      performCalculation("=");
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
        let formattedResult = parseFloat(result.toFixed(5)).toString();
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
    accept: ".draggable, .sortable",
    drop: function (event, ui) {
      let totalValue = ui.helper.text();
      let dataTitle = ui.helper.attr('data-title');
      let otherTitle = ui.helper.attr('title');
      // get the value by replacing the data-title from totalValue
      let value = totalValue.replace(dataTitle, '').replace('X', '').replace(/[^0-9.%-]/g, '').trim();
      // Check if value contains %
      if (value.includes("%")) {
        // Replace % with an empty string, convert to number and divide by 100
        value = Number(value.replace("%", "")) / 100;
      }
      $(this).val(value);
    }
  });
})
$(function () {
  // Make the calculator's input field droppable
  $("#inputField").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      let totalValue = ui.helper.text();
      let dataTitle = ui.helper.attr('data-title');
      let otherTitle = ui.helper.attr('title');
      // get the value by replacing the data-title from totalValue
      let value = totalValue.replace(dataTitle, '').replace('X', '').replace(/[^0-9.%-]/g, '').trim();

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
        if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '(' || lastChar === ')' || lastChar === '/') {
          $(this).val($(this).val() + value);
        } else {
          $(this).val(value);
        }
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
