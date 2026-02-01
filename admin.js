// --- GLOBAL MA'LUMOTLAR ---
let admins = JSON.parse(localStorage.getItem('adminAccounts')) || [{user: "admin", pass: "admin123"}];
let tempImage = "";

// --- 1. ENTER NAVIGATSIYASI ---
function handleEnter(event, nextId) {
    if (event.key === "Enter") {
        event.preventDefault();
        const nextElement = document.getElementById(nextId);
        if (nextElement) {
            if (nextElement.tagName === "BUTTON") {
                nextElement.click();
            } else {
                nextElement.focus();
            }
        }
    }
}

// --- 2. LOGIN TIZIMI ---
function checkAdminLogin() {
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    const auth = admins.find(a => a.user === u && a.pass === p);
    
    if (auth) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-content').style.display = 'flex';
        loadDashboard();
    } else { 
        alert("Login yoki parol xato!"); 
    }
}

function togglePass(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// --- 3. TUNGI REJIM ---
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('mode-text').innerText = isDark ? "Kunduzgi Rejim" : "Tungi Rejim";
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// --- 4. DASHBOARD (Xatosiz, faqat raqamlar) ---
function loadDashboard() {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    
    let rev = orders.reduce((s, o) => s + Number(o.total || 0), 0);

    // Faqat kerakli ID-larga qiymat beramiz
    const revElem = document.getElementById('total-revenue');
    const ordElem = document.getElementById('total-orders');
    const admElem = document.getElementById('admins-count-dash');

    if (revElem) revElem.innerText = rev.toLocaleString() + " so'm";
    if (ordElem) ordElem.innerText = orders.length;
    if (admElem) admElem.innerText = admins.length;
}

// --- 5. BUYURTMALAR (Oshxona, Tayyor, Bekor) ---
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const list = document.getElementById('orders-list');
    if(!list) return;

    list.innerHTML = orders.slice().reverse().map((o, i) => {
        const realIdx = orders.length - 1 - i;
        
        let statusColor = o.status === 'Tayyor' ? '#2ecc71' : (o.status === 'Oshxonada' ? '#f39c12' : '#e74c3c');

        return `
        <tr>
            <td><b>${o.customerName}</b><br><small>${o.customerPhone}</small></td>
            <td>${o.customerAddress || 'Manzil yo\'q'}</td>
            <td>${o.items}<br><b>${Number(o.total).toLocaleString()} so'm</b></td>
            <td><span class="status-badge" style="color: ${statusColor}">${o.status || 'Yangi'}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn-act btn-oshxona" onclick="updateStatus(${realIdx}, 'Oshxonada')">Oshxonada</button>
                    <button class="btn-act btn-tayyor" onclick="updateStatus(${realIdx}, 'Tayyor')">Tayyor</button>
                    <button class="btn-act btn-del" onclick="deleteOrder(${realIdx})">Bekor qilish</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function updateStatus(idx, st) {
    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders[idx].status = st;
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    loadOrders();
}

function deleteOrder(idx) {
    if(confirm("Buyurtmani bekor qilmoqchimisiz?")) {
        let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orders.splice(idx, 1);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        loadOrders();
        loadDashboard();
    }
}

// --- 6. MENYU BOSHQARUVI ---
function handleImageUpload(input) {
    const reader = new FileReader();
    reader.onload = (e) => tempImage = e.target.result;
    if(input.files[0]) reader.readAsDataURL(input.files[0]);
}

function saveFood() {
    const n = document.getElementById('food-name');
    const p = document.getElementById('food-price');
    const d = document.getElementById('food-desc');
    
    if(!n.value || !p.value || !tempImage) return alert("Barcha ma'lumotlarni kiriting!");

    let menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    menu.push({name: n.value, price: p.value, desc: d.value, img: tempImage});
    localStorage.setItem('menuItems', JSON.stringify(menu));

    n.value = ""; p.value = ""; d.value = ""; tempImage = "";
    alert("Taom qo'shildi!");
    loadMenu();
}

function loadMenu() {
    const menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    const list = document.getElementById('menu-list');
    if(!list) return;

    list.innerHTML = menu.map((f, i) => `
        <tr>
            <td><img src="${f.img}" width="45" height="45" style="border-radius:5px; object-fit:cover;"></td>
            <td><b>${f.name}</b></td>
            <td>${Number(f.price).toLocaleString()} so'm</td>
            <td><button class="btn-act btn-del" onclick="deleteFood(${i})">O'chirish</button></td>
        </tr>
    `).join('');
}

function deleteFood(i) {
    let menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    menu.splice(i, 1);
    localStorage.setItem('menuItems', JSON.stringify(menu));
    loadMenu();
}

// --- 7. ADMIN BOSHQARUVI (Enter bilan) ---
function addAdmin() {
    const u = document.getElementById('new-user');
    const p = document.getElementById('new-pass');
    
    if(u.value && p.value) {
        admins.push({user: u.value, pass: p.value});
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        
        u.value = ""; p.value = "";
        alert("Admin qo'shildi!");
        u.focus(); // Fokusni birinchi inputga qaytarish
        
        loadAdmins();
        loadDashboard();
    } else {
        alert("Ma'lumotlarni to'liq kiriting!");
    }
}

function loadAdmins() {
    const list = document.getElementById('admins-list');
    if(!list) return;

    list.innerHTML = admins.map((a, i) => `
        <tr>
            <td>${a.user}</td>
            <td><button class="btn-act btn-del" onclick="deleteAdminAc(${i})">O'chirish</button></td>
        </tr>
    `).join('');
}

function deleteAdminAc(i) {
    if(admins.length > 1) {
        admins.splice(i, 1);
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        loadAdmins();
        loadDashboard();
    } else { alert("Oxirgi adminni o'chirib bo'lmaydi!"); }
}

// --- 8. TABLARNI ALMASHTIRISH ---
function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const targetTab = document.getElementById(id);
    if(targetTab) targetTab.classList.add('active');
    
    if (id === 'dashboard') loadDashboard();
    if (id === 'orders') loadOrders();
    if (id === 'menu') loadMenu();
    if (id === 'admins') loadAdmins();
}

// Sahifa yuklanganda mavzuni tekshirish
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}