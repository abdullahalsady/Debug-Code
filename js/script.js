// Function to fetch and display categories
async function loadCategories() {
  try {
      const response = await fetch('https://openapi.programming-hero.com/api/peddy/categories'); // The API link
      const data = await response.json();

      if (data.status) {
          const categories = data.categories;
          const container = document.getElementById('category-container');
          container.innerHTML = '';

          categories.forEach(category => {
              // Create HTML for each category card
              const categoryCard = document.createElement('div');
              categoryCard.classList.add(
                  'flex',
                  'items-center',
                  'justify-center',
                  'bg-white',
                  'border',
                  'border-gray-200',
                  'p-4',
                  'rounded-lg',
                  'cursor-pointer',
                  'transition', // Add transition for smooth effect
                  'duration-200' // Duration for transition
              );
              categoryCard.innerHTML = `
                  <img src="${category.category_icon}" alt="${category.category}" class="w-12 h-12 mr-3" />
                  <h3 class="text-lg font-semibold">${category.category}</h3>
              `;

              // Add event listener to toggle active class
              categoryCard.addEventListener('click', () => {
                  // Remove active class from any previously active card
                  const activeCard = document.querySelector('.active');
                  if (activeCard) {
                      activeCard.classList.remove('active', 'border-[#F0ABFC]', 'text-fuchsia-300'); // Reset active classes
                      activeCard.classList.add('bg-white', 'border-gray-200'); // Reset to default
                  }
                  // Add active class to clicked card
                  categoryCard.classList.add('active',  'border-[#F0ABFC]', 'text-fuchsia-300'); // Set active classes
              });

              // Append the card to the container
              container.appendChild(categoryCard);
          });
      } else {
          console.error('Failed to fetch categories:', data.message);
      }
  } catch (error) {
      console.error('Error loading categories:', error);
  }
}

  


// Array to hold copied pet images
const copiedImages = [];

// Fetching data from the API with spinner handling
async function fetchPetData() {
    const spinnerContainer = document.getElementById('spinnerContainer');
    const petCardsContainer = document.getElementById('petCardsContainer');

    // Show the spinner and hide the content initially
    spinnerContainer.classList.remove('hidden');
    petCardsContainer.classList.add('flex'); // Ensure it's centered

    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await response.json();

        // Delay for at least 2 seconds to ensure the spinner shows for a while
        await delay(2000);

        if (data.status && data.pets.length > 0) {
            pets = data.pets; // Store pets data globally
            displayPetCards(pets);

            // Hide the spinner after data is fetched
            spinnerContainer.classList.add('hidden');
            petCardsContainer.classList.remove('flex'); // Remove centering after loading
        } else {
            document.getElementById('noDataMessage').classList.remove('hidden');
            spinnerContainer.classList.add('hidden'); // Hide spinner if no data
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('noDataMessage').classList.remove('hidden');
        spinnerContainer.classList.add('hidden'); // Hide spinner in case of error
    }
}

// Function to display pet cards
function displayPetCards(petsArray) {
    const container = document.getElementById('petCardsContainer');
    container.innerHTML = ''; // Clear the container before rendering

    petsArray.forEach(pet => {
        const cardHTML = `
            <div class="bg-white rounded-lg border shadow-md">
                <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover rounded-t-lg">
                <div class="p-4">
                    <h3 class="text-xl font-bold">${pet.pet_name || 'No name provided'}</h3>
                    <p class="text-sm flex items-center"><i class="fas fa-paw mr-2"></i><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                    <p class="text-sm flex items-center"><i class="fas fa-calendar-alt mr-2"></i><strong>Birth:</strong> ${pet.date_of_birth ? new Date(pet.date_of_birth).toLocaleDateString() : 'Unknown'}</p>
                    <p class="text-sm flex items-center"><i class="fas fa-venus-mars mr-2"></i><strong>Gender:</strong> ${pet.gender || 'Unknown'}</p>
                    <p class="text-sm flex items-center"><i class="fas fa-dollar-sign mr-2"></i><strong>Price:</strong> $${pet.price || 'N/A'}</p>

                    <div class="flex justify-between mt-4">
                        <button onclick="copyPetImage('${pet.image}')">
                            <i class="fa-regular fa-thumbs-up border px-4 py-3 rounded-lg"></i>
                        </button>
                        <button class="bg-teal-500 text-white px-4 rounded-lg" onclick="startAdoptionProcess(this)">Adopt</button>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg" onclick="toggleDescription(${pet.petId})">Details</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// Copy pet image to the container
function copyPetImage(imageUrl) {
    // Add the image URL to the array
    copiedImages.push(imageUrl);

    // Display the copied images in the petImageContainer
    displayCopiedImages();
}

// Display copied pet images in a two-column layout
// Display copied pet images in a two-column layout
function displayCopiedImages() {
  const petImageContainer = document.getElementById('petImageContainer');
  petImageContainer.innerHTML = ''; // Clear the container before rendering

  // Set CSS for the container to enable grid layout
  petImageContainer.style.display = 'grid';
  petImageContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  petImageContainer.style.alignItems = 'start';
  petImageContainer.style.alignContent = 'start';

  petImageContainer.style.gap = '10px'; // Optional: add gap between images

  copiedImages.forEach(imageUrl => {
      const imgHTML = `
          <div class="border p-2 rounded-lg h-auto border-zinc-200"> <!-- Set height to auto -->
              <img src="${imageUrl}" alt="Copied Pet" class="w-full h-auto object-cover rounded-lg"> <!-- Keep aspect ratio -->
          </div>
      `;
      petImageContainer.innerHTML += imgHTML;
  });
}


// Function to introduce delay (optional, for spinner handling)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch pet data on page load
fetchPetData();





// Function to sort pets by price (Descending order)
function sortByPrice() {
  const sortedPets = [...pets].sort((a, b) => b.price - a.price); // Descending order
  displayPetCards(sortedPets);
}

// Attach event listener to sort button
document.getElementById('sortByPriceBtn').addEventListener('click', sortByPrice);

// Function to fetch and display pet details in a modal
async function toggleDescription(petId) {
  const modal = document.getElementById('petDetailsModal');
  const modalContent = document.getElementById('modalContent');

  // Show the modal
  modal.classList.remove('hidden');

  // Get the specific pet data from the global pets array
  const pet = pets.find(p => p.petId === petId);

  if (pet) {
    // Populate modal with pet details
    modalContent.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-auto overflow-y-scroll scrollbar-hide" style="max-height: 80vh;">
      <!-- Image Section -->
      <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover rounded-t-lg mb-4">
  
      <!-- Pet Name -->
      <h3 class="text-2xl font-bold mb-2 text-center">${pet.pet_name || 'No name provided'}</h3>
  
      <!-- Pet Details Grid -->
      <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <p class="flex items-center"><i class="fas fa-paw mr-2"></i> <strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
        <p class="flex items-center"><i class="fas fa-calendar-alt mr-2"></i> <strong>Birth:</strong> ${pet.date_of_birth ? new Date(pet.date_of_birth).toLocaleDateString() : 'Unknown'}</p>
        <p class="flex items-center"><i class="fas fa-venus-mars mr-2"></i> <strong>Gender:</strong> ${pet.gender || 'Unknown'}</p>
        <p class="flex items-center"><i class="fas fa-dollar-sign mr-2"></i> <strong>Price:</strong> $${pet.price || 'N/A'}</p>
        <p class="flex items-center col-span-2"><i class="fas fa-syringe mr-2"></i> <strong>Vaccinated status:</strong> ${pet.vaccinated_status || 'Unknown'}</p>
      </div>
  
      <!-- Pet Additional Details -->
      <div class="mt-4">
        <h4 class="text-lg font-bold text-gray-800 mb-2 flex items-center"><i class="fas fa-info-circle mr-2"></i> Details Information</h4>
        <p class="text-gray-600">${pet.pet_details || 'No details available.'}</p>
      </div>
    </div>
  `;
  


  } else {
    modalContent.innerHTML = `<p class="text-red-500">Pet details not found.</p>`;
  }
}

// Function to close the modal
function closeModal() {
  document.getElementById('petDetailsModal').classList.add('hidden');
}


// Function to handle the adoption process with countdown and button state change
function startAdoptionProcess(button) {
  // Create and show the pop-up modal with countdown
  const adoptionPopup = document.createElement('div');
  adoptionPopup.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50', 'z-50');
  adoptionPopup.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <img src="../assets/hand.png" class="w-16 h-16 mb-4" alt="Congrats">
      <h3 class="text-2xl font-bold mb-4">Congrats!</h3>
      <p class="text-gray-700 mb-4">Adoption process is started for your pet</p>
      <p id="countdown" class="text-3xl font-bold text-green-500">3</p>
    </div>
  `;
  document.body.appendChild(adoptionPopup);

  // Countdown logic
  let countdown = 3;
  const countdownElement = adoptionPopup.querySelector('#countdown');
  const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      // Hide the popup after countdown reaches 0
      document.body.removeChild(adoptionPopup);

      // Disable the "Adopt" button and update its text to "Adopted"
      button.disabled = true;
      button.textContent = 'Adopted';
      button.classList.add('bg-gray-500', 'cursor-not-allowed'); // Optional: Add styles for the disabled state
    }
  }, 1000); // Countdown every 1 second
}

// ...


// Fetch pet data when the page loads
window.onload = function() {
  loadCategories();
  fetchPetData();
};
