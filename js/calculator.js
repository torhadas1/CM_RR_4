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
        $(this).sortable({ cancel: '.title' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');
      });


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

  $(function () {
    $(".input_answer, .report_answer").droppable({
      accept: ".draggable, .sortable",
      drop: function (event, ui) {
        let totalValue = ui.helper.text();
        dataValue = ui.helper.attr('data-value');
        let dataTitle = ui.helper.attr('data-title');
        let otherTitle = ui.helper.attr('title');
        // get the value by replacing the data-title from totalValue
        let value = dataValue.replace(/[^0-9.%-]/g, '').trim();
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
      accept: ".draggable, .sortable",
      drop: function (event, ui) {
        let totalValue = ui.helper.text();
        let dataValue = ui.helper.attr('data-value');
        let dataTitle = ui.helper.attr('data-title');
        let otherTitle = ui.helper.attr('title');
        // get the value by replacing the data-title from totalValue
        let value = dataValue.replace(/[^0-9.%-]/g, '').trim();

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
            $(this).val($(this).val() + value);
            
          } else {
            $(this).val(value);
          }
          // $(this).val($(this).val() + value);
          // $(this).val(value);

        }
      }
    });
  });



  $(function () {
    // Make elements with class 'draggable' draggable
    $(".draggable").draggable({
      cancel: '.title',
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
        if (ui.draggable.hasClass('draggable')) {
          var newElem = $(ui.helper).clone(false);
          newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
          newElem.removeClass('draggable');
          newElem.removeClass('dragging');
          newElem.addClass('sortable')
          // Add a title to the new element
          newElem.prepend("<div class='title' contenteditable='true'>Calculator result</div>");
          // Add a horizontal line after the new element
          newElem.appendTo(this);
          // $("<hr>").appendTo(this);
          $(this).sortable({ cancel: '.title' }).removeClass('ui-draggable ui-draggable-handle ui-sortable-handle');

        }
        else if (ui.draggable.hasClass('sortable')) {
          var newElem = $(ui.draggable);
          newElem.removeClass('ui-sortable ui-draggable ui-draggable-handle ui-sortable-handle').css({ 'position': 'relative', 'left': '', 'top': '' });
          // newElem.appendTo(this);
          newElem.addClass('sortable')
          newElem.removeClass('draggable');
          newElem.removeClass('dragging');
          newElem.appendTo(this);
          $(this).sortable();

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

  $('#Journal_container').sortable({
    cancel: '.title',
    helper: 'clone',
    start: function (event, ui) {
      ui.helper.find('.title').hide();
      ui.helper.css('width', 'fit-content');
      ui.helper.css('height', 'fit-content');

    },
    stop: function (event, ui) {
      ui.item.find('.title').show();
    }
  });



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
          $('#result').attr('data-value', formattedResult);
          $('#inputField').attr('data-value', formattedResult);

          // // Update the data-value attribute of the draggable element
          // var draggableElements = $('.draggable, .sortable');
          // draggableElements.each(function () {
          //   $(this).attr('data-value', formattedResult);});
        }
      } catch (error) {
        alert('Invalid Expression');
      }
    } else {
      $('#inputField').val($('#inputField').val() + value);
      $('#inputField').attr('data-value', $('#inputField').val() + value);
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
  const selectedRadio = $('input[type=radio][name=case_3_radio]:checked');
  const id = selectedRadio.attr('id');
  const value = selectedRadio.val();
  localStorage.setItem(id, value);
  


}
function SaveToLocalStorage() {
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



document.getElementById('continueButton').addEventListener('click', function () {
  var radios = document.getElementsByName('page');
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      localStorage.setItem('6. graph_type', radios[i].id)
      window.location.href = radios[i].value;
      break;
    }
  }
});
