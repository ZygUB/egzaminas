const API_URL = 'http://127.0.0.1:5000/events';

async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Klaida: ${response.status}`);
        }
        const events = await response.json();
        displayCategories(events);
    } catch (error) {
        console.error("Klaida gaunant renginius:", error);
    }
}

function displayCategories(events) {
    const categories = {};

    events.forEach(event => {
        const category = event.category;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(event);
    });

    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    for (const category in categories) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <h3>${category}</h3>
            <ul class="list-group">
                ${categories[category].map(event => `
                    <li class="list-group-item">
                        <a href="/detales/index.html?id=${event._id}">${event.title}</a>
                    </li>
                `).join('')}
            </ul>
        `;
        categoriesContainer.appendChild(categoryDiv);
    }
}

fetchEvents();