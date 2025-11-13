
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const resultsContainer = document.getElementById('results-container');
  const errorMessage = document.getElementById('error-message');

  // Change to your backend API
  const apiUrl = 'http://localhost:5000/api/products';

  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) {
      errorMessage.textContent = 'Please enter a search term.';
      resultsContainer.innerHTML = '';
      return;
    }

    try {
      const response = await fetch(`${apiUrl}?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      resultsContainer.innerHTML = '';

      if (data.length > 0) {
        data.forEach(product => {
          const card = document.createElement('div');
          card.className = 'border rounded-lg shadow p-4 hover:shadow-lg';
          card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded">
            <h2 class="mt-2 font-bold text-lg">${product.name}</h2>
            <p class="text-gray-600">$${product.price}</p>
          `;
          resultsContainer.appendChild(card);
        });
        errorMessage.textContent = '';
      } else {
        errorMessage.textContent = 'No results found.';
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred while fetching results.';
      console.error('Fetch error:', error);
    }
  });
