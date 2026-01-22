let cart = [];
let likes = {
    'spicy-wings': 100, 'tropical-bowl': 1000, 'pulled-pork': 100, 'loaded-nachos': 1000,
    'burger': 100, 'pizza': 1000, 'fries': 100, 'chicken-wrap': 1000, 'bbq-ribs': 100,
    'caesar-salad': 1000, 'veggie-burger': 100, 'shrimp-tacos': 1000, 'double-cheeseburger': 100,
    'fried-chicken': 1000, 'philly-cheesesteak': 100, 'ice-coffee': 1000, 'lemonade': 100,
    'mojito': 1000, 'smoothie': 100, 'mango-lassi': 1000, 'iced-tea': 100, 'watermelon-juice': 1000,
    'peach-iced-tea': 100, 'strawberry-milkshake': 1000, 'cucumber-cooler': 100
};
let likedItems = {
    'spicy-wings': false, 'tropical-bowl': false, 'pulled-pork': false, 'loaded-nachos': false,
    'burger': false, 'pizza': false, 'fries': false, 'chicken-wrap': false, 'bbq-ribs': false,
    'caesar-salad': false, 'veggie-burger': false, 'shrimp-tacos': false, 'double-cheeseburger': false,
    'fried-chicken': false, 'philly-cheesesteak': false, 'ice-coffee': false, 'lemonade': false,
    'mojito': false, 'smoothie': false, 'mango-lassi': false, 'iced-tea': false, 'watermelon-juice': false,
    'peach-iced-tea': false, 'strawberry-milkshake': false, 'cucumber-cooler': false
};

// Check internet connectivity and handle welcome animation
window.onload = function() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const offlineMessage = document.getElementById('offlineMessage');

    if (!navigator.onLine) {
        offlineMessage.style.display = 'block';
        welcomeOverlay.style.animation = 'none'; // Prevent fade-out
    } else {
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 4000);
    }

    // Update online/offline status
    window.addEventListener('online', () => {
        offlineMessage.style.display = 'none';
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 1000);
    });

    window.addEventListener('offline', () => {
        offlineMessage.style.display = 'block';
        welcomeOverlay.style.display = 'flex';
        welcomeOverlay.style.animation = 'none';
    });

    // Initialize likes display
    Object.keys(likes).forEach(item => {
        const likeCountElement = document.getElementById(`like-${item}`);
        if (likeCountElement) {
            likeCountElement.textContent = likes[item];
        }
    });

    // Add event listeners for rating stars
    document.querySelectorAll('.rating .fa-star').forEach(star => {
        star.addEventListener('click', function() {
            const ratingDiv = this.parentElement;
            const menuItem = ratingDiv.closest('.menu-item');
            const item = menuItem.dataset.item;
            const newRating = Array.from(ratingDiv.children).indexOf(this) + 1;
            updateRating(item, newRating);
        });
    });
};

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    updateCartDisplay();
    alert(`${itemName} savatga qo'shildi!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} - ${item.price.toLocaleString()} so'm</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">O'chirish</button>
        `;
        cartItems.appendChild(div);
    });

    document.getElementById('total').textContent = `${total.toLocaleString()} so'm`;
    
    // Update delivery info
    const deliveryInfo = document.getElementById('delivery-info');
    if (total >= 50000) {
        deliveryInfo.textContent = 'Bepul yetkazib berish!';
        deliveryInfo.style.color = '#28a745';
    } else {
        deliveryInfo.textContent = 'Yetkazib berish: 10,000 so\'m';
        deliveryInfo.style.color = '#ff4500';
    }
}

function toggleLike(item) {
    const likeBtn = document.querySelector(`.menu-item[data-item="${item}"] .like-btn`);
    if (!likedItems[item]) {
        likes[item]++;
        likedItems[item] = true;
        likeBtn.classList.add('liked');
        likeBtn.querySelector('i').classList.replace('far', 'fas');
    } else {
        likes[item]--;
        likedItems[item] = false;
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('i').classList.replace('fas', 'far');
    }
    document.getElementById(`like-${item}`).textContent = likes[item];
}

function updateRating(item, rating) {
    const ratingDiv = document.querySelector(`.menu-item[data-item="${item}"] .rating`);
    ratingDiv.setAttribute('data-rating', rating);
    const stars = ratingDiv.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = total >= 50000 ? 0 : 10000;

    if (!name || !phone || !address || cart.length === 0) {
        alert('Iltimos, barcha maydonlarni to\'ldiring va kamida bitta mahsulot tanlang!');
        return;
    }

    alert(`Buyurtma muvaffaqiyatli yuborildi!\nIsm: ${name}\nTelefon: ${phone}\nManzil: ${address}\nMahsulotlar: ${cart.map(item => item.name).join(', ')}\nTo'lov usuli: ${paymentMethod === 'cash' ? 'Naqd' : 'Karta'}\nJami: ${total.toLocaleString()} so'm\nYetkazib berish: ${deliveryFee === 0 ? 'Bepul' : '10,000 so\'m'}`);
    cart = [];
    updateCartDisplay();
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.querySelector('input[name="payment"][value="cash"]').checked = true;
}
const menus = [
    [
        { name: "Classic Burger", price: 45000, img: "image/classic Burger.jpg", desc: "Mol go'shti, pomidor, salat va maxsus sous", likes: 100, rating: 4 },
        { name: "Peperoni Pizza", price: 80000, img: "image/peperonni pizza.jpg", desc: "Pepperoni, pishloq va pomidor sousi", likes: 1000, rating: 5 },
        { name: "French Fries", price: 20000, img: "image/French Fries.jpg", desc: "Qovurilgan kartoshka va ketchup", likes: 100, rating: 3 }
    ],
    [
        { name: "Chicken Wrap", price: 35000, img: "image/chicken warp.jpg", desc: "Tovuq, lavash, salat va yogurt sousi", likes: 1000, rating: 4 },
        { name: "BBQ Ribs", price: 75000, img: "image/BBQ Ribs.jpg", desc: "Barbekyu qovurg'asi, maxsus sous bilan", likes: 100, rating: 5 },
        { name: "Veggie Burger", price: 42000, img: "image/Veggie Burger.jpg", desc:"Sabzavotli burger, no'xat kotleti bilan", likes: 100, rating: 5 },
    ],
    [
        { name: "Shrimp Tacos", price: 50000, img: "image/Shrimp Tacos.jpg", desc: "Krevetkali takos, salsa va salat bilan", likes: 1000,vrating: 2 },
        { name: "Double Cheeseburger", price: 60000, img: "image/Double Cheeseburger.jpg", desc: "Ikki qavatli burger, pishloq va maxsus sous bilan", likes: 100, rating: 1 },
        { name: "Fried Chicken Bucket", price: 70000, img: "image/Fried Chicken Bucket.jpg", desc: " Qovurilgan tovuq qisimlari,sous bilan", likes: 1000, rating: 4 },
    ],
        { name: "Philly Cheesesteak", price: 58000, img: "image/Philly Cheesesteak.jpg", desc: " Mol go'shti, pishloq va piyozli sendvich", likes: 100, rating: 3 },
        { name: "Caesar Salad", price: 40000, img: "image/Caesar Salad.jpg", desc: "Sezar salati, tovuq va kruton bilan", likes: 1000, rating: 4 }
    ];

function renderMenu(menuItems) {
    const menuGrid = document.querySelector(".menu-grid");
    menuGrid.innerHTML = "";

    menuItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.dataset.item = item.name.toLowerCase().replace(" ", "-");

        // yulduzcha baholashni hosil qilish
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += i <= item.rating ? `<i class="fas fa-star"></i>` : `<i class="far fa-star"></i>`;
        }

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="description">${item.desc}</p>

            <!-- Yulduzcha narxdan ustida -->
            <div class="rating" data-rating="${item.rating}">
                ${stars}
            </div>

            <!-- Narx -->
            <div class="price">${item.price.toLocaleString()} so'm</div>

            <!-- Savat tugmasi va Layk yonma-yon -->
            <div class="action-row">
                <button class="like-btn" onclick="toggleLike('${div.dataset.item}')">
                    <i class="far fa-heart"></i> <span id="like-${div.dataset.item}">${item.likes}</span>
                </button>
                <button class="order-btn" onclick="addToCart('${item.name}', ${item.price})">
                    Savatchaga qo'shish
                </button>
            </div>
        `;
        menuGrid.appendChild(div);
    });
}

// Har 2 soatda menyuni almashtirish
let currentMenuIndex = 0;
renderMenu(menus[currentMenuIndex]);

setInterval(() => {
    currentMenuIndex = (currentMenuIndex + 1) % menus.length;
    renderMenu(menus[currentMenuIndex]);
}, 7200); // 2 soat
function toggleLike(item) {
    const likeSpan = document.getElementById(`like-${item}`);
    let currentLikes = parseInt(likeSpan.textContent); // matndan son olish

    // Agar hali bosilmagan bo‘lsa
    if (!likedItems[item]) {
        currentLikes += 1; // +1 qo‘shamiz
        likedItems[item] = true;
        likeSpan.textContent = currentLikes;
        // tugma ko‘rinishini o‘zgartirish
        const likeBtn = document.querySelector(`.menu-item[data-item="${item}"] .like-btn`);
        likeBtn.classList.add('liked');
        likeBtn.querySelector('i').classList.replace('far', 'fas');
    } else {
        // Agar qaytarib olinsa
        currentLikes -= 1; // -1 kamaytirish
        likedItems[item] = false;
        likeSpan.textContent = currentLikes;
        const likeBtn = document.querySelector(`.menu-item[data-item="${item}"] .like-btn`);
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('i').classList.replace('fas', 'far');
    }
}