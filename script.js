// script.js PackUp Express Logic
const scriptURL = 'https://script.google.com/macros/s/AKfycbw9mtTBxAnNGufGoPFnV9ucoRHgcMHIrWSPLiW2vaw_VQ0Zm4qBczYF7HjRicvCIeLf/exec';
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const sheetId = '1vXFSaq1xQIng77Kfzyvd4Z6RpQdZuYDQ6buil-NvxrA';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
let allBlogs = [];

// 2. FETCH DATA FROM GOOGLE
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

// Start the engine
window.addEventListener('DOMContentLoaded', init);

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i> Processing...';

        // SEND DATA TO GOOGLE SHEETS & GMAIL
        fetch(scriptURL, { 
            method: 'POST', 
            body: new FormData(form)
        })
        .then(response => {
            // TRIGGER WHATSAPP REDIRECT
            const name = encodeURIComponent(form.name.value);
            const phone = encodeURIComponent(form.phone.value);
            const from = encodeURIComponent(form.from.value);
            const to = encodeURIComponent(form.to.value);
            
            const whatsappNumber = "919877689137";
            const message = `Hi team!%0AName: ${name}%0APhone: ${phone}%0AMoving From: ${from}%0AMoving To: ${to}`;
            
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

            alert("Success! Your request is recorded. Redirecting to WhatsApp...");
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