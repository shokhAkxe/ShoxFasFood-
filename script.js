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
   // Barcha yulduzchalar uchun (hatto yangi yaratilganlari uchun ham)
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('fa-star')) {
        const star = e.target;
        const ratingDiv = star.parentElement;
        const menuItem = star.closest('.menu-item');
        const itemName = menuItem.querySelector('h3').textContent; // Taom nomini olamiz
        
        const stars = ratingDiv.querySelectorAll('.fa-star');
        const newRating = Array.from(stars).indexOf(star) + 1;

        // 1. EKRANDA DARHOL KO'RSATISH
        stars.forEach((s, i) => {
            if (i < newRating) {
                s.classList.add('fas', 'active');
                s.classList.remove('far');
            } else {
                s.classList.add('far');
                s.classList.remove('fas', 'active');
            }
        });

        // 2. MASSIVDAGI (DATA) QIYMATNI YANGILASH (ENG MUHIM JOYI!)
        // Bu kod menus ichidagi ratingni o'zgartiradi, shunda 7 soniyadan keyin o'chib ketmaydi
        menus.forEach(menuGroup => {
            const food = menuGroup.find(f => f.name === itemName);
            if (food) {
                food.rating = newRating; // Yangi bahoni massivga saqlaymiz
            }
        });
        
        console.log(`${itemName} uchun yangi baho ${newRating} saqlandi.`);
    }
});
            const ratingDiv = this.parentElement;
            const menuItem = ratingDiv.closest('.menu-item');
            const item = menuItem.dataset.item;
            const newRating = Array.from(ratingDiv.children).indexOf(this) + 1;
            updateRating(item, newRating);
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
    const nameEl = document.getElementById('name');
    const phoneEl = document.getElementById('phone');
    const addressEl = document.getElementById('address');
    const paymentEl = document.querySelector('input[name="payment"]:checked');

    // Filtrlash: Ismga faqat harf, telefonga faqat raqam (agar inputda pattern bo'lsa ham bu qo'shimcha himoya)
    const cleanName = nameEl.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
    const cleanPhone = phoneEl.value.replace(/[^0-9]/g, '');

    if (!cleanName || !cleanPhone || !addressEl.value || !paymentEl || cart.length === 0) {
        alert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring (Ismga faqat harf, telefonga faqat raqam)!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = total >= 50000 ? 0 : 10000;
    const payTypeText = paymentEl.value === 'cash' ? '💵 Naqd' : '💳 Karta';

const newOrder = {
    id: Date.now(),
    // Mana bu qism 24 soatlik formatni ta'minlaydi:
    date: new Date().toLocaleString('ru-RU', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',  
        hour12: false 
    }),
    customerName: cleanName,
    customerPhone: cleanPhone,
    customerAddress: addressEl.value,
    paymentType: payTypeText,
    items: cart.map(item => item.name).join(', '),
    total: total + deliveryFee
};

    try {
        let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    } catch (e) {
        console.error("Saqlashda xato:", e);
    }

    alert(`Buyurtma qabul qilindi!`);

    cart = [];
    if (typeof updateCartDisplay === "function") updateCartDisplay();
    renderOrderHistory(); 
    
    // Formani tozalash
    nameEl.value = '';
    phoneEl.value = '';
    addressEl.value = '';
}

function renderOrderHistory() {
    const historyTable = document.getElementById('history-body');
    if (!historyTable) return;

    const data = localStorage.getItem('orderHistory');
    let orderHistory = data ? JSON.parse(data) : [];
    
    historyTable.innerHTML = '';

    // Yangi buyurtmalar tepada ko'rinishi uchun reverse() qilingan
    [...orderHistory].reverse().forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.date}</td>
            <td>${order.customerName}</td>
            <td>${order.customerPhone}</td> 
            <td>${order.customerAddress}</td>
            <td>${order.items}</td>
            <td><span class="badge-payment">${order.paymentType}</span></td>
            <td><strong>${order.total.toLocaleString()} so'm</strong></td>
        `;
        historyTable.appendChild(row);
    });
}
const menus = [
    [
        { name: "Classic Burger", price: 45000, img: "image/classic Burger.jpg", desc: "Mol go'shti, pomidor, salat va maxsus sous", likes: 100, rating: 5 },
        { name: "Peperoni Pizza", price: 80000, img: "image/peperonni pizza.jpg", desc: "Pepperoni, pishloq va pomidor sousi", likes: 1000, rating: 5 },
        { name: "French Fries", price: 20000, img: "image/French Fries.jpg", desc: "Qovurilgan kartoshka va ketchup", likes: 100, rating: 5 },
    ],
    [
        { name: "Chicken Wrap", price: 35000, img: "image/chicken warp.jpg", desc: "Tovuq, lavash, salat va yogurt sousi", likes: 1000, rating: 5 },
        { name: "BBQ Ribs", price: 75000, img: "image/BBQ Ribs.jpg", desc: "Barbekyu qovurg'asi, maxsus sous bilan", likes: 100, rating: 5 },
        { name: "Veggie Burger", price: 42000, img: "image/Veggie Burger.jpg", desc:"Sabzavotli burger, no'xat kotleti bilan", likes: 100, rating: 5 },
    ],
    [
        { name: "Shrimp Tacos", price: 50000, img: "image/Shrimp Tacos.jpg", desc: "Krevetkali takos, salsa va salat bilan", likes: 1000,vrating: 5 },
        { name: "Double Cheeseburger", price: 60000, img: "image/Double Cheeseburger.jpg", desc: "Ikki qavatli burger, pishloq va maxsus sous bilan", likes: 100, rating: 5 },
        { name: "Fried Chicken Bucket", price: 70000, img: "image/Fried Chicken Bucket.jpg", desc: " Qovurilgan tovuq qisimlari,sous bilan", likes: 1000, rating: 5 },
    ],
    [
        { name: "Philly Cheesesteak", price: 58000, img: "image/Philly Cheesesteak.jpg", desc: " Mol go'shti, pishloq va piyozli sendvich", likes: 100, rating: 5 },
        { name: "Caesar Salad", price: 40000, img: "image/Caesar Salad.jpg", desc: "Sezar salati, tovuq va kruton bilan", likes: 1000, rating: 5 },
    ]
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
            stars += i <= item.rating ? `<i class="fas fa-star">
            </i>` : `<i class="far fa-star"></i>`;
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
                    Savatga qo'shish
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
}, 7000); // 2 soat
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
        currentLikes -= 1;
        likedItems[item] = false;
        likeSpan.textContent = currentLikes;
        const likeBtn = document.querySelector(`.menu-item[data-item="${item}"] .like-btn`);
        if (likeBtn) {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').classList.replace('fas', 'far');
        }
    }
        stars.forEach((s, i) => {
            if (i <= index) {
                s.classList.add('fas', 'active');
                s.classList.remove('far');
            } else {
                s.classList.add('far');
                s.classList.remove('fas', 'active');
            }
        });
   // script.js ning eng oxiri
window.clearHistory = function() {
    console.log("Tugma bosildi!"); 
    
    if (confirm("Diqqat! Barcha ma'lumotlar o'chib ketadi. Rozimisiz?")) {
        // 1. Brauzer xotirasini butunlay tozalash
        localStorage.clear(); 
        
        // 2. Vizual jadvalni tozalash
        const tableBody = document.getElementById('history-body');
        if (tableBody) {
            tableBody.innerHTML = '';
        }

        alert("Hamma narsa muvaffaqiyatli o'chirildi!");
        
        // 3. Sahifani majburiy yangilash
        window.location.href = window.location.href; 
    }
};
function submitOrder() {
    // 1. Formadagi ma'lumotlarni o'qib olamiz
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    // 2. Oddiy tekshiruv (Validatsiya)
    if (!name || !phone || !address) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    // 3. Savatchadagi ma'lumotlarni olish (Hozircha qo'lda yozamiz, savatchangiz bo'lsa o'shani ulaymiz)
    // Masalan: Savatcha hozircha bo'sh bo'lsa, "Tanlanmagan" deb ketadi
    const cartItems = "Yozgi set (misol)"; 
    const totalPrice = 125000; // Misol uchun narx

    // 4. Admin panel uchun yangi buyurtma ob'ektini yaratish
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        paymentMethod: payment === 'cash' ? "Naqd" : "Karta",
        items: cartItems,
        total: totalPrice,
        status: "Yangi"
    };

    // 5. LocalStorage (Baza) dan eski ma'lumotlarni olish
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    // 6. Yangi buyurtmani bazaga qo'shish
    orderHistory.push(newOrder);

    // 7. Bazani saqlash
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    // 8. Mijozga xabar berish va formani tozalash
    alert("Rahmat, " + name + "! Buyurtmangiz qabul qilindi.");
    
    // Formani tozalash
    document.getElementById('name').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('address').value = "";
}
function displayMenu() {
    const menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    const menuContainer = document.getElementById('menu-container'); // HTML dagi menyu id si
    menuContainer.innerHTML = "";

    menu.forEach(food => {
        menuContainer.innerHTML += `
            <div class="food-card">
                <img src="${food.img}">
                <h3>${food.name}</h3>
                <p>${Number(food.price).toLocaleString()} so'm</p>
                <button onclick="addToCart('${food.name}', ${food.price})">Savatga qo'shish</button>
            </div>
        `;
    });
}
window.onload = displayMenu;
function trackOrderStatus() {
    setInterval(() => {
        const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        // Mijoz o'z buyurtmasini ismi yoki telefoni orqali topadi
        // (Hozircha oxirgi buyurtmani tekshiramiz)
        const myOrder = orders[orders.length - 1]; 

        if (myOrder) {
            const popup = document.getElementById('order-status-popup');
            const statusText = document.getElementById('status-text');

            if (myOrder.status === "Tayyorlanmoqda") {
                popup.style.display = "block";
                popup.style.background = "#ffc107"; // Sariq rang
                statusText.innerText = "Oshpaz taomingizni tayyorlashni boshladi! 👨‍🍳";
            } 
            else if (myOrder.status === "Yetkazilmoqda") {
                popup.style.display = "block";
                popup.style.background = "#17a2b8"; // Moviy rang
                statusText.innerText = "Kuryer buyurtmangizni olib yo'lga chiqdi! 🛵";
            }
        }
    }, 5000); // Har 5 soniyada tekshiradi
}

// Sayt yuklanganda kuzatuvni boshlash
window.onload = () => {
    displayMenu(); // Menyuni chiqarish
    trackOrderStatus(); // Statusni kuzatish
};
function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !phone || !address) {
        alert("Iltimos, hamma joyni to'ldiring!");
        return;
    }

    // SAVATCHADAGI TAOMLARNI YIG'ISH (Oddiy misol)
    const items = "2x Lavash, 1x Coca-cola"; // Bu yerga savatchangizdagi o'zgaruvchini qo'ying
    const total = 85000; // Bu yerga umumiy narx o'zgaruvchisini qo'ying

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        customerName: name,      // ADMIN SHU NOM BILAN O'QIYDI
        customerPhone: phone,     // ADMIN SHU NOM BILAN O'QIYDI
        customerAddress: address, // ADMIN SHU NOM BILAN O'QIYDI
        paymentMethod: payment === 'cash' ? "Naqd" : "Karta",
        items: items,             // ADMIN SHU NOM BILAN O'QIYDI
        total: total,             // ADMIN SHU NOM BILAN O'QIYDI
        status: "Yangi"
    };

    orderHistory.push(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    alert("Buyurtmangiz qabul qilindi!");
    // Formani tozalash
    document.getElementById('name').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('address').value = "";
}
}