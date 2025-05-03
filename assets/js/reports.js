// Инициализация графиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // График динамики качества обслуживания
    if(document.getElementById('serviceQualityChart')) {
        const serviceQualityOptions = {
            series: [{
                name: 'Оценка качества',
                data: [4.5, 4.6, 4.8, 4.7, 4.9, 4.8]
            }],
            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
            },
            yaxis: {
                min: 4,
                max: 5,
                tickAmount: 5
            },
            markers: {
                size: 4
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val.toFixed(1);
                    }
                }
            }
        };
        new ApexCharts(document.getElementById('serviceQualityChart'), serviceQualityOptions).render();
    }

    // График анализа проблемных зон
    if(document.getElementById('problemAreasChart')) {
        const problemAreasOptions = {
            series: [{
                name: 'Количество обращений',
                data: [45, 32, 28, 25, 20, 15]
            }],
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true
                }
            },
            xaxis: {
                categories: ['Технические сбои', 'Качество связи', 'Биллинг', 'Документация', 'Сроки', 'Другое']
            },
            colors: ['#ff6b6b'],
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val + ' обращений';
                    }
                }
            }
        };
        new ApexCharts(document.getElementById('problemAreasChart'), problemAreasOptions).render();
    }

    // График анализа выручки
    if(document.getElementById('revenueChart')) {
        const revenueOptions = {
            series: [{
                name: 'Выручка',
                data: [1.8, 2.1, 2.3, 2.0, 2.4, 2.5]
            }],
            chart: {
                type: 'area',
                height: 350,
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
                categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return '₽' + val.toFixed(1) + 'M';
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3
                }
            }
        };
        new ApexCharts(document.getElementById('revenueChart'), revenueOptions).render();
    }

    // График удовлетворенности клиентов
    if(document.getElementById('satisfactionChart')) {
        const satisfactionOptions = {
            series: [75, 15, 10],
            chart: {
                type: 'donut',
                height: 350
            },
            labels: ['Довольны', 'Нейтрально', 'Недовольны'],
            colors: ['#28a745', '#ffc107', '#dc3545'],
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
            }],
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val + '%';
                    }
                }
            }
        };
        new ApexCharts(document.getElementById('satisfactionChart'), satisfactionOptions).render();
    }

    // Обработка формы генерации отчета
    const reportForm = document.getElementById('reportForm');
    if(reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const reportType = document.getElementById('reportType').value;
            const dateRange = document.getElementById('dateRange').value;
            
            // Здесь будет логика генерации отчета
            alert(`Отчет типа "${reportType}" за период "${dateRange}" сформирован`);
        });
    }
});