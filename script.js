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
        // Bu ürün favorilerde mi kontrol et
        const isFav = favorites.some(fav => fav.id === item.id);
        
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.year} - ${item.category}</p>
            <div class="card-buttons">
                ${isFav 
                    ? `<button onclick="removeFromFavorites(${item.id})" class="btn-remove">Favorilerden Çıkar</button>`
                    : `<button onclick="addToFavorites(${item.id})" class="btn-add">Favorilere Ekle</button>`
                }
                <button onclick="showDetails(${item.id})">Detaylar</button>
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
const addToFavorites = (id) => {
    const itemToAdd = allMedia.find(item => item.id === id);
    
    
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push(itemToAdd);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${itemToAdd.title} favorilere eklendi!`);
    } else {
        alert("Bu içerik zaten favorilerinizde.");
    }
};
const removeFromFavorites = (id) => {
    favorites = favorites.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Eğer şu an favoriler sayfasındaysak ekranı anında güncelle
    showFavorites(); 
};

const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const grid = document.getElementById('media-grid');
    
    if (favorites.length === 0) {
        grid.innerHTML = '<h2>Henüz favori eklenmemiş.</h2>';
        return;
    }
displayMedia(favorites); // Mevcut display fonksiyonunu tekrar kullanıyoruz
};

document.getElementById('favorites-link').addEventListener('click', (e) => {
    e.preventDefault();
    showFavorites();
});

document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    displayMedia(allMedia);
});

const showDetails = (id) => {
    const item = allMedia.find(item => item.id === id);
    const grid = document.getElementById('media-grid');

    // Ana alanı temizle ve detayları bas
    grid.innerHTML = `
        <div class="detail-container">
            <button onclick="displayMedia(allMedia)">← Geri Dön</button>
            <div class="detail-content">
                <img src="${item.image}" alt="${item.title}">
                <div class="detail-text">
                    <h1>${item.title} (${item.year})</h1>
                    <p><strong>Puan:</strong> ${item.rating} / 10</p>
                    <p><strong>Kategori:</strong> ${item.category}</p>
                    <p><strong>Özet:</strong> ${item.description}</p>
                </div>
            </div>
        </div>
    `;
};



document.getElementById('search-input').addEventListener('input', filterMedia);
document.getElementById('filter-select').addEventListener('change', filterMedia);
document.addEventListener('DOMContentLoaded', loadData);
