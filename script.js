let bar = document.querySelector("#bar");
let poster = document.querySelector(".poster");
let details = document.querySelector(".details");
let suggestion = document.querySelector(".suggestion");
let searchBtn = document.querySelector("#searchBtn");
let content = document.querySelector(".content");

// Initial Button State
searchBtn.innerHTML = "🎬";
let isOpen = true;

// Event Listener for Search Input
bar.addEventListener("input", async () => {
    let query = bar.value.trim();
    
    // Reset button to "🎬" (clapperboard open) when input changes
    searchBtn.innerHTML = "🎬";
    isOpen = true;

    if (query.length === 0) {
        suggestion.innerHTML = "";
        suggestion.style.display = "none";
        return;
    }

    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=347a1c7f&s=${query}`);
        let data = await response.json();

        suggestion.innerHTML = "";
        if (data.Search) {
            data.Search.slice(0, 5).forEach(movie => {
                let sugdiv = document.createElement("div");
                sugdiv.classList.add("suggestion-item");
                sugdiv.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <span>${movie.Title} (${movie.Year})</span>
                `;

                // Click Event - Fill Input Field
                sugdiv.addEventListener("click", () => {
                    bar.value = movie.Title; // Fills the search bar
                    suggestion.innerHTML = "";
                    suggestion.style.display = "none";
                });

                suggestion.appendChild(sugdiv);
            });

            // Show Suggestions
            suggestion.style.display = "block";
        } else {
            suggestion.innerHTML = "<p>No results found</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Button Click - Fetch & Display Movie Details
searchBtn.addEventListener("click", async () => {
    let query = bar.value.trim();
    if (query.length === 0) return;

    // Toggle button icon between 🎬 (open) and <i class="fa-solid fa-clapperboard"></i> (closed)
    if (isOpen) {
        searchBtn.innerHTML = '<i class="fa-solid fa-clapperboard"></i>';
    } else {
        searchBtn.innerHTML = "🎬";
    }
    isOpen = !isOpen;

    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=347a1c7f&t=${query}`);
        let movieData = await response.json();

        if (movieData.Response === "True") {
            poster.innerHTML = `<img src="${movieData.Poster}" alt="${movieData.Title}">`;
            details.innerHTML = `
                <h2>${movieData.Title} (${movieData.Year})</h2>
                <p><strong>Genre:</strong> ${movieData.Genre}</p>
                <p><strong>Director:</strong> ${movieData.Director}</p>
                <p><strong>Actors:</strong> ${movieData.Actors}</p>
                <p><strong>Plot:</strong> ${movieData.Plot}</p>
                <p><strong>IMDB Rating:</strong> ${movieData.imdbRating}</p>
            `;

            content.style.display = "flex"; // Show details section
        } else {
            alert("Movie not found!");
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
});
