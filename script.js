// Elementos principales del DOM
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginFormDiv = document.getElementById('loginForm');
const registerFormDiv = document.getElementById('registerForm');

// Botones y formularios de autenticación
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const loginFormElement = document.getElementById('login-form');
const registerFormElement = registerFormDiv.querySelector('form');
const logoutBtn = document.getElementById('logoutBtn');

// Modal de demo
const demoModal = document.getElementById('demoModal');
const demoBtn = document.getElementById('demoBtn');
const confirmDemoBtn = document.getElementById('confirmDemoBtn');
const cancelDemoBtn = document.getElementById('cancelDemoBtn');

// Elementos del menú móvil y dashboard
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebar = document.getElementById('sidebar');
const editProfileBtn = document.getElementById('editProfileBtn');

// --- Elementos del DOM para las secciones principales (ya existentes o actualizados) ---
const profileSection = document.getElementById('profileSection'); // Asumiendo que ahora tienes un ID 'profileSection'
const academicHistorySection = document.getElementById('academicHistorySection');

// --- Nuevos elementos del DOM para Pensum de Estudio ---
const pensumSection = document.getElementById('pensumSection');
const showPensumBtn = document.getElementById('showPensumBtn');
const pensumFilterPeriod = document.getElementById('pensumFilterPeriod');
const pensumFilterStatus = document.getElementById('pensumFilterStatus');
const pensumTableBody = document.getElementById('pensumTableBody');
const noPensumMessage = document.getElementById('noPensumMessage');


// --- Elementos del DOM para Historial Académico (ya existentes) ---
const showAcademicHistoryBtn = document.getElementById('showAcademicHistoryBtn');
const showProfileBtn = document.getElementById('showProfileBtn');

const addCourseBtn = document.getElementById('addCourseBtn');
const courseFormContainer = document.getElementById('courseFormContainer');
const courseForm = document.getElementById('courseForm');
const courseFormTitle = document.getElementById('courseFormTitle');
const cancelCourseBtn = document.getElementById('cancelCourseBtn');
const saveCourseBtn = document.getElementById('saveCourseBtn');

const coursesTableBody = document.getElementById('coursesTableBody');
const noCoursesMessage = document.getElementById('noCoursesMessage');

// --- Elementos del DOM para la eliminación de cuenta ---
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const confirmDeleteAccountBtn = document.getElementById('confirmDeleteAccountBtn');
const cancelDeleteAccountBtn = document = document.getElementById('cancelDeleteAccountBtn');


// Inputs del formulario de materia
const courseNameInput = document.getElementById('courseName');
const courseCodeInput = document.getElementById('courseCode');
const courseCreditsInput = document.getElementById('courseCredits');
const courseGradeInput = document.getElementById('courseGrade');
const coursePeriodInput = document.getElementById('coursePeriod');
const courseIdInput = document.getElementById('courseId'); // Para almacenar el ID al editar

// --- Nuevos elementos del DOM para Reportes ---
const reportsSection = document.getElementById('reportsSection');
const showReportsBtn = document.getElementById('showReportsBtn');
const averageGradeElement = document.getElementById('averageGrade');
const progressPercentageElement = document.getElementById('progressPercentage');
const periodSummaryTableBody = document.getElementById('periodSummaryTableBody');
const noPeriodSummaryMessage = document.getElementById('noPeriodSummaryMessage');


// --- Datos que ahora vendrán del backend ---
let academicHistoryData = []; // Ahora se cargará desde PHP
let pensumData = [];         // Ahora se cargará desde PHP
let totalCareerCredits = 0;  // Se calculará una vez se cargue el pensum

// --- Variable para almacenar el ID del usuario logueado ---
let currentUserId = null;


// --- Funciones de Utilidad para alternar vistas (Actualizadas para Pensum y Reportes) ---

/**
 * Muestra el dashboard y oculta el contenedor de autenticación.
 * Ajusta las clases del body para el estilo de fondo.
 */
function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    // Ajusta las clases del body para el fondo del dashboard
    document.body.classList.remove('gradient-bg', 'justify-center', 'items-center');
    document.body.classList.add('bg-gray-100');

    // Opcional: Cierra el sidebar si está abierto en móvil al ir al dashboard
    if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
    }

    // Asegura que la sección de perfil se muestre por defecto al entrar al dashboard
    profileSection.style.display = 'block';
    academicHistorySection.style.display = 'none';
    pensumSection.style.display = 'none';
    reportsSection.style.display = 'none'; // <-- AÑADIDO: Asegura que reportes esté oculto

    // Activar estilo de pestaña de Perfil
    updateSidebarActiveLink(showProfileBtn);

    // Cargar datos iniciales del pensum y el historial al entrar al dashboard
    fetchPensum(); // Cargar pensum una vez al inicio
    fetchAcademicHistory(); // Cargar historial del usuario logueado
}

/**
 * Muestra el contenedor de autenticación y oculta el dashboard.
 * Ajusta las clases del body para el estilo de fondo de autenticación.
 */
function showAuth() {
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    // Ajusta las clases del body para el fondo de autenticación
    document.body.classList.add('gradient-bg', 'justify-center', 'items-center');
    document.body.classList.remove('bg-gray-100');
    currentUserId = null; // Limpiar el ID del usuario al cerrar sesión
}

/**
 * Actualiza el estilo del enlace activo en la barra lateral.
 * @param {HTMLElement} activeLinkElement - El elemento 'a' que debe estar activo.
 */
function updateSidebarActiveLink(activeLinkElement) {
    document.querySelectorAll('#sidebar nav ul li a').forEach(link => {
        link.classList.remove('active-tab');
        link.querySelector('i').classList.remove('text-blue-500'); // Quita color activo de icono
        link.querySelector('i').classList.add('text-gray-600'); // Restaura color inactivo
    });
    activeLinkElement.classList.add('active-tab');
    activeLinkElement.querySelector('i').classList.add('text-blue-500'); // Añade color activo a icono
    activeLinkElement.querySelector('i').classList.remove('text-gray-600'); // Quita color inactivo
}


// --- Event Listeners para formularios de autenticación (Actualizadas para fetch) ---

// Alternar entre Login y Registro
showRegisterBtn.addEventListener('click', function() {
    loginFormDiv.classList.add('hidden');
    registerFormDiv.classList.remove('hidden');
    registerFormElement.reset(); // Limpia el formulario de registro al mostrarlo
});

showLoginBtn.addEventListener('click', function() {
    registerFormDiv.classList.add('hidden');
    loginFormDiv.classList.remove('hidden');
    loginFormElement.reset(); // Limpia el formulario de login al mostrarlo
});

// Simular inicio de sesión (ahora con fetch a PHP)
loginFormElement.addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:8888/sistema_academico/auth.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'login',
                correo: correo,
                password: password
            })
        });
        const data = await response.json();

        if (data.success) {
            alert(data.message);
            currentUserId = data.user_id; // Guardar el ID del usuario logueado
            showDashboard();
        } else {
            alert('Error de Login: ' + data.message);
        }
    } catch (error) {
        console.error('Error al intentar login:', error);
        alert('Error de conexión con el servidor.');
    }
});

// Simular registro de usuario (ahora con fetch a PHP)
registerFormElement.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('registerName').value;
    const apellido = document.getElementById('registerLastName').value;
    const correo = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const cedula = document.getElementById('registerCedula').value; // Asumiendo que tienes un input para cédula
    const termsAccepted = document.getElementById('terms').checked;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, verifica.');
        return;
    }
    if (!termsAccepted) {
        alert('Debes aceptar los Términos y Condiciones para registrarte.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8888/sistema_academico/auth.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'register',
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                password: password,
                cedula: cedula
            })
        });
        const data = await response.json();

        if (data.success) {
            alert(data.message);
            showLoginBtn.click(); // Vuelve a la vista de inicio de sesión
        } else {
            alert('Error de Registro: ' + data.message);
        }
    } catch (error) {
        console.error('Error al intentar registrar:', error);
        alert('Error de conexión con el servidor.');
    }
});

// Cerrar sesión (ahora con fetch a PHP para destruir la sesión)
logoutBtn.addEventListener('click', async function() {
    console.log('Cerrando sesión...');
    try {
        const response = await fetch('http://localhost:8888/sistema_academico/auth.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'logout'
            })
        });
        const data = await response.json();
        if (data.success) {
            showAuth();
            alert('Has cerrado sesión correctamente.');
        } else {
            alert('Error al cerrar sesión: ' + data.message);
        }
    } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
        alert('Error de conexión con el servidor.');
    }
});

// --- Funcionalidad del modal de demo (Sin cambios) ---

// Abrir modal de demo
demoBtn.addEventListener('click', function() {
    demoModal.classList.remove('hidden');
});

// Cancelar demo y cerrar modal
cancelDemoBtn.addEventListener('click', function() {
    demoModal.classList.add('hidden');
});

// Confirmar demo e ingresar al dashboard
confirmDemoBtn.addEventListener('click', function() {
    demoModal.classList.add('hidden');
    // En modo demo, no hay user_id real, puedes simular uno o manejarlo de otra forma
    currentUserId = 'demo_user'; // O un valor fijo para demo
    showDashboard();
    alert('Has ingresado en modo demo.');
});

// Cerrar modal al hacer clic fuera de su contenido
window.addEventListener('click', function(event) {
    if (event.target === demoModal) {
        demoModal.classList.add('hidden');
    }
});

// --- Funcionalidad para el menú de hamburguesa en móviles (Sin cambios) ---
menuToggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('block');
});

// --- Funcionalidad del Dashboard (Sin cambios, solo se añadió el botón de Pensum) ---
editProfileBtn.addEventListener('click', function() {
    alert('Funcionalidad de edición de perfil en desarrollo. Aquí se abriría un formulario o modal para editar la información del estudiante.');
});


// --- Funciones del Historial Académico (Actualizadas para fetch) ---

/**
 * Carga el historial académico del usuario desde el backend.
 */
async function fetchAcademicHistory() {
    if (!currentUserId) {
        academicHistoryData = []; // Limpiar si no hay usuario logueado
        renderAcademicHistory();
        return;
    }
    try {
        const response = await fetch(`http://localhost:8888/sistema_academico/api.php?action=getAcademicHistory&user_id=${currentUserId}`); // URL AQUI CAMBIADA
        const data = await response.json();
        if (data.success) {
            academicHistoryData = data.history;
            renderAcademicHistory();
        } else {
            console.error('Error al cargar historial académico:', data.message);
            academicHistoryData = []; // Limpiar en caso de error
            renderAcademicHistory();
            alert('No se pudo cargar el historial académico: ' + data.message);
        }
    } catch (error) {
        console.error('Error de conexión al cargar historial académico:', error);
        academicHistoryData = []; // Limpiar en caso de error
        renderAcademicHistory();
        alert('Error de conexión con el servidor al cargar historial académico.');
    }
}

/**
 * Renderiza la tabla de materias con los datos actuales.
 */
function renderAcademicHistory() {
    coursesTableBody.innerHTML = ''; // Limpiar tabla
    if (academicHistoryData.length === 0) {
        noCoursesMessage.classList.remove('hidden');
    } else {
        noCoursesMessage.classList.add('hidden');
        academicHistoryData.forEach(course => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50', 'transition-all');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${course.nombre_materia}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.codigo_materia}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.creditos}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.nota}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.periodo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button data-id="${course.id}" class="edit-course-btn text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button data-id="${course.id}" class="delete-course-btn text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });

        // Añadir event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-course-btn').forEach(button => {
            button.addEventListener('click', editCourse);
        });
        document.querySelectorAll('.delete-course-btn').forEach(button => {
            button.addEventListener('click', deleteCourse);
        });
    }
}

/**
 * Muestra u oculta el formulario de agregar/modificar materia.
 * @param {boolean} show - true para mostrar, false para ocultar.
 * @param {object|null} courseData - Datos de la materia a editar, o null si es para agregar.
 */
function toggleCourseForm(show, courseData = null) {
    if (show) {
        courseFormContainer.classList.remove('hidden');
        if (courseData) {
            courseFormTitle.textContent = 'Modificar Materia';
            courseNameInput.value = courseData.nombre_materia;
            courseCodeInput.value = courseData.codigo_materia;
            courseCreditsInput.value = courseData.creditos;
            courseGradeInput.value = courseData.nota;
            coursePeriodInput.value = courseData.periodo;
            courseIdInput.value = courseData.id; // Guardar el ID para la edición
            saveCourseBtn.textContent = 'Actualizar Materia';
        } else {
            courseFormTitle.textContent = 'Agregar Nueva Materia';
            courseForm.reset(); // Limpiar formulario para nueva entrada
            courseIdInput.value = ''; // Asegurarse de que no haya ID al agregar
            saveCourseBtn.textContent = 'Guardar Materia';
        }
    } else {
        courseFormContainer.classList.add('hidden');
        courseForm.reset(); // Siempre limpiar al ocultar
    }
}

/**
 * Maneja el envío del formulario de materia (agregar o actualizar) con fetch a PHP.
 * @param {Event} event
 */
async function handleCourseFormSubmit(event) {
    event.preventDefault();

    if (!currentUserId) {
        alert('Debe iniciar sesión para agregar o modificar materias.');
        return;
    }

    const id = courseIdInput.value;
    const nombre_materia = courseNameInput.value.trim();
    const codigo_materia = courseCodeInput.value.trim();
    const creditos = parseInt(courseCreditsInput.value);
    const nota = parseInt(courseGradeInput.value);
    const periodo = coursePeriodInput.value.trim();

    if (!nombre_materia || !codigo_materia || isNaN(creditos) || isNaN(nota) || !periodo) {
        alert('Por favor, completa todos los campos de la materia.');
        return;
    }
    if (nota < 0 || nota > 20) {
        alert('La calificación debe estar entre 0 y 20.');
        return;
    }

    let action = id ? 'updateCourse' : 'addCourse';
    let formData = {
        action: action,
        user_id: currentUserId,
        nombre_materia: nombre_materia,
        codigo_materia: codigo_materia,
        creditos: creditos,
        nota: nota,
        periodo: periodo
    };

    if (id) {
        formData.id = id; // Añadir ID si es una actualización
    }

    try {
        const response = await fetch('http://localhost:8888/sistema_academico/api.php', { // URL AQUI CAMBIADA
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        const data = await response.json();

        if (data.success) {
            alert(data.message);
            toggleCourseForm(false); // Ocultar formulario
            fetchAcademicHistory(); // Recargar la tabla desde el backend
            fetchPensum(); // Refrescar el pensum por si el estado de alguna materia cambió
        } else {
            alert('Error al guardar materia: ' + data.message);
        }
    } catch (error) {
        console.error('Error de conexión al guardar materia:', error);
        alert('Error de conexión con el servidor al guardar materia.');
    }
}

/**
 * Rellena el formulario con los datos de una materia para edición.
 * @param {Event} event
 */
function editCourse(event) {
    const courseId = event.currentTarget.dataset.id;
    const courseToEdit = academicHistoryData.find(course => course.id == courseId); // Usar == para comparar string con number
    if (courseToEdit) {
        toggleCourseForm(true, courseToEdit);
    }
}

/**
 * Elimina una materia del historial con fetch a PHP.
 * @param {Event} event
 */
async function deleteCourse(event) {
    const courseId = event.currentTarget.dataset.id;
    if (!currentUserId) {
        alert('Debe iniciar sesión para eliminar materias.');
        return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
        try {
            const response = await fetch('http://localhost:8888/sistema_academico/api.php', { // URL AQUI CAMBIADA
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'deleteCourse',
                    id: courseId,
                    user_id: currentUserId // Asegurarse de que el usuario logueado es el dueño de la materia
                })
            });
            const data = await response.json();

            if (data.success) {
                alert(data.message);
                fetchAcademicHistory(); // Recargar la tabla desde el backend
                fetchPensum(); // Refrescar el pensum por si el estado de alguna materia cambió
            } else {
                alert('Error al eliminar materia: ' + data.message);
            }
        } catch (error) {
            console.error('Error de conexión al eliminar materia:', error);
            alert('Error de conexión con el servidor al eliminar materia.');
        }
    }
}

// --- Event Listeners para Historial Académico (Actualizados para Pensum y Reportes) ---

// Navegación en la sidebar para "Historial Académico"
showAcademicHistoryBtn.addEventListener('click', function(e) {
    e.preventDefault();
    academicHistorySection.style.display = 'block'; // Mostrar sección de historial
    profileSection.style.display = 'none'; // Ocultar sección de perfil
    pensumSection.style.display = 'none'; // Asegura que el pensum esté oculto
    reportsSection.style.display = 'none'; // <-- AÑADIDO: Asegura que reportes esté oculto

    updateSidebarActiveLink(this); // Activar estilo de pestaña seleccionada
    fetchAcademicHistory(); // Cargar y renderizar la tabla desde el backend
});

// Navegación en la sidebar para "Perfil"
showProfileBtn.addEventListener('click', function(e) {
    e.preventDefault();
    academicHistorySection.style.display = 'none'; // Ocultar historial
    pensumSection.style.display = 'none'; // Ocultar pensum
    reportsSection.style.display = 'none'; // <-- AÑADIDO: Asegura que reportes esté oculto
    profileSection.style.display = 'block'; // Mostrar perfil

    updateSidebarActiveLink(this); // Activar estilo de pestaña seleccionada
});

// Botón "Agregar Materia"
addCourseBtn.addEventListener('click', () => toggleCourseForm(true));

// Botón "Cancelar" en el formulario de materia
cancelCourseBtn.addEventListener('click', () => toggleCourseForm(false));

// Envío del formulario de materia
courseForm.addEventListener('submit', handleCourseFormSubmit);

// --- Funcionalidad del Pensum de Estudio (Actualizada para fetch) ---

/**
 * Carga el pensum de estudio desde el backend.
 */
async function fetchPensum() {
    try {
        const response = await fetch(`http://localhost:8888/sistema_academico/api.php?action=getPensum`); // URL AQUI CAMBIADA
        const data = await response.json();
        if (data.success) {
            pensumData = data.pensum;
            totalCareerCredits = pensumData.reduce((sum, course) => sum + course.creditos, 0); // Recalcular total de créditos
            populatePensumPeriods(); // Rellenar filtros
            renderPensum(); // Renderizar el pensum
        } else {
            console.error('Error al cargar pensum:', data.message);
            pensumData = [];
            totalCareerCredits = 0;
            renderPensum();
            alert('No se pudo cargar el pensum de estudio: ' + data.message);
        }
    } catch (error) {
        console.error('Error de conexión al cargar pensum:', error);
        pensumData = [];
        totalCareerCredits = 0;
        renderPensum();
        alert('Error de conexión con el servidor al cargar pensum.');
    }
}


/**
 * Renderiza la tabla del pensum de estudio, aplicando filtros.
 */
function renderPensum() {
    pensumTableBody.innerHTML = '';
    noPensumMessage.classList.add('hidden');

    const selectedPeriod = pensumFilterPeriod.value;
    const selectedStatus = pensumFilterStatus.value;

    const filteredPensum = pensumData.filter(pensumCourse => {
        // Determinar si la materia del pensum está aprobada en el historial académico
        // Usamos academicHistoryData que ya debe estar cargado
        const isApproved = academicHistoryData.some(historyCourse => historyCourse.codigo_materia === pensumCourse.codigo_materia);
        
        let matchesPeriod = true;
        if (selectedPeriod !== 'all') {
            matchesPeriod = pensumCourse.periodo_ideal === selectedPeriod; // Usar 'periodo_ideal' del backend
        }

        let matchesStatus = true;
        if (selectedStatus === 'approved') {
            matchesStatus = isApproved;
        } else if (selectedStatus === 'pending') {
            matchesStatus = !isApproved;
        }
        
        return matchesPeriod && matchesStatus;
    });

    if (filteredPensum.length === 0) {
        noPensumMessage.classList.remove('hidden');
    } else {
        filteredPensum.forEach(pensumCourse => {
            const approvedCourse = academicHistoryData.find(historyCourse => historyCourse.codigo_materia === pensumCourse.codigo_materia);
            const statusText = approvedCourse ? `<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Aprobada</span>` : `<span class="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">Pendiente</span>`;
            const gradeText = approvedCourse ? approvedCourse.nota : '-'; // Usar 'nota' del backend

            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50', 'transition-all');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pensumCourse.nombre_materia}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pensumCourse.codigo_materia}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pensumCourse.creditos}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pensumCourse.periodo_ideal}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${statusText}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gradeText}</td>
            `;
            pensumTableBody.appendChild(row);
        });
    }
}

/**
 * Rellena el select de períodos con opciones únicas del pensum.
 */
function populatePensumPeriods() {
    const periods = [...new Set(pensumData.map(course => course.periodo_ideal))].sort(); // Obtener períodos únicos y ordenar
    pensumFilterPeriod.innerHTML = '<option value="all">Todos los Períodos</option>'; // Restablecer opciones
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = period;
        pensumFilterPeriod.appendChild(option);
    });
}


// --- Event Listeners para Pensum de Estudio  ---

showPensumBtn.addEventListener('click', function(e) {
    e.preventDefault();
    profileSection.style.display = 'none'; // Ocultar perfil
    academicHistorySection.style.display = 'none'; // Ocultar historial
    reportsSection.style.display = 'none'; // <-- AÑADIDO: Asegura que reportes esté oculto
    pensumSection.style.display = 'block'; // Mostrar pensum

    updateSidebarActiveLink(this); // Activar estilo de pestaña
    fetchPensum(); // Cargar y renderizar el pensum con filtros iniciales
});

pensumFilterPeriod.addEventListener('change', renderPensum);
pensumFilterStatus.addEventListener('change', renderPensum);

// --- Funcionalidad de Reportes (Actualizada para usar datos de PHP) ---

/**
 * Calcula y muestra el promedio de notas y el porcentaje de avance.
 */
function generateReports() {
    // 1. Calcular Promedio General
    let totalCreditsEarned = 0;
    let sumOfGradesTimesCredits = 0;

    academicHistoryData.forEach(course => {
        totalCreditsEarned += course.creditos; // Usar 'creditos'
        sumOfGradesTimesCredits += (course.nota * course.creditos); // Usar 'nota' y 'creditos'
    });

    const averageGrade = totalCreditsEarned > 0 ? (sumOfGradesTimesCredits / totalCreditsEarned).toFixed(2) : 'N/A';
    averageGradeElement.textContent = averageGrade;

    // 2. Calcular Porcentaje de Avance
    const uniqueApprovedCoursesCodes = new Set(academicHistoryData.map(course => course.codigo_materia)); // Usar 'codigo_materia'
    const approvedCreditsFromPensum = pensumData.filter(pensumCourse => uniqueApprovedCoursesCodes.has(pensumCourse.codigo_materia)) // Usar 'codigo_materia'
                                                .reduce((sum, pensumCourse) => sum + pensumCourse.creditos, 0); // Usar 'creditos'

    const progressPercentage = totalCareerCredits > 0 ? ((approvedCreditsFromPensum / totalCareerCredits) * 100).toFixed(2) : '0.00';
    progressPercentageElement.textContent = `${progressPercentage}%`;

    // 3. Resumen por Período
    renderPeriodSummary();
}

/**
 * Renderiza la tabla de resumen por período.
 */
function renderPeriodSummary() {
    periodSummaryTableBody.innerHTML = ''; // Limpiar tabla
    noPeriodSummaryMessage.classList.add('hidden');

    const periods = {}; // Objeto para agrupar materias por período

    academicHistoryData.forEach(course => {
        if (!periods[course.periodo]) { // Usar 'periodo'
            periods[course.periodo] = { // Usar 'periodo'
                approvedCourses: 0,
                credits: 0,
                sumGradesTimesCredits: 0
            };
        }
        periods[course.periodo].approvedCourses++; // Usar 'periodo'
        periods[course.periodo].credits += course.creditos; // Usar 'creditos'
        periods[course.periodo].sumGradesTimesCredits += (course.nota * course.creditos); // Usar 'nota' y 'creditos'
    });

    const sortedPeriods = Object.keys(periods).sort((a, b) => a.localeCompare(b)); // Ordenar períodos alfabéticamente/cronológicamente

    if (sortedPeriods.length === 0) {
        noPeriodSummaryMessage.classList.remove('hidden');
    } else {
        sortedPeriods.forEach(period => {
            const periodData = periods[period];
            const periodAverage = periodData.credits > 0 ? (periodData.sumGradesTimesCredits / periodData.credits).toFixed(2) : 'N/A';

            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50', 'transition-all');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${period}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${periodData.approvedCourses}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${periodData.credits}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${periodAverage}</td>
            `;
            periodSummaryTableBody.appendChild(row);
        });
    }
}

// --- Event Listener para Reportes (NUEVO) ---
showReportsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    profileSection.style.display = 'none';
    academicHistorySection.style.display = 'none';
    pensumSection.style.display = 'none';
    reportsSection.style.display = 'block'; // Mostrar la sección de reportes

    updateSidebarActiveLink(this);
    generateReports(); // Generar y mostrar los reportes al hacer clic
});


// --- Funcionalidad de Eliminación de Cuenta ---
/**
 * Muestra el modal de confirmación de eliminación de cuenta.
 */
function showDeleteAccountModal() {
    deleteAccountModal.classList.remove('hidden');
}

/**
 * Oculta el modal de confirmación de eliminación de cuenta.
 */
function hideDeleteAccountModal() {
    deleteAccountModal.classList.add('hidden');
}

/**
 * Simula la eliminación/desactivación de la cuenta de usuario.
 */
async function handleAccountDeletion() {
    hideDeleteAccountModal(); // Ocultar el modal inmediatamente

    if (!currentUserId) {
        alert('No hay una sesión activa para eliminar.');
        return;
    }

    console.log('Intentando eliminar cuenta para user_id:', currentUserId);
    
    try {
        const response = await fetch('http://localhost:8888/sistema_academico/api.php', { // URL AQUI CAMBIADA
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'deleteAccount',
                user_id: currentUserId
            })
        });
        const data = await response.json();

        if (data.success) {
            alert('Tu cuenta ha sido eliminada permanentemente. ¡Lo sentimos verte partir!');
            showAuth(); // Redirigir al usuario a la pantalla de autenticación
            // Opcional: limpiar todos los datos del usuario si se estuvieran almacenando localmente
            academicHistoryData = [];
            pensumData = [];
            totalCareerCredits = 0;
            currentUserId = null;
        } else {
            alert('Error al eliminar la cuenta: ' + data.message);
        }
    } catch (error) {
        console.error('Error de conexión al eliminar cuenta:', error);
        alert('Error de conexión con el servidor al eliminar cuenta.');
    }
}

// --- Event Listeners para la Eliminación de Cuenta ---
deleteAccountBtn.addEventListener('click', showDeleteAccountModal);
cancelDeleteAccountBtn.addEventListener('click', hideDeleteAccountModal);
confirmDeleteAccountBtn.addEventListener('click', handleAccountDeletion);

// Cerrar modal al hacer clic fuera de su contenido (similar al demoModal)
window.addEventListener('click', function(event) {
    if (event.target === deleteAccountModal) {
        hideDeleteAccountModal();
    }
});

// Asegurarse de que el modal de eliminación se oculte cuando se navega a cualquier otra sección
document.querySelectorAll('#sidebar nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        hideDeleteAccountModal();
    });
});
// También al mostrar el dashboard o al cerrar sesión
logoutBtn.addEventListener('click', hideDeleteAccountModal);

// Inicializar la carga del pensum y historial cuando la página carga completamente
// Esto es útil si el usuario ya está "logueado" (ej. por una sesión persistente)
document.addEventListener('DOMContentLoaded', () => {
    // Aquí, en un sistema real, verificarías si hay una sesión activa
    // Por ahora, solo cargamos el pensum, el historial se carga al login
    fetchPensum();
});