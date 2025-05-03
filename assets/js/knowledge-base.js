// Состояние базы знаний
let knowledgeBaseState = {
    searchQuery: '',
    selectedCategory: null,
    selectedTags: [],
    articles: [],
    popularArticles: [],
    latestArticles: []
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

// Функция поиска по базе знаний
async function searchKnowledgeBase(query) {
    try {
        const response = await fetch(`/api/knowledge-base/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const results = await response.json();
            displaySearchResults(results);
        } else {
            showNotification('Ошибка при выполнении поиска', true);
        }
    } catch (error) {
        console.error('Ошибка поиска:', error);
        showNotification('Ошибка подключения к серверу', true);
    }
}

// Функция отображения результатов поиска
function displaySearchResults(results) {
    const container = document.querySelector('.search-results');
    if (!container) return;

    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p class="text-muted">По вашему запросу ничего не найдено</p>';
        return;
    }

    const resultsList = document.createElement('div');
    resultsList.className = 'list-group mt-3';

    results.forEach(article => {
        const articleElement = document.createElement('a');
        articleElement.href = `#article-${article.id}`;
        articleElement.className = 'list-group-item list-group-item-action';
        articleElement.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${article.title}</h5>
                <small class="text-muted">${article.category}</small>
            </div>
            <p class="mb-1">${article.excerpt}</p>
            <small class="text-muted">Релевантность: ${article.relevance}%</small>
        `;
        resultsList.appendChild(articleElement);
    });

    container.appendChild(resultsList);
}

// Функция фильтрации по категории
async function filterByCategory(category) {
    try {
        const response = await fetch(`/api/knowledge-base/category/${encodeURIComponent(category)}`);
        if (response.ok) {
            const articles = await response.json();
            knowledgeBaseState.articles = articles;
            displayArticles(articles);
        } else {
            showNotification('Ошибка при фильтрации по категории', true);
        }
    } catch (error) {
        console.error('Ошибка фильтрации:', error);
        showNotification('Ошибка подключения к серверу', true);
    }
}

// Функция фильтрации по тегам
function filterByTags(tags) {
    const filteredArticles = knowledgeBaseState.articles.filter(article => {
        return tags.every(tag => article.tags.includes(tag));
    });
    displayArticles(filteredArticles);
}

// Функция оценки полезности статьи
async function rateArticle(articleId, isHelpful) {
    try {
        const response = await fetch(`/api/knowledge-base/articles/${articleId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ helpful: isHelpful })
        });

        if (response.ok) {
            const result = await response.json();
            updateArticleRating(articleId, result.rating);
            showNotification('Спасибо за вашу оценку!');
        } else {
            showNotification('Ошибка при отправке оценки', true);
        }
    } catch (error) {
        console.error('Ошибка оценки:', error);
        showNotification('Ошибка подключения к серверу', true);
    }
}

// Функция обновления рейтинга статьи
function updateArticleRating(articleId, rating) {
    const ratingElement = document.querySelector(`#article-${articleId} .article-rating`);
    if (ratingElement) {
        ratingElement.textContent = `${rating}% пользователей считают статью полезной`;
    }
}

// Функция загрузки популярных статей
async function loadPopularArticles() {
    try {
        const response = await fetch('/api/knowledge-base/popular');
        if (response.ok) {
            const articles = await response.json();
            knowledgeBaseState.popularArticles = articles;
            displayPopularArticles(articles);
        }
    } catch (error) {
        console.error('Ошибка загрузки популярных статей:', error);
    }
}

// Функция загрузки последних статей
async function loadLatestArticles() {
    try {
        const response = await fetch('/api/knowledge-base/latest');
        if (response.ok) {
            const articles = await response.json();
            knowledgeBaseState.latestArticles = articles;
            displayLatestArticles(articles);
        }
    } catch (error) {
        console.error('Ошибка загрузки последних статей:', error);
    }
}

// Инициализация поиска с автодополнением
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    let debounceTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        const query = e.target.value.trim();
        knowledgeBaseState.searchQuery = query;

        if (query.length >= 3) {
            debounceTimeout = setTimeout(() => {
                searchKnowledgeBase(query);
            }, 300);
        }
    });
}

// Инициализация фильтров по тегам
function initializeTagFilters() {
    const tagButtons = document.querySelectorAll('.popular-tags .badge');
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('bg-primary');
            button.classList.toggle('bg-light');
            
            const tag = button.textContent.trim();
            const tagIndex = knowledgeBaseState.selectedTags.indexOf(tag);
            
            if (tagIndex === -1) {
                knowledgeBaseState.selectedTags.push(tag);
            } else {
                knowledgeBaseState.selectedTags.splice(tagIndex, 1);
            }
            
            filterByTags(knowledgeBaseState.selectedTags);
        });
    });
}

// Инициализация категорий
function initializeCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('.card-title').textContent;
            knowledgeBaseState.selectedCategory = category;
            filterByCategory(category);
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeTagFilters();
    initializeCategories();
    loadPopularArticles();
    loadLatestArticles();
});