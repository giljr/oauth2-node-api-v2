// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Index.js loaded successfully!');

    // Example: Add a click event to the authentication link
    const authLink = document.querySelector('a[href="/auth/google"]');
    if (authLink) {
        authLink.addEventListener('click', (event) => {
            console.log('Authentication link clicked!');
            // Optionally, you can add more functionality here
        });
    }
});
