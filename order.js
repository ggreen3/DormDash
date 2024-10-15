// Categorized Medicines Data
const medicinesByCategory = {
    pills: [
        { name: "Paracetamol", image: "Lluvia de dinero.jpg", description: "Used to treat pain and fever.</br>Ksh.50/unit" },
        { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
        { name: "Amoxicillin", image: "Lluvia de dinero.jpg", description: "Antibiotic for bacterial infections." },
        { name: "Aspirin", image: "Lluvia de dinero.jpg", description: "Relieves pain, reduces fever and inflammation." }
    ],
    drinking: [
        { name: "Cough Syrup", image: "Lluvia de dinero.jpg", description: "Used to soothe coughs and sore throats." },
        { name: "Antacid", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." },
        { name: "Stomach Drug", image: "Lluvia de dinero.jpg", description: "Used for stomach pain relief." }
    ],
    inhaled: [
        { name: "Asthma Inhaler", image: "Lluvia de dinero.jpg", description: "Used to treat asthma symptoms." },
        { name: "Nasal Spray", image: "Lluvia de dinero.jpg", description: "Relieves nasal congestion." },
        { name: "Hair Spray", image: "Lluvia de dinero.jpg", description: "Used for hair styling." }
    ]
};

// Render Medicines by Category
function renderMedicinesByCategory(category, containerId) {
    const container = document.getElementById(containerId);
    const medicines = medicinesByCategory[category];

    // Check if medicines exist for the category before rendering
    if (!medicines) {
        container.innerHTML = '<p>No medicines available in this category.</p>';
        return;
    }

    container.innerHTML = medicines.map(medicine => `
      <div class="medicine-card" onclick="openModal('${medicine.name}')">
        <img src="${medicine.image}" alt="${medicine.name}">
        <h3>${medicine.name}</h3>
        <p>${medicine.description}</p>
      </div>
    `).join('');
}

// Render All Categories
renderMedicinesByCategory('pills', 'pills-carousel');
renderMedicinesByCategory('drinking', 'drinking-carousel');
renderMedicinesByCategory('inhaled', 'inhaled-carousel');

// Search Functionality
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();

    Object.keys(medicinesByCategory).forEach(category => {
        const filteredMedicines = medicinesByCategory[category].filter(medicine =>
            medicine.name.toLowerCase().includes(searchTerm)
        );

        const containerId = category + '-carousel';
        document.getElementById(containerId).innerHTML = filteredMedicines.length ? filteredMedicines.map(medicine => `
          <div class="medicine-card" onclick="openModal('${medicine.name}')">
            <img src="${medicine.image}" alt="${medicine.name}">
            <h3>${medicine.name}</h3>
            <p>${medicine.description}</p>
          </div>
        `).join('') : '<p>No results found.</p>'; // Handle no results found
    });
});

// Modal Functionality
const modal = document.getElementById('order-modal');
const modalContent = {
    name: document.getElementById('medicine-name'),
    image: document.getElementById('medicine-image'),
    description: document.getElementById('medicine-description'),
    quantity: document.getElementById('medicine-quantity'),
    location: document.getElementById('pickup-location'),
    mpesaRef: document.getElementById('mpesa-ref')
};

function openModal(medicineName) {
    let selectedMedicine;

    // Find the selected medicine in all categories
    Object.keys(medicinesByCategory).forEach(category => {
        const medicine = medicinesByCategory[category].find(m => m.name === medicineName);
        if (medicine) selectedMedicine = medicine;
    });

    if (selectedMedicine) {
        modalContent.name.textContent = selectedMedicine.name;
        modalContent.image.src = selectedMedicine.image;
        modalContent.description.innerHTML = selectedMedicine.description; // Allow HTML for descriptions
        modalContent.quantity.value = 1;  // Default quantity
        modal.style.display = 'block';  // Show modal
    }
}

// Close Modal Button
const closeModalBtn = document.querySelector('.close-btn');
closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Handle Payment Button Click
const payBtn = document.querySelector('.pay-btn');
payBtn.addEventListener('click', function () {
    const selectedQuantity = modalContent.quantity.value;
    const selectedLocation = modalContent.location.value;
    const mpesaReference = modalContent.mpesaRef.value;

    if (!mpesaReference) {
        alert("Please enter the M-PESA reference number!");
        return;
    }

    alert(`You are ordering ${selectedQuantity} units of ${modalContent.name.textContent} to be picked up at ${selectedLocation}. M-PESA Ref No: ${mpesaReference}.`);

    addToCart(modalContent.name.textContent, selectedQuantity, selectedLocation, mpesaReference);
    modal.style.display = 'none';
});

// Persist Form Input in Local Storage
const orderForm = document.getElementById('orderForm');

// Load the saved input data from localStorage when the page loads
window.addEventListener('load', () => {
    const formInputs = orderForm.elements;

    for (let i = 0; i < formInputs.length; i++) {
        const input = formInputs[i];

        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
            const savedInput = localStorage.getItem(input.name || input.id);

            if (savedInput) {
                input.value = savedInput; // Restore the saved value
            }
        }
    }
});

// Save input data to localStorage when user types
orderForm.addEventListener('input', (event) => {
    const input = event.target;

    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
        localStorage.setItem(input.name || input.id, input.value);
    }
});

// Variables for storing cart items and initializing the cart section
let cartItems = [];

// Function to add items to the cart
function addToCart(medicineName, quantity, pickupLocation, mpesaReference) {
    const item = {
        medicineName,
        quantity,
        pickupLocation,
        mpesaReference,
    };
    cartItems.push(item);
    renderCartItems();
}

// Function to render cart items in the cart section
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h3>${item.medicineName}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Pickup Location: ${item.pickupLocation}</p>
            <p>M-Pesa Ref: ${item.mpesaReference}</p>
            <button class="remove-item-btn" onclick="removeCartItem(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Function to remove items from the cart
function removeCartItem(index) {
    cartItems.splice(index, 1);
    renderCartItems();
}

// Checkout process
document.getElementById('checkout-btn').addEventListener('click', function () {
    if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderSummary = cartItems.map(item => `
        <li>
            Medicine: ${item.medicineName} <br>
            Quantity: ${item.quantity} <br>
            Pickup Location: ${item.pickupLocation} <br>
            M-Pesa Ref: ${item.mpesaReference}
        </li>
    `).join('');

    const emailBody = `<p>You have placed the following order:</p><ul>${orderSummary}</ul>`;

    // Email sending logic (replace your backend API link)
    const requestData = {
        subject: 'GHOST Pharmacy Order',
        body: emailBody,
        to: 'mail' // Replace with your actual recipient email address
    };

    fetch("https://backend.buildpicoapps.com/aero/run/self-email-api?pk=v1-Z0FBQUFBQm1XYWNNN1N1T09oRWdNTDNMTERVOUI4bEFSWWRkSURVdXdCSDhaMjJ3RjdSSkxvRjZoc2d4eXlNVkhnVnY4WE85dHozUUN1Vnl3VGN5c2R0UnB0dUJFNXRtY2E5WlplY1Z4RGtvVXZpb0pSbk1oQm5jWEhzSDhzd0NMMi4uZA==", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            alert('Your order has been placed successfully!');
            cartItems = []; // Clear cart after order
            renderCartItems();
        } else {
            alert('There was an error placing your order.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    });
});
