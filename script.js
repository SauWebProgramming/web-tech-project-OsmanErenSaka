// Global değişkenler
const mediaGrid = document.getElementById('media-grid');
const searchInput = document.getElementById('search-input');
let allMedia = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const loadData = async () => {
    try {
        const response = await fetch('data.json');
        allMedia = await response.json();
        displayMedia(allMedia); // Veriyi ekrana basan fonksiyonu çağır
    } catch (error) {
        console.error("Veri yüklenirken hata:", error);
    }
};

const displayMedia = (data) => {
    const grid = document.getElementById('media-grid');
    grid.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.onclick = () => showDetails(item.id); 
        
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} - ${item.category} - ${item.rating}</p>
            </div>
        `;
        grid.appendChild(card);
    });
};
const filterMedia = () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('filter-select').value;

    const filtered = allMedia.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayMedia(filtered);
};
function filterAndSort() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterType = document.getElementById('filter-select').value;
    const sortType = document.getElementById('sort-select').value;

    // 1. Filtreleme (Arama ve Tür)
    let filteredData = allMedia.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    // 2. Sıralama
    if (sortType === 'az') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'za') {
        filteredData.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === 'rating') {
        filteredData.sort((a, b) => b.rating - a.rating);
    }

    // 3. Sonuçları Görüntüle
    displayMedia(filteredData);
}
const addToFavorites = (id) => {
    const itemToAdd = allMedia.find(item => item.id === id);
    
    
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push(itemToAdd);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
    } 
};
const removeFromFavorites = (id) => {
    favorites = favorites.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    
    showFavorites(); 
};

const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const grid = document.getElementById('media-grid');
    
    if (favorites.length === 0) {
    grid.innerHTML = `
        <div class="empty-favorites">
            <div class="empty-icon">❤️</div>
            <h2>Favori Listeniz Boş</h2>
            <p>Henüz hiçbir içeriği favorilerinize eklemediniz. Ana sayfaya dönüp keşfetmeye başlayın!</p>
            <button class="modern-back-btn" onclick="location.reload()">Keşfetmeye Başla</button>
        </div>
    `;
    return;
}
displayMedia(favorites); 
};

document.getElementById('favorites-link').addEventListener('click', (e) => {
    e.preventDefault();
    showFavorites();
});


const showDetails = (id) => {
    const item = allMedia.find(m => m.id === id);
    const grid = document.getElementById('media-grid');
    const isFav = favorites.some(fav => fav.id === item.id);

    
    grid.innerHTML = `
        <div class="detail-wrapper">
            <div class="detail-header">
                <button class="modern-back-btn" onclick="displayMedia(allMedia)">
                    <span class="icon">←</span> Geri Dön
                </button>
            </div>
            <div class="detail-container">
                <div class="detail-poster">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="detail-main-content">
                    <h1 class="detail-title">${item.title} <span class="detail-year">(${item.year})</span></h1>
                    <div class="detail-meta">
                        <span class="badge category">${item.category}</span>
                        <span class="badge type">${item.type.toUpperCase()}</span>
                        <span class="rating">⭐ ${item.rating}/10</span>
                    </div>
                    <div class="detail-description">
                        <h3>Özet</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="detail-footer">
                        ${isFav 
                            ? `<button onclick="handleFavorite(${item.id}, false)" class="fav-action-btn remove">Favorilerden Çıkar</button>`
                            : `<button onclick="handleFavorite(${item.id}, true)" class="fav-action-btn add">Favorilere Ekle</button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
};

const handleFavorite = (id, isAdding) => {
    if (isAdding) addToFavorites(id);
    else removeFromFavorites(id);
    showDetails(id); 
};


document.getElementById('search-input').addEventListener('input', filterAndSort);
document.getElementById('filter-select').addEventListener('change', filterAndSort);
document.getElementById('sort-select').addEventListener('change', filterAndSort);
document.addEventListener('DOMContentLoaded', loadData);
