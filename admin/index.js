const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const slapyvardis = document.querySelector('#slapyvardis').value;
  const slaptazodis = document.querySelector('#slaptazodis').value;

  try {
    const response = await fetch('http://localhost:5000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slapyvardis, slaptazodis }),
    });

    const data = await response.json();

    if (data.sekme) {
      alert(data.zinute);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('slapyvardis', slapyvardis);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.zinute);
    }
  } catch (error) {
    alert('Įvyko klaida bandant prisijungti. Bandykite dar kartą.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
  }
});