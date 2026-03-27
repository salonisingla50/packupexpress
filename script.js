// script.js PackUp Express Logic
const scriptURL = 'https://script.google.com/macros/s/AKfycbw9mtTBxAnNGufGoPFnV9ucoRHgcMHIrWSPLiW2vaw_VQ0Zm4qBczYF7HjRicvCIeLf/exec';
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const sheetId = '1vXFSaq1xQIng77Kfzyvd4Z6RpQdZuYDQ6buil-NvxrA';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
let allBlogs = [];

// 2. FETCH DATA FROM GOOGLE FOR BLOGS
async function init() {
    try {
        const res = await fetch(base);
        const text = await res.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        // Clean and store data (Newest First)
        allBlogs = rows.map((row, index) => ({
            title: row.c[0]?.v || 'Untitled',
            date: row.c[1]?.v || '',
            category: row.c[2]?.v || 'General',
            desc: row.c[3]?.v || '',
            img: row.c[4]?.v || 'https://via.placeholder.com/600x400',
            id: index
        })).reverse();

        render();
    } catch (err) {
        console.error("Could not load data from Google Sheets:", err);
    }
}

// 3. RENDER LOGIC
function render() {
    const homeGrid = document.getElementById('blog-container');
    const fullGrid = document.getElementById('full-blog-container');

    // Home Page Logic (index.html)
    if (homeGrid) {
        const latestThree = allBlogs.slice(0, 3);
        homeGrid.innerHTML = latestThree.map(b => createCard(b)).join('');
    }

    // Full Blog Page Logic (blogs.html)
    if (fullGrid) {
        displayFullList(allBlogs);
        
        // Search Logic
        document.getElementById('blogSearch').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allBlogs.filter(b => 
                b.title.toLowerCase().includes(term) || 
                b.category.toLowerCase().includes(term)
            );
            displayFullList(filtered);
        });
    }
}

function displayFullList(data) {
    const fullGrid = document.getElementById('full-blog-container');
    fullGrid.innerHTML = data.length > 0 
        ? data.map(b => createCard(b)).join('') 
        : '<p class="col-span-full text-center py-20 text-slate-400">No articles found matching that search.</p>';
}

// 4. CARD GENERATOR
function createCard(blog) {
    const imgUrl = String(blog.img).trim();
    return `
        <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-soft border border-slate-100 group hover:shadow-2xl transition-all duration-500">
            <div class="h-64 overflow-hidden relative">
                <img src="${imgUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    ${blog.category}
                </div>
            </div>
            <div class="p-8">
                <p class="text-slate-400 text-[11px] font-bold mb-3 uppercase tracking-wider">${blog.date}</p>
                <h4 class="text-2xl font-extrabold text-navy mb-6 group-hover:text-orange transition-colors">${blog.title}</h4>
                <button onclick="openBlog(${blog.id})" class="flex items-center text-navy font-extrabold text-sm group/btn">
                    READ ARTICLE 
                    <span class="ml-2 w-8 h-[2px] bg-orange transition-all group-hover/btn:w-12"></span>
                </button>
            </div>
        </div>
    `;
}

// 5. MODAL LOGIC
function openBlog(id) {
    // Find blog by original ID
    const blog = allBlogs.find(b => b.id === id);
    if (!blog) return;

    document.getElementById('modalImg').src = blog.img;
    document.getElementById('modalCategory').innerText = blog.category;
    document.getElementById('modalTitle').innerText = blog.title;
    
    // Convert Alt+Enter from Excel into Paragraphs
    const formattedBody = blog.desc.split('\n').map(p => `<p>${p}</p>`).join('');
    document.getElementById('modalBody').innerHTML = formattedBody;

    document.getElementById('blogModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeBlog() {
    document.getElementById('blogModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 6. MOBILE MENU LOGIC 
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    
    // Check if menu is currently open by looking at the transform style
    if (menu.style.transform === 'translateX(0%)') {
        // CLOSE MENU
        menu.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        // Wait for animation to finish before hiding overlay display
        setTimeout(() => { 
            overlay.style.display = 'none'; 
        }, 300);
        document.body.style.overflow = ''; // Re-enable scrolling
    } else {
        // OPEN MENU
        overlay.style.display = 'block';
        // Small delay to allow 'display: block' to register so opacity transition works
        setTimeout(() => { 
            overlay.style.opacity = '1'; 
            menu.style.transform = 'translateX(0%)';
        }, 10);
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
}

// 7. Branch Section
const branches = [
    { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { city: "Delhi NCR", lat: 28.6139, lng: 77.2090 },
    { city: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { city: "Pune", lat: 18.5204, lng: 73.8567 },
    { city: "Chennai", lat: 13.0827, lng: 80.2707 },
    { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { city: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { city: "Surat", lat: 21.1702, lng: 72.8311 },
    { city: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { city: "Indore", lat: 22.7196, lng: 75.8577 },
    { city: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
    { city: "Patna", lat: 25.5941, lng: 85.1376 },
    { city: "Vadodara", lat: 22.3072, lng: 73.1812 },
    { city: "Ludhiana", lat: 30.9010, lng: 75.8573 },
    { city: "Agra", lat: 27.1767, lng: 78.0081 },
    { city: "Nashik", lat: 19.9975, lng: 73.7898 },
    { city: "Goa", lat: 15.2993, lng: 74.1240 },
    { city: "Guwahati", lat: 26.1445, lng: 91.7362 },
    { city: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { city: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { city: "Dehradun", lat: 30.3165, lng: 78.0322 }
];

const extraCities = [
    "Ajmer", "Aligarh", "Asansol", "Bareilly", "Bhagalpur", "Bharatpur", "Bharuch", "Bhilwara", 
    "Bhiwadi", "Bikaner", "Bilaspur", "Bokaro", "Buldhana", "Burhanpur", "Chhindwara", "Cochin", 
    "Coimbatore", "Davangere", "Dhanbad", "Dhuliya", "Durgapur", "Faridabad", "Gandhidham", 
    "Gorakhpur", "Guna", "Gwalior", "Hazaribagh", "Haldwani", "Haridwar", "Hisar", "Hubli", 
    "Jabalpur", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jhansi", "Jodhpur", "Kakinada", 
    "Kanpur", "Kolhapur", "Korba", "Kota", "Kotma", "Mathura", "Meerut", "Nanded", "Noida", 
    "Panipat", "Pondicherry", "Prayagraj", "Raigarh", "Raipur", "Rajahmundry", "Rajkot", 
    "Ranchi", "Rourkela", "Sagar", "Saharanpur", "Salem", "Sangli", "Satna", "Shivamogga", 
    "Siliguri", "Solapur", "Sonebhadra", "Udaipur", "Ujjain", "Valsad", "Varanasi"
];

window.addEventListener('DOMContentLoaded', () => {
    // A. Initialize Map
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const listContainer = document.getElementById('branchList');
    const searchInput = document.getElementById('branchSearch');
    const markers = {};

    // B. Place Markers for Geopoint Cities
    branches.forEach(branch => {
        const marker = L.marker([branch.lat, branch.lng]).addTo(map);
        marker.bindPopup(`<b>${branch.city} Branch</b><br>PackUp Express Hub`);
        markers[branch.city] = marker; // Store marker to trigger it later
    });

    // C. Combined Search & List Function
    function updateBranchDisplay(filter = "") {
        listContainer.innerHTML = "";
        
        // Combine all cities for the list
        const allCities = [...branches.map(b => b.city), ...extraCities].sort();
        const filtered = allCities.filter(city => city.toLowerCase().includes(filter.toLowerCase()));

        filtered.forEach(city => {
            const item = document.createElement('div');
            item.className = "p-3 mb-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-orange/20 hover:border-orange/50 transition-all cursor-pointer flex items-center gap-3";
            item.innerHTML = `<i class="fas fa-location-dot text-orange"></i><span>${city}</span>`;
            
            item.onclick = () => {
                // If city has coordinates, fly to it on the map
                const geoData = branches.find(b => b.city === city);
                if (geoData) {
                    map.flyTo([geoData.lat, geoData.lng], 10);
                    markers[city].openPopup();
                } else {
                    // If no geo data, just scroll to contact
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
            };
            listContainer.appendChild(item);
        });
    }

    // D. Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => updateBranchDisplay(e.target.value));
    }
    
    updateBranchDisplay(); // Initial Load
});

// 8. Start the engine
window.addEventListener('DOMContentLoaded', init);

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i> Processing...';

        // 2. SEND DATA TO YOUR HOSTINGER SERVER (process.php)
        // save to leads.csv and email support@packupexpress.com
        fetch('process.php', { 
            method: 'POST', 
            body: new FormData(form)
        })
        .then(response => response.text())
        .then(data => {
            // TRIGGER WHATSAPP REDIRECT
            const name = encodeURIComponent(form.name.value);
            const phone = encodeURIComponent(form.phone.value);
            const from = encodeURIComponent(form.from.value);
            const to = encodeURIComponent(form.to.value);
            
            const whatsappNumber = "919327451665";
            const message = `Hi team!%0A*New Quote Request*%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Moving From:* ${from}%0A*Moving To:* ${to}`;
            
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

            alert("Success! Your request is recorded and we are opening WhatsApp for you.");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = "Request a Quote";
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Submission failed. Please try the WhatsApp button directly.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Try Again";
        });
    });
}
