// Elementos principales
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Botones de autenticación
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const loginSubmitBtn = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');

// Modal de demo
const demoModal = document.getElementById('demoModal');
const demoBtn = document.getElementById('demoBtn');
const confirmDemoBtn = document.getElementById('confirmDemoBtn');
const cancelDemoBtn = document.getElementById('cancelDemoBtn');

// Funciones para alternar vistas
function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    document.body.classList.remove('gradient-bg');
    document.body.classList.remove('justify-center');
    document.body.classList.remove('items-center');
    document.body.classList.add('bg-gray-100');
}

function showAuth() {
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    document.body.classList.add('gradient-bg');
    document.body.classList.add('justify-center');
    document.body.classList.add('items-center');
    document.body.classList.remove('bg-gray-100');
}

// Event Listeners para formularios de autenticación
showRegisterBtn.addEventListener('click', function() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', function() {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Simular inicio de sesión (al hacer clic en "Ingresar")
loginSubmitBtn.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue
    showDashboard();
});

// Cerrar sesión
logoutBtn.addEventListener('click', showAuth);

// Funcionalidad del modal de demo
demoBtn.addEventListener('click', function() {
    demoModal.classList.remove('hidden');
});

cancelDemoBtn.addEventListener('click', function() {
    demoModal.classList.add('hidden');
});

confirmDemoBtn.addEventListener('click', function() {
    alert('Redirigiendo al panel de demostración...');
    demoModal.classList.add('hidden');
    showDashboard();
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target === demoModal) {
        demoModal.classList.add('hidden');
    }
});