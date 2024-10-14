// Categorized Medicines Data
const medicinesByCategory = {
    pills: [
      { name: "Paracetamol", image: "Lluvia de dinero.jpg", description: "Used to treat pain and fever.</br>Ksh.50/unit" },
      { name: "Ibuprofen", image: "Lluvia de dinero.jpg", description: "Used to reduce fever and treat pain or inflammation." },
      { name: "Amoxicillin", image: "Lluvia de dinero.jpg", description: "Antibiotic for bacterial infections.." },
      { name: "Aspirin", image: "Lluvia de dinero.jpg", description: "Relieves pain, reduces fever and inflammation." }
    ],
    drinking: [
      { name: "Cough Syrup", image: "Lluvia de dinero.jpg", description: "Used to soothe coughs and sore throats." },
      { name: "Antacid", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." },
      { name: "Stomach Drug", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." }
    ],
    inhaled: [
      { name: "Asthma Inhaler", image: "Lluvia de dinero.jpg", description: "Used to treat asthma symptoms." },
      { name: "Nasal Spray", image: "Lluvia de dinero.jpg", description: "Relieves nasal congestion." },
      { name: "Hair Spray", image: "Lluvia de dinero.jpg", description: "Neutralizes stomach acid for heartburn relief." }
    ]
};

// Render Medicines by Category
function renderMedicinesByCategory(category, containerId) {
    const container = document.getElementById(containerId);
    const medicines = medicinesByCategory[category];

    container.innerHTML = medicines.map(medicine => `
      <div class="medicine-card">
        <img src="${medicine.image}" alt="${medicine.name}">
        <h3>${medicine.name}</h3>
        <p>${medicine.description}</p>
        <input type="number" id="${medicine.name}-quantity" min="1" value="1" placeholder="Quantity" />
        <input type="text" id="${medicine.name}-location" placeholder="Pickup Location" />
        <button onclick="addToCart('${medicine.name}')">Add to Cart</button>
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
            medicine.name.toLowerCase().includes(searchTerm) || 
            medicine.description.toLowerCase().includes(searchTerm)
        );

        const containerId = category + '-carousel';
        document.getElementById(containerId).innerHTML = filteredMedicines.map(medicine => `
          <div class="medicine-card">
            <img src="${medicine.image}" alt="${medicine.name}">
            <h3>${medicine.name}</h3>
            <p>${medicine.description}</p>
            <input type="number" id="${medicine.name}-quantity" min="1" value="1" placeholder="Quantity" />
            <input type="text" id="${medicine.name}-location" placeholder="Pickup Location" />
            <button onclick="addToCart('${medicine.name}')">Add to Cart</button>
          </div>
        `).join('');
    });
});
 // Function to toggle cart overlay visibility
        function toggleCartOverlay() {
            const overlay = document.getElementById("cart-overlay");
            overlay.style.display = overlay.style.display === "block" ? "none" : "block";
        }

        // Function to close cart overlay
        function closeCartOverlay() {
            document.getElementById("cart-overlay").style.display = "none";
        }
// Variables for storing cart items
let cartItems = [];

// Function to add items to the cart
function addToCart(medicineName) {
    const quantityInput = document.getElementById(`${medicineName}-quantity`);
    const locationInput = document.getElementById(`${medicineName}-location`);

    const quantity = quantityInput.value;
    const pickupLocation = locationInput.value;

    if (quantity <= 0 || !pickupLocation) {
        alert("Please specify a valid quantity and pickup location!");
        return;
    }

    const item = {
        medicineName,
        quantity,
        pickupLocation,
        mpesaImage: null // Placeholder for the uploaded image
    };
    
    cartItems.push(item);
    renderCartItems();
}

// Function to render cart items
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
            <input type="file" id="mpesa-image-${index}" accept="image/*" onchange="uploadImage(${index}, this.files[0])" />
            <button class="remove-item-btn" onclick="removeCartItem(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Function to upload M-PESA image
function uploadImage(index, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        cartItems[index].mpesaImage = e.target.result; // Store image data as base64 string
    };
    reader.readAsDataURL(file);
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
        return `Medicine: ${item.medicineName} <br>Quantity: ${item.quantity} <br>Pickup Location: ${item.pickupLocation} <br>M-Pesa Image: <img src="${item.mpesaImage || ''}" style="max-width:100px;" />`;
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
