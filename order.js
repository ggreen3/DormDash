// Categorized Medicines Data
const medicinesByCategory = {
    pills: [
      { name: "Paracetamol", image: "Lluvia de dinero.jpg", description: "Used to treat pain and fever.</br>Ksh.50/unit" },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      { name: "Amoxicillin", image: "Lluvia de dinero.jpg", description: "Antibiotic for bacterial infections.." },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      { name: "Aspirin", image: "Lluvia de dinero.jpg", description: "Relieves pain, reduces fever and inflammation." }
    ],
    drinking: [
      { name: "Cough Syrup", image: "Lluvia de dinero.jpg", description: "Used to soothe coughs and sore throats." },
      { name: "Antacid", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      {name: "stomachdrug", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." }
    ],
    inhaled: [
      { name: "Asthma Inhaler", image: "Lluvia de dinero.jpg", description: "Used to treat asthma symptoms." },
      { name: "Nasal Spray", image: "Lluvia de dinero.jpg", description: "Relieves nasal congestion." },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      {name: "Hair spray", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." }
    ]
};

// Render Medicines by Category
function renderMedicinesByCategory(category, containerId) {
    const container = document.getElementById(containerId);
    const medicines = medicinesByCategory[category];

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

searchBar.addEventListener('input', function() {
    const searchTerm = searchBar.value.toLowerCase();

    Object.keys(medicinesByCategory).forEach(category => {
        const filteredMedicines = medicinesByCategory[category].filter(medicine =>
            medicine.name.toLowerCase().includes(searchTerm)
        );

        const containerId = category + '-carousel';
        document.getElementById(containerId).innerHTML = filteredMedicines.map(medicine => `
          <div class="medicine-card" onclick="openModal('${medicine.name}')">
            <img src="${medicine.image}" alt="${medicine.name}">
            <h3>${medicine.name}</h3>
            <p>${medicine.description}</p>
          </div>
        `).join('');
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

    Object.keys(medicinesByCategory).forEach(category => {
        const medicine = medicinesByCategory[category].find(m => m.name === medicineName);
        if (medicine) selectedMedicine = medicine;
    });

    if (selectedMedicine) {
        modalContent.name.textContent = selectedMedicine.name;
        modalContent.image.src = selectedMedicine.image;
        modalContent.description.textContent = selectedMedicine.description;
        modalContent.quantity.value = 1;  // Default quantity
        modal.style.display = 'block';  // Make sure modal is displayed
    }
}

const closeModalBtn = document.querySelector('.close-btn');
closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Handle Payment Button Click
const payBtn = document.querySelector('.pay-btn');
payBtn.addEventListener('click', function() {
    const selectedQuantity = modalContent.quantity.value;
    const selectedLocation = modalContent.location.value;
    const mpesaReference = modalContent.mpesaRef.value;

    if (!mpesaReference) {
        alert("Please enter the M-PESA reference number!");
        return;
    }

    alert(`You are ordering ${selectedQuantity} units of ${modalContent.name.textContent} to be picked up at ${selectedLocation}. M-PESA Ref No: ${mpesaReference}.`);
    
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

    const orderSummary = cartItems.map(item => {
        return `
            <li>
                Medicine: ${item.medicineName} <br>
                Quantity: ${item.quantity} <br>
                Pickup Location: ${item.pickupLocation} <br>
                M-Pesa Ref: ${item.mpesaReference}
            </li>
        `;
    }).join('');

    const emailBody = `<p>You have placed the following order:</p><ul>${orderSummary}</ul>`;

    // Email sending logic (replace your backend API link)
    const requestData = {
        subject: 'GHOST Pharmacy Order',
        body: emailBody,
        to: 'mail' // Replace with your actual recipient email address
    };

    fetch("https://backend.buildpicoapps.com/aero/run/self-email-api?pk=v1-Z0FBQUFBQm1XYWNNN1N1T09oRWdNTDNMTERVOUI4bEFSWWRkSURVdXdCSDhaMjJ3RjdSSkxvRjZoc2d4eXlNVkhnV05vQWxMelRBTjZiRi0wb2JkNHZ0WlM1V3pGdzhOUUE9PQ==", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Your order has been submitted successfully!');
            cartItems = []; // Clear the cart after successful order
            renderCartItems();
        } else {
            alert('There was an issue processing your order.');
            console.error(data);
        }
    })
    .catch(error => {
        alert('There was an error submitting your order. Please try again.');
        console.error(error);
    });
});
