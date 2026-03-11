document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // You would replace this with your actual login logic.
    // This example just checks if the username and password are both "admin".
    if (username === 'YouInConsulting' && password === 'YouInConsulting') {
        localStorage.setItem('isLoggedIn', 'true');  // Set isLoggedIn to true in local storage
        window.location.href = 'index.html';
    } else {
        // Failed login
        // Display an error message
        document.getElementById('login-error').textContent = 'Invalid username or password.';
    }
});

