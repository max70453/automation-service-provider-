// Класс для управления уведомлениями
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.settings = this.loadSettings();
        this.initializeEventListeners();
    }

    // Загрузка настроек из localStorage
    loadSettings() {
        const defaultSettings = {
            emailNotifications: true,
            smsNotifications: true,
            webNotifications: false,
            pushNotifications: false,
            notificationTypes: {
                maintenance: true,
                offers: true,
                payment: true,
                tariff: true,
                birthday: true
            }
        };
        return JSON.parse(localStorage.getItem('notificationSettings')) || defaultSettings;
    }

    // Сохранение настроек
    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    // Отметить уведомление как прочитанное
    markAsRead(index) {
        const button = document.querySelector(`[data-index="${index}"]`);
        if (button) {
            const card = button.closest('.notification-card');
            if (card) {
                card.classList.add('read');
                card.classList.remove('unread');
                // Сохраняем статус в localStorage
                const notifications = this.getNotifications();
                if (notifications[index]) {
                    notifications[index].read = true;
                    localStorage.setItem('notifications', JSON.stringify(notifications));
                }
            }
        }
    }

    // Получение уведомлений
    getNotifications() {
        return JSON.parse(localStorage.getItem('notifications')) || [];
    }

    // Фильтрация уведомлений
    filterNotifications() {
        const typeFilter = document.querySelector('.filters select:first-child').value;
        const statusFilter = document.querySelector('.filters select:last-child').value;
        const notifications = this.getNotifications();

        return notifications.filter(notification => {
            const typeMatch = typeFilter === 'all' || notification.type === typeFilter;
            const statusMatch = statusFilter === 'all' || 
                (statusFilter === 'read' && notification.read) || 
                (statusFilter === 'unread' && !notification.read);
            return typeMatch && statusMatch;
        });
    }

    // Инициализация обработчиков событий
    initializeEventListeners() {
        // Обработчики фильтров
        document.querySelectorAll('.filters select').forEach(select => {
            select.addEventListener('change', () => this.renderNotifications());
        });

        // Обработчики переключателей уведомлений
        const notificationTypes = ['email', 'sms', 'web', 'push'];
        notificationTypes.forEach(type => {
            const checkbox = document.getElementById(`${type}Notifications`);
            if (checkbox) {
                checkbox.checked = this.settings[`${type}Notifications`];
                checkbox.addEventListener('change', (e) => {
                    this.settings[`${type}Notifications`] = e.target.checked;
                    this.saveSettings();
                });
            }
        });

        // Обработчики кнопок "прочитано"
        document.querySelectorAll('.mark-read-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                this.markAsRead(index);
            });
        });

        // Обработчик модального окна настроек
        const modal = document.getElementById('notificationSettingsModal');
        if (modal) {
            const saveButton = modal.querySelector('.btn-primary');
            saveButton.addEventListener('click', () => {
                this.saveModalSettings();
            });
        }
    }

    // Сохранение настроек из модального окна
    saveModalSettings() {
        const notificationTypes = ['maintenance', 'offers', 'payment', 'tariff', 'birthday'];
        notificationTypes.forEach(type => {
            const checkbox = document.getElementById(`${type}Notif`);
            if (checkbox) {
                this.settings.notificationTypes[type] = checkbox.checked;
            }
        });

        const emailInput = document.querySelector('input[type="email"]');
        const phoneInput = document.querySelector('input[type="tel"]');
        if (emailInput && phoneInput) {
            this.settings.contactInfo = {
                email: emailInput.value,
                phone: phoneInput.value
            };
        }

        this.saveSettings();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const notificationManager = new NotificationManager();
});