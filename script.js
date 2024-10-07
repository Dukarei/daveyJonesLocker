const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = '/dashboard'; // redirect to dashboard
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});