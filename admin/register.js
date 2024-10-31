document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slapyvardis: username,
                elPastas: email,
                slaptazodis: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.zinute || 'Įvyko klaida registruojantis');
        }
        
        const messageElement = document.getElementById('registrationMessage');
        messageElement.textContent = data.zinute;
        messageElement.style.color = 'green';
        document.getElementById('registrationForm').reset();

    } catch (error) {
        const messageElement = document.getElementById('registrationMessage');
        messageElement.textContent = error.message;
        messageElement.style.color = 'red';
        console.error('Klaida registruojantis:', error);
    }
});