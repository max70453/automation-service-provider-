// Инициализация графиков и компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeFormHandlers();
    initializeTooltips();
});

// Инициализация графиков
function initializeCharts() {
    // График статистики кампаний
    const campaignStatsOptions = {
        series: [{
            name: 'Конверсия',
            data: [45, 52, 38, 24, 33, 26, 21, 20]
        }],
        chart: {
            height: 250,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [3],
            curve: 'straight',
            dashArray: [0]
        },
        markers: {
            size: 4
        },
        xaxis: {
            categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг'],
        },
        yaxis: {
            title: {
                text: 'Процент конверсии'
            }
        },
        tooltip: {
            y: [{
                title: {
                    formatter: function (val) {
                        return val + '%';
                    }
                }
            }]
        },
        grid: {
            borderColor: '#f1f1f1'
        }
    };

    // График эффективности по каналам
    const channelEffectivenessOptions = {
        series: [{
            data: [45, 28, 33, 25]
        }],
        chart: {
            type: 'bar',
            height: 250
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Email', 'SMS', 'Push', 'Мессенджеры'],
        },
        colors: ['#4154f1']
    };

    // График динамики конверсии
    const conversionTrendOptions = {
        series: [{
            name: 'Конверсия',
            data: [31, 40, 28, 51, 42, 109, 100]
        }],
        chart: {
            height: 250,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };

    // Инициализация графиков если элементы существуют
    if (document.querySelector('#campaignStats')) {
        new ApexCharts(document.querySelector('#campaignStats'), campaignStatsOptions).render();
    }
    if (document.querySelector('#channelEffectiveness')) {
        new ApexCharts(document.querySelector('#channelEffectiveness'), channelEffectivenessOptions).render();
    }
    if (document.querySelector('#conversionTrend')) {
        new ApexCharts(document.querySelector('#conversionTrend'), conversionTrendOptions).render();
    }
}

// Инициализация обработчиков форм
function initializeFormHandlers() {
    // Форма создания кампании
    const campaignForm = document.querySelector('form');
    if (campaignForm) {
        campaignForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            // Здесь будет логика отправки данных на сервер
            showNotification('success', 'Кампания успешно создана');
        });
    }

    // Добавление критерия сегментации
    const addCriteriaBtn = document.querySelector('button[type="button"]');
    if (addCriteriaBtn) {
        addCriteriaBtn.addEventListener('click', function() {
            const criteriaGroup = document.querySelector('.criteria-group');
            if (criteriaGroup) {
                const newCriteria = criteriaGroup.cloneNode(true);
                criteriaGroup.parentNode.insertBefore(newCriteria, this);
            }
        });
    }
}

// Инициализация тултипов
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Функция отображения уведомлений
function showNotification(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Добавляем уведомление в начало основного контента
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Функция обновления статистики
function updateStatistics() {
    // Здесь будет логика получения актуальных данных с сервера
    // и обновления графиков
}

// Автоматическое обновление статистики каждые 5 минут
setInterval(updateStatistics, 300000);