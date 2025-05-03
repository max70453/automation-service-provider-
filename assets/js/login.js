// Функции валидации
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Управление состоянием "Запомнить меня"
function handleRememberMe() {
    const rememberMe = document.getElementById('remember');
    if (rememberMe.checked) {
        const email = document.getElementById('email').value;
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
}

// Восстановление сохраненного email
function restoreRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
}

// Показ уведомлений
function showNotification(message, isError = false) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`;
    notificationDiv.role = 'alert';
    notificationDiv.textContent = message;

    const form = document.querySelector('.login-form');
    form.insertAdjacentElement('beforebegin', notificationDiv);

    setTimeout(() => {
        notificationDiv.remove();
    }, 5000);
}

// Обработка отправки формы
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Валидация
    if (!validateEmail(email)) {
        showNotification('Пожалуйста, введите корректный email', true);
        return;
    }

    if (!validatePassword(password)) {
        showNotification('Пароль должен содержать минимум 6 символов', true);
        return;
    }

    try {
        // Здесь будет отправка данных на сервер
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            handleRememberMe();
            showNotification('Вход выполнен успешно!');
            setTimeout(() => {
                window.location.href = 'automation-service-provider-/integrations.html';
            }, 1500);
        } else {
            const data = await response.json();
            showNotification(data.message || 'Ошибка входа в систему', true);
        }
    } catch (error) {
        showNotification('Произошла ошибка при подключении к серверу', true);
        console.error('Ошибка:', error);
    }
}

// Обработка восстановления пароля
async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    if (!validateEmail(email)) {
        showNotification('Пожалуйста, введите корректный email для восстановления пароля', true);
        return;
    }

    try {
        // Здесь будет отправка запроса на восстановление пароля
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showNotification('Инструкции по восстановлению пароля отправлены на ваш email');
        } else {
            const data = await response.json();
            showNotification(data.message || 'Ошибка при восстановлении пароля', true);
        }
    } catch (error) {
        showNotification('Произошла ошибка при подключении к серверу', true);
        console.error('Ошибка:', error);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const forgotPasswordLink = document.querySelector('a[href="#"]');

    loginForm.addEventListener('submit', handleLogin);
    forgotPasswordLink.addEventListener('click', handleForgotPassword);

    restoreRememberedEmail();
});