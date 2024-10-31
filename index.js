const API_URL = "http://localhost:5000/events";
let events = [];

async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error("Klaida gaunant renginius:", error);
    }
}

function displayEvents(events) {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = ""; 

    events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.className = "col-md-4 mb-3";
        eventCard.innerHTML = `
            <div class="card event-card">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">Kategorija: ${event.category}</p>
                    <p class="card-text">Data: ${event.date}</p>
                    <p class="card-text">Vieta: ${event.location}</p>
                    <p class="card-text">Įvertinimas: ${event.rating.toFixed(1)} ⭐</p>
                    <a href="/detales/index.html?id=${event._id}" class="btn btn-primary">Peržiūrėti</a>
                </div>
            </div>
        `;
        eventList.appendChild(eventCard);
    });
}

function filterEvents() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const categoryValue = document.getElementById("categoryFilter").value;
    const dateValue = document.getElementById("dateFilter").value;

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchValue);
        const matchesCategory = categoryValue ? event.category === categoryValue : true;
        const matchesDate = dateValue ? event.date === dateValue : true;

        return matchesSearch && matchesCategory && matchesDate;
    });

    displayEvents(filteredEvents);
}

document.getElementById("search").addEventListener("input", filterEvents);
document.getElementById("categoryFilter").addEventListener("change", filterEvents);
document.getElementById("dateFilter").addEventListener("input", filterEvents);

fetchEvents();