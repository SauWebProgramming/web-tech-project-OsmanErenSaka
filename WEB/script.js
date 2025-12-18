// Global değişkenler
const mediaGrid = document.getElementById('media-grid');
const searchInput = document.getElementById('search-input');
let allMedia = [];
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
    grid.innerHTML = ''; // Önce temizle

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.year} - ${item.category}</p>
            <button onclick="addToFavorites(${item.id})">Favorilere Ekle</button>
            <button onclick="showDetails(${item.id})">Detaylar</button>
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
document.getElementById('search-input').addEventListener('input', filterMedia);
document.getElementById('filter-select').addEventListener('change', filterMedia);
// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', loadData);