const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

if (!eventId) {
    console.error("Renginio ID nėra URL. Patikrinkite nuorodą.");
} else {
    const API_URL = `http://127.0.0.1:5000/events/${eventId}`;
    
    console.log("API URL:", API_URL);

    async function fetchEventDetails() {
        try {
            console.log("API URL, kurį kviečiame:", API_URL); 
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Serverio klaida: ${response.status} URL: ${API_URL}`);
            }
            
            const event = await response.json();
            console.log("Gautas renginys iš API:", event);
            displayEventDetails(event);
            displayComments(event.comments);
            updateAverageRating(event.rating, event.ratingsCount);
        } catch (error) {
            console.error("Klaida gaunant renginio detales:", error);
        }
    }
    
    function displayEventDetails(event) {
        console.log("Renginio informacija:", event);
        const eventDetails = document.getElementById("eventDetails");
    
        if (!eventDetails) {
            console.error("Nepavyko rasti eventDetails elemento");
            return;
        }
    
        eventDetails.innerHTML = `
            <h2>${event.title}</h2>
            <p><strong>Kategorija:</strong> ${event.category}</p>
            <p><strong>Data:</strong> ${event.date}</p>
            <p><strong>Vieta:</strong> ${event.location}</p>
            <p>${event.description}</p>
        `;
    }    

    function updateAverageRating(rating, ratingsCount) {
        const averageRatingElement = document.getElementById("averageRating");
    
        if (!averageRatingElement) {
            console.error("Nepavyko rasti averageRating elemento");
            return;
        }
        const averageRating = ratingsCount > 0 ? (rating).toFixed(2) : "N/A";
        averageRatingElement.textContent = averageRating;
    }

    function handleRatingClick(eventId) {
        const stars = document.querySelectorAll(".star");
    
        stars.forEach(star => {
            star.addEventListener("click", async (e) => {
                const rating = parseInt(e.target.getAttribute("data-value"));
    
                try {
                    const response = await fetch(`http://127.0.0.1:5000/events/${eventId}/rating`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ rating })
                    });
    
                    if (!response.ok) {
                        throw new Error("Klaida siunčiant įvertinimą į serverį");
                    }
    
                    const updatedEvent = await response.json();
                    console.log("Atnaujintas renginys:", updatedEvent);
                    updateAverageRating(updatedEvent.rating, updatedEvent.ratingsCount);
                } catch (error) {
                    console.error("Klaida siunčiant įvertinimą:", error);
                }
            });
        });
    }

    function displayComments(comments) {
        console.log("Komentarai:", comments);
        const commentsContainer = document.getElementById("comments");
    
        if (!commentsContainer) {
            console.error("Nepavyko rasti comments elemento");
            return;
        }
        commentsContainer.innerHTML = "";
        comments.forEach(comment => {
            const commentElement = document.createElement("p");
            commentElement.textContent = comment;
            commentsContainer.appendChild(commentElement);
        });
    }

    async function addComment() {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value.trim();

        if (commentText) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/events/${eventId}/comments`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ comment: commentText })
                });

                if (!response.ok) {
                    throw new Error("Klaida siunčiant komentarą į serverį");
                }

                const updatedEvent = await response.json();
                console.log("Atnaujintas renginys:", updatedEvent);
                displayComments(updatedEvent.comments);
                commentInput.value = ''; // Išvalome įvedimo laukelį
            } catch (error) {
                console.error("Klaida siunčiant komentarą:", error);
            }
        } else {
            alert('Prašome įrašyti komentarą.');
        }
    }

    document.getElementById('addCommentButton').addEventListener('click', addComment);

    
    fetchEventDetails().then(event => {
        displayEventDetails(event);
        displayComments(event.comments);
        updateAverageRating(event.rating, event.ratingsCount);
        handleRatingClick(event._id);
    });
}
