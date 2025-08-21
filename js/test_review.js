// Get the table body element
var tableBody = document.getElementById('storageTable').getElementsByTagName('tbody')[0];
localStorage.removeItem('undefined')
localStorage.removeItem('journalData')
localStorage.removeItem('countDownDate')
localStorage.removeItem('count_down')
localStorage.removeItem('isLoggedIn')
localStorage.removeItem('calculator_state')
localStorage.removeItem('calculatorHistory')
localStorage.removeItem('calculator_tutorial_shown')
localStorage.removeItem('case1_tutorial_shown')


// Create an array for all items in local storage
var items = [];

// Loop through all keys in local storage
for (var i = 0; i < localStorage.length; i++) {
    // Get the key
    var key = localStorage.key(i);

    // Get the value
    var value = localStorage.getItem(key);

    // Add the key and value as an object to the array
    items.push({ key: key, value: value });
}

// Sort the array based on the key property
items.sort(function (a, b) {
    if (a.key < b.key) { return -1; }
    if (a.key > b.key) { return 1; }
    return 0;
});
// Sort the array based on the key property
items.sort(function (a, b) {
    // Check if a.key or b.key starts with "Case 10"
    var aCase10 = a.key.startsWith("Case 10");
    var bCase10 = b.key.startsWith("Case 10");

    // If both keys start with "Case 10" or if neither do, sort them alphabetically
    if ((aCase10 && bCase10) || (!aCase10 && !bCase10)) {
        if (a.key < b.key) { return -1; }
        if (a.key > b.key) { return 1; }
        return 0;
    }

    // If a.key starts with "Case 10" but b.key does not, a should come later
    if (aCase10) {
        return 1;
    }

    // If b.key starts with "Case 10" but a.key does not, b should come later
    if (bCase10) {
        return -1;
    }
});

// Loop through the sorted array and add each item to the table
for (var i = 0; i < items.length; i++) {
    // Create a new row
    var newRow = tableBody.insertRow();

    // Insert a cell for the key
    var keyCell = newRow.insertCell(0);
    keyCell.textContent = items[i].key;

    // Insert a cell for the value
    var valueCell = newRow.insertCell(1);
    valueCell.textContent = items[i].value;
}
// end analysis btn
function showConfirmBox() {
    document.getElementById("overlay").hidden = false;
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
document.getElementById("downloadCSV").addEventListener("click", function () {
    // Convert sorted local storage data to CSV
    var csv = 'Key,Value\n';
    for (var i = 0; i < items.length; i++) {
        csv += items[i].key + ',' + items[i].value + '\n';
    }

    // Create a blob from the CSV string
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and click it
    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Test_answers.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

localStorage.clear();
localStorage.setItem('isLoggedIn', true);