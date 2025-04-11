document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await loginUser(email, password);
        if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html';
        } else {
          alert('Login failed: ' + response.statusText);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    });
  }
});

async function loginUser(email, password) {
  // Function to log in the user
  // and set the authentication token in cookies
  return fetch('http://127.0.0.1:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
  });
  }

  function checkAuthentication() {
    // Function to check if the user is authenticated
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
  // Function to fetch places from the API
  try {
    console.log('hello');
    const response = await fetch('http://127.0.0.1:5000/api/v1/places', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('API Response Status:', response.status);  // Log du statut de la réponse
    if (!response.ok) {
      throw new Error('Error fetching places: ' + response.statusText);
    }
    const data = await response.json();
    console.log(data); // log des données récupérées
    displayPlaces(data);
  } catch (error) {
    console.error('Error fetching places:', error); // error if the call fails
  }
}

function displayPlaces(places) {
  // Function to display places on the page
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  places.forEach(place => {
      const card = document.createElement('div');
      card.className = 'place-card';
      card.dataset.price = place.price;
      card.innerHTML = `
      <h3>${place.title}</h3>
      <br>
      <p>Price per night: ${place.price}</p>
      <button class="details-button"><a href="place.html">View Details</a></button>`;
      placesList.appendChild(card);
  });
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('change', (event) => {
      const maxPrice = event.target.value;
      const cards = document.querySelectorAll('.place-card');

      cards.forEach(card => {
        const price = parseFloat(card.dataset.price);
        if (maxPrice === 'all' || price <= parseFloat(maxPrice)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

function getCookie(name) {
    // Function to get a cookie value by its name
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return value;
      }
      return null;
    }
}

function getPlaceIdFromURL() {
  // Extract the place ID from window.location.search
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function fetchPlaceDetails(token, placeId) {
  // Make a GET request to fetch place details
  // Include the token in the Authorization header
  // Handle the response and pass the data to displayPlaceDetails function
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error fetching place details: ' + response.statusText);
    }
    const place = await response.json();
    displayPlaceDetails(place);
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
}

function displayPlaceDetails(place) {
  // Clear the current content of the place details section
  // Create elements to display the place details (name, description, price, amenities and reviews)
  // Append the created elements to the place details section
}
