document.addEventListener('DOMContentLoaded', async function() {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');
  
    async function fetchEvents() {
      try {
        const response = await fetch('http://localhost:5000/events');
        if (!response.ok) throw new Error('Nepavyko gauti renginių');
        const events = await response.json();
        renderEvents(events);
      } catch (error) {
        alert('Klaida gaunant renginius');
      }
    }
  
    function renderEvents(events) {
      eventList.innerHTML = '';
      events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${event.title}</td>
          <td>${new Date(event.date).toLocaleDateString('lt-LT')}</td>
          <td>
            <button class="btn btn-sm btn-danger delete-event" data-id="${event._id}">Ištrinti</button>
          </td>
        `;
        eventList.appendChild(row);
      });
    }
  
    eventForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const eventData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
      };
  
      try {
        const response = await fetch('http://localhost:5000/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Nepavyko sukurti renginio');
        alert('Renginys sėkmingai sukurtas!');
        eventForm.reset();
        fetchEvents();
      } catch (error) {
        alert('Klaida kuriant renginį');
      }
    });
  
    eventList.addEventListener('click', async function(e) {
      if (e.target.classList.contains('delete-event')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Ar tikrai norite ištrinti šį renginį?')) {
          try {
            const response = await fetch(`http://localhost:5000/events/${id}`, {
              method: 'DELETE'
            });
            if (!response.ok) throw new Error('Nepavyko ištrinti renginio');
            fetchEvents();
            alert('Renginys sėkmingai ištrintas');
          } catch (error) {
            alert('Klaida trinant renginį');
          }
        }
      }
    });
  
    fetchEvents();
  });