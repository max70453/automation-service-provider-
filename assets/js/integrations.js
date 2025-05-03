// Состояние интеграций
let integrationStates = {
    billing: { status: false, lastSync: null },
    monitoring: { status: false, lastCheck: null },
    telephony: { status: false, lastCall: null },
    notifications: { status: false, lastSent: null },
    social: { status: false, lastMessage: null }
};

// Статистика интеграций
let integrationStats = {
    billing: { attempts: 0, success: 0, errors: 0, lastSuccess: null, uptime: 0 },
    monitoring: { attempts: 0, success: 0, errors: 0, lastSuccess: null, uptime: 0 },
    telephony: { attempts: 0, success: 0, errors: 0, lastSuccess: null, uptime: 0 },
    notifications: { attempts: 0, success: 0, errors: 0, lastSuccess: null, uptime: 0 },
    social: { attempts: 0, success: 0, errors: 0, lastSuccess: null, uptime: 0 }
};

// Функция для показа уведомлений
function showNotification(message, isError = false) {
    const container = document.querySelector('.notifications-container');
    const alert = document.createElement('div');
    alert.className = `alert ${isError ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Функция для добавления записи в журнал событий
function addEventLog(integration, type, message) {
    const table = document.getElementById('eventLogTable');
    const row = table.insertRow(0);
    row.innerHTML = `
        <td>${new Date().toLocaleString()}</td>
        <td>${integration}</td>
        <td>${type}</td>
        <td>${message}</td>
    `;
}

// Функция обновления статистики
function updateStatistics() {
    const table = document.getElementById('statisticsTable');
    table.innerHTML = '';
    
    for (const [integration, stats] of Object.entries(integrationStats)) {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${integration}</td>
            <td>${stats.attempts}</td>
            <td>${stats.success}</td>
            <td>${stats.errors}</td>
            <td>${stats.lastSuccess ? new Date(stats.lastSuccess).toLocaleString() : '-'}</td>
            <td>${Math.round(stats.uptime / 60)} мин</td>
        `;
    }
}

// Функция обновления статуса интеграций
function updateIntegrationStatus(integration, status) {
    integrationStates[integration].status = status;
    const statusElement = document.getElementById(`${integration}Status`);
    statusElement.className = `badge ${status ? 'bg-success' : 'bg-danger'}`;
    statusElement.textContent = status ? 'Активно' : 'Неактивно';
}

// Функция обновления времени последней синхронизации
function updateLastSync(integration, type) {
    const now = new Date();
    integrationStates[integration][type] = now;
    document.getElementById(`${integration}${type.charAt(0).toUpperCase() + type.slice(1)}`)
        .textContent = now.toLocaleString();
}

// Обработчик отправки форм настройки интеграций
async function handleIntegrationConfig(event) {
    event.preventDefault();
    const form = event.target;
    const integration = form.dataset.integration;
    const formData = new FormData(form);
    const config = Object.fromEntries(formData.entries());

    try {
        // Здесь будет отправка конфигурации на сервер
        const response = await fetch(`/api/integrations/${integration}/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        });

        if (response.ok) {
            showNotification(`Настройки ${integration} успешно сохранены`);
            updateIntegrationStatus(integration, true);
            integrationStats[integration].attempts++;
            integrationStats[integration].success++;
            integrationStats[integration].lastSuccess = new Date();
            addEventLog(integration, 'config', 'Конфигурация обновлена');
        } else {
            const data = await response.json();
            showNotification(data.message || `Ошибка сохранения настроек ${integration}`, true);
            integrationStats[integration].attempts++;
            integrationStats[integration].errors++;
            addEventLog(integration, 'error', 'Ошибка конфигурации');
        }
    } catch (error) {
        showNotification(`Ошибка подключения к серверу при настройке ${integration}`, true);
        console.error('Ошибка:', error);
        integrationStats[integration].attempts++;
        integrationStats[integration].errors++;
        addEventLog(integration, 'error', 'Ошибка подключения к серверу');
    }

    updateStatistics();
    bootstrap.Modal.getInstance(form.closest('.modal')).hide();
}

// Периодическое обновление статуса интеграций
function startStatusUpdates() {
    setInterval(async () => {
        try {
            const response = await fetch('/api/integrations/status');
            if (response.ok) {
                const statuses = await response.json();
                for (const [integration, status] of Object.entries(statuses)) {
                    updateIntegrationStatus(integration, status.active);
                    if (status.lastSync) {
                        updateLastSync(integration, status.type);
                    }
                    integrationStats[integration].uptime += 1;
                }
                updateStatistics();
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    }, 60000); // Обновление каждую минуту
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Привязка обработчиков к формам
    const forms = document.querySelectorAll('.integration-config-form');
    forms.forEach(form => {
        form.addEventListener('submit', handleIntegrationConfig);
    });

    // Запуск периодического обновления статуса
    startStatusUpdates();

    // Первоначальное обновление статистики
    updateStatistics();
});