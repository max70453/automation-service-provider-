// Инициализация графиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // График статистики кампаний
    if(document.getElementById('campaignStats')) {
        const campaignStatsOptions = {
            series: [{
                name: 'Открыто',
                data: [44, 55, 57, 56, 61, 58]
            }, {
                name: 'Конверсия',
                data: [76, 85, 101, 98, 87, 105]
            }],
            chart: {
                type: 'bar',
                height: 250,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "%"
                    }
                }
            }
        };
        new ApexCharts(document.getElementById('campaignStats'), campaignStatsOptions).render();
    }

    // График аналитики сегментов
    if(document.getElementById('segmentAnalytics')) {
        const segmentAnalyticsOptions = {
            series: [44, 55, 13, 43],
            chart: {
                type: 'donut',
                height: 250
            },
            labels: ['VIP клиенты', 'Активные', 'Новые', 'Другие'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        new ApexCharts(document.getElementById('segmentAnalytics'), segmentAnalyticsOptions).render();
    }

    // График эффективности по каналам
    if(document.getElementById('channelEffectiveness')) {
        const channelEffectivenessOptions = {
            series: [{
                name: 'Email',
                data: [45, 52, 38, 24, 33, 26, 21]
            }, {
                name: 'SMS',
                data: [35, 41, 62, 42, 13, 18, 29]
            }],
            chart: {
                height: 300,
                type: 'line',
                toolbar: {
                    show: false
                }
            },
            stroke: {
                width: [4, 4]
            },
            xaxis: {
                categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val + "%"
                    }
                }
            },
            legend: {
                position: 'top'
            }
        };
        new ApexCharts(document.getElementById('channelEffectiveness'), channelEffectivenessOptions).render();
    }

    // График динамики конверсии
    if(document.getElementById('conversionTrend')) {
        const conversionTrendOptions = {
            series: [{
                name: 'Конверсия',
                data: [31, 40, 28, 51, 42, 109, 100]
            }],
            chart: {
                height: 300,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val + "%"
                    }
                }
            }
        };
        new ApexCharts(document.getElementById('conversionTrend'), conversionTrendOptions).render();
    }
});

// Обработка форм
document.addEventListener('DOMContentLoaded', function() {
    // Форма создания кампании
    const campaignForm = document.querySelector('#marketing-campaigns form');
    if(campaignForm) {
        campaignForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь будет логика создания кампании
            alert('Кампания создана успешно!');
        });
    }

    // Форма создания сегмента
    const segmentForm = document.querySelector('#subscriber-segmentation form');
    if(segmentForm) {
        segmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь будет логика создания сегмента
            alert('Сегмент создан успешно!');
        });
    }

    // Кнопка добавления критерия
    const addCriteriaBtn = document.querySelector('.btn-outline-secondary');
    if(addCriteriaBtn) {
        addCriteriaBtn.addEventListener('click', function() {
            const criteriaGroup = document.querySelector('.criteria-group');
            const newCriteria = criteriaGroup.firstElementChild.cloneNode(true);
            criteriaGroup.appendChild(newCriteria);
        });
    }
});