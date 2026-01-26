let admins = JSON.parse(localStorage.getItem('adminAccounts')) || [{user: "admin", pass: "admin123"}];
let tempImage = "";

// Enter tugmasi bilan kirish
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('login-overlay').style.display !== 'none') checkAdminLogin();
});

function checkAdminLogin() {
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    const auth = admins.find(a => a.user === u && a.pass === p);
    if (auth) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-content').style.display = 'flex';
        loadDashboard();
    } else { alert("Xato!"); }
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if (id === 'dashboard') loadDashboard();
    if (id === 'orders') loadOrders();
    if (id === 'menu') loadMenu();
    if (id === 'admins') loadAdmins();
}

// DASHBOARD
function loadDashboard() {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    let rev = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    document.getElementById('total-revenue').innerText = rev.toLocaleString() + " so'm";
    document.getElementById('total-orders').innerText = orders.length;
    document.getElementById('admins-count-dash').innerText = admins.length;
}

// BUYURTMALAR
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const list = document.getElementById('orders-list');
    list.innerHTML = orders.reverse().map((o, i) => `
        <tr>
            <td><b>${o.customerName}</b><br>${o.customerPhone}</td>
            <td>${o.customerAddress}</td>
            <td>${o.items}<br><b>${Number(o.total).toLocaleString()} so'm</b></td>
            <td><span class="status-badge">${o.status || 'Yangi'}</span></td>
            <td>
                <button onclick="updateStatus(${orders.length-1-i}, 'Tayyorlanmoqda')" style="color:blue">OK</button>
                <button onclick="deleteOrder(${orders.length-1-i})" style="color:red">X</button>
            </td>
        </tr>
    `).join('');
}

function updateStatus(idx, st) {
    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders[idx].status = st;
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    loadOrders();
}

function deleteOrder(idx) {
    if(confirm("O'chirilsinmi?")) {
        let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orders.splice(idx, 1);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        loadOrders();
    }
}

// MENYU
function handleImageUpload(input) {
    const reader = new FileReader();
    reader.onload = (e) => tempImage = e.target.result;
    reader.readAsDataURL(input.files[0]);
}

function saveFood() {
    const name = document.getElementById('food-name').value;
    const price = document.getElementById('food-price').value;
    const desc = document.getElementById('food-desc').value;
    if(!name || !price || !tempImage) return alert("To'ldiring!");

    let menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    menu.push({name, price, desc, img: tempImage});
    localStorage.setItem('menuItems', JSON.stringify(menu));
    tempImage = ""; loadMenu();
}

function loadMenu() {
    const menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    const list = document.getElementById('menu-list');
    list.innerHTML = menu.map((f, i) => `
        <tr>
            <td><img src="${f.img}" width="45" height="45" style="border-radius:5px; object-fit:cover;"></td>
            <td><b>${f.name}</b></td>
            <td>${Number(f.price).toLocaleString()} so'm</td>
            <td><button onclick="deleteFood(${i})" style="color:red; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

function deleteFood(i) {
    let menu = JSON.parse(localStorage.getItem('menuItems')) || [];
    menu.splice(i, 1);
    localStorage.setItem('menuItems', JSON.stringify(menu));
    loadMenu();
}

// ADMINLAR
function addAdmin() {
    const user = document.getElementById('new-user').value;
    const pass = document.getElementById('new-pass').value;
    if(user && pass) {
        admins.push({user, pass});
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        loadAdmins();
    }
}

function loadAdmins() {
    const list = document.getElementById('admins-list');
    list.innerHTML = admins.map((a, i) => `
        <tr><td>${a.user}</td><td><button onclick="deleteAdminAc(${i})">O'chirish</button></td></tr>
    `).join('');
}

function deleteAdminAc(i) {
    if(admins.length > 1) {
        admins.splice(i, 1);
        localStorage.setItem('adminAccounts', JSON.stringify(admins));
        loadAdmins();
    }
}