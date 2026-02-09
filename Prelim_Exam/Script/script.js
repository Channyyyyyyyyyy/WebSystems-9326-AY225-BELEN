// ===== LocalStorage Management =====
const StorageManager = {
    // Save recent views for citizen preferences
    saveRecentView: function(type, data) {
        let recentViews = JSON.parse(localStorage.getItem('recentViews')) || [];
        recentViews.unshift({ type, data, timestamp: new Date().toISOString() });
        // Keep only last 10 views
        recentViews = recentViews.slice(0, 10);
        localStorage.setItem('recentViews', JSON.stringify(recentViews));
    },
    
    getRecentViews: function() {
        return JSON.parse(localStorage.getItem('recentViews')) || [];
    },
    
    // Save form data temporarily
    saveFormData: function(formId, data) {
        localStorage.setItem(`form_${formId}`, JSON.stringify(data));
    },
    
    getFormData: function(formId) {
        const data = localStorage.getItem(`form_${formId}`);
        return data ? JSON.parse(data) : null;
    },
    
    clearFormData: function(formId) {
        localStorage.removeItem(`form_${formId}`);
    }
};

// ===== News Data (simulating a news feed) =====
const newsData = [
    {
        id: 'featured-1',
        type: 'news',
        category: 'news',
        title: 'Bacoor City Launches New Digital Services Platform',
        excerpt: 'Mayor Strike Revilla unveils comprehensive e-governance initiative to make government services more accessible to residents through online portals and mobile applications.',
        content: 'In a groundbreaking move towards digital transformation, Bacoor City has officially launched its new Digital Services Platform, aimed at providing citizens with convenient access to various government services. Mayor Strike B. Revilla announced the initiative during a press conference at City Hall.\n\n"This is a significant step in our commitment to serve our constituents better. With this new platform, residents can now access services 24/7 from the comfort of their homes," Mayor Revilla stated.\n\nThe platform includes online applications for business permits, community tax certificates, appointment scheduling for health services, and a streamlined system for filing complaints and inquiries. The city government has invested significantly in IT infrastructure and staff training to ensure smooth implementation.',
        date: 'February 1, 2024',
        author: 'Public Information Office'
    },
    {
        id: 'news-1',
        type: 'news',
        category: 'news',
        title: 'New Public Market Opens in Barangay Molino III',
        excerpt: 'State-of-the-art public market facility now serving the community with modern amenities and improved vendor spaces.',
        date: 'January 28, 2024',
        author: 'City Information Office'
    },
    {
        id: 'news-2',
        type: 'announcement',
        category: 'announcement',
        title: 'Extended Hours for Business Permit Renewal',
        excerpt: 'City Hall extends operating hours until 7:00 PM for the month of February to accommodate business permit renewals.',
        date: 'January 25, 2024',
        author: 'Business Permits & Licensing Office'
    },
    {
        id: 'news-3',
        type: 'advisory',
        category: 'advisory',
        title: 'Scheduled Water Interruption - February 5-6',
        excerpt: 'Manila Water announces scheduled maintenance affecting Barangays Molino I-VI. Residents advised to store water.',
        date: 'January 23, 2024',
        author: 'City Disaster Risk Reduction Office'
    },
    {
        id: 'news-4',
        type: 'event',
        category: 'event',
        title: 'Annual Job Fair Set for February 14',
        excerpt: 'Over 50 companies to participate in Bacoor City Job Fair at Strike Sports Complex. Free admission for all job seekers.',
        date: 'January 20, 2024',
        author: 'Public Employment Service Office'
    },
    {
        id: 'news-5',
        type: 'news',
        category: 'news',
        title: 'City Government Distributes Scholarships to 500 Students',
        excerpt: 'Bacoor City provides educational assistance to deserving students from public elementary and high schools.',
        date: 'January 18, 2024',
        author: 'Education Office'
    },
    {
        id: 'news-6',
        type: 'announcement',
        category: 'announcement',
        title: 'Free Medical Check-ups at City Health Centers',
        excerpt: 'City Health Office offers complimentary medical consultations and basic health screenings throughout February.',
        date: 'January 15, 2024',
        author: 'City Health Office'
    }
];

// ===== Department Data =====
const departmentDetails = {
    mayor: {
        name: 'Office of the Mayor',
        head: 'Hon. Strike B. Revilla',
        description: 'The Office of the Mayor is the chief executive office of Bacoor City, responsible for implementing city ordinances, delivering basic services, and providing overall leadership in governance.',
        services: ['Policy Direction', 'Executive Orders', 'City Programs Implementation', 'Inter-agency Coordination'],
        hours: 'Monday - Friday, 8:00 AM - 5:00 PM',
        contact: '(046) 123-4567',
        email: 'mayor@bacoor.gov.ph'
    },
    health: {
        name: 'City Health Office',
        head: 'Dr. Maria Santos, City Health Officer',
        description: 'Responsible for implementing health programs, disease prevention, immunization, and primary healthcare services for all residents.',
        services: ['Medical Consultation', 'Immunization Programs', 'Prenatal Care', 'Dental Services', 'Health Certificates'],
        hours: 'Monday - Saturday, 8:00 AM - 4:00 PM',
        contact: '(046) 123-4570',
        email: 'health@bacoor.gov.ph'
    }
    // Add more as needed
};

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    // Load news feed on home page
    if (document.getElementById('newsFeed')) {
        loadNewsFeed();
    }
    
    // Load news grid on news page
    if (document.getElementById('newsGrid')) {
        loadNewsGrid();
    }
    
    // Check for saved form data
    checkSavedFormData();
    
    // Load recent views
    displayRecentViews();
    
    // Attach event listeners for tab buttons (service panels)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            showService(serviceId, this);
        });
    });
    
    // Attach event listeners for filter buttons (news)
    document.querySelectorAll('.filter-btn[data-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            filterNews(type);
        });
    });
    
    // Attach event listeners for department filter buttons
    document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Attach event listener for department search
    const deptSearch = document.getElementById('deptSearch');
    if (deptSearch) {
        deptSearch.addEventListener('input', filterDepartments);
    }
    
    // Attach event listener for search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Attach event listeners for form submissions
    document.querySelectorAll('.service-form').forEach(form => {
        form.addEventListener('submit', function(event) {
            const formType = this.closest('.service-panel').id;
            submitForm(event, formType);
        });
    });
});

// ===== News Feed Functions =====
function loadNewsFeed() {
    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;
    
    // Display first 3 news items
    const recentNews = newsData.slice(0, 3);
    
    newsFeed.innerHTML = recentNews.map(news => {
        const date = new Date(news.date);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        return `
            <div class="news-item" onclick="openNewsModal('${news.id}')">
                <div class="news-date-badge">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="news-content">
                    <h3>${news.title}</h3>
                    <p>${news.excerpt}</p>
                </div>
            </div>
        `;
    }).join('');
}

function loadNewsGrid() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    // Skip the featured item
    const gridNews = newsData.slice(1);
    
    newsGrid.innerHTML = gridNews.map(news => `
        <div class="news-card" data-type="${news.type}" onclick="openNewsModal('${news.id}')">
            <div class="news-card-header">
                <span class="news-category news-category-${news.type}">${news.type}</span>
                <div class="news-meta">
                    <span class="news-date">📅 ${news.date}</span>
                </div>
            </div>
            <div class="news-card-body">
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-excerpt">${news.excerpt}</p>
            </div>
        </div>
    `).join('');
}

// ===== News Modal Functions =====
function openNewsModal(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsModal');
    const modalBody = document.getElementById('newsModalBody');
    
    modalBody.innerHTML = `
        <span class="news-category news-category-${news.type}">${news.type}</span>
        <h2 style="font-family: var(--font-display); font-size: 32px; margin: 20px 0;">${news.title}</h2>
        <div class="news-meta" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);">
            <span class="news-date">📅 ${news.date}</span>
            <span class="news-author">👤 ${news.author}</span>
        </div>
        <div style="line-height: 1.8; color: var(--text-medium);">
            ${news.content ? news.content.split('\n\n').map(p => `<p style="margin-bottom: 20px;">${p}</p>`).join('') : news.excerpt}
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Save to recent views
    StorageManager.saveRecentView('news', { id: newsId, title: news.title });
}

function closeNewsModal() {
    const modal = document.getElementById('newsModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===== News Filtering =====
function filterNews(type) {
    const cards = document.querySelectorAll('.news-card');
    const buttons = document.querySelectorAll('.filter-btn[data-type]');
    
    // Update active button
    buttons.forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        if (type === 'all' || card.getAttribute('data-type') === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function loadMoreNews() {
    alert('Loading more news... (This would load additional news items from the server)');
}

// ===== Announcement Modal =====
function showAnnouncementModal(annId) {
    const announcements = {
        'ann-1': {
            title: 'Scheduled Water Interruption',
            content: 'Manila Water Company will conduct scheduled maintenance works on February 5-6, 2024, from 10:00 PM to 6:00 AM. Affected areas include Barangays Molino I, II, III, IV, V, and VI. Residents are advised to store sufficient water for the duration of the interruption.'
        },
        'ann-2': {
            title: 'Road Closure Advisory',
            content: 'Daang Hari Road (from Perpetual Help to SM Molino) will undergo repair and rehabilitation works until February 15, 2024. Alternative routes via Aguinaldo Highway and Marcos Alvarez Avenue are recommended. We apologize for any inconvenience.'
        },
        'ann-3': {
            title: 'Free Vaccination Program',
            content: 'The City Health Office is offering free vaccines for children (measles, polio, etc.) and senior citizens (flu shots, pneumonia vaccines) at all city health centers. Bring valid ID and health records. Schedule: Monday to Friday, 8:00 AM - 3:00 PM.'
        }
    };
    
    const announcement = announcements[annId];
    if (!announcement) return;
    
    const modal = document.getElementById('newsModal');
    const modalBody = document.getElementById('newsModalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 64px; margin-bottom: 16px;">⚠️</div>
            <h2 style="font-family: var(--font-display); font-size: 28px;">${announcement.title}</h2>
        </div>
        <div style="line-height: 1.8; color: var(--text-medium);">
            <p>${announcement.content}</p>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ===== Department Functions =====
function filterDepartments() {
    const searchTerm = document.getElementById('deptSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.dept-card');
    const noResults = document.getElementById('noResults');
    let hasResults = false;
    
    cards.forEach(card => {
        const name = card.querySelector('.dept-name').textContent.toLowerCase();
        const desc = card.querySelector('.dept-desc').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || desc.includes(searchTerm)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    noResults.style.display = hasResults ? 'none' : 'block';
}

function filterByCategory(category) {
    const cards = document.querySelectorAll('.dept-card');
    const buttons = document.querySelectorAll('.filter-btn[data-category]');
    const noResults = document.getElementById('noResults');
    let hasResults = false;
    
    // Update active button
    buttons.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    noResults.style.display = hasResults ? 'none' : 'block';
}

function showDeptDetails(deptId) {
    const dept = departmentDetails[deptId];
    if (!dept) {
        alert('Department information coming soon!');
        return;
    }
    
    const modal = document.getElementById('deptModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 28px; margin-bottom: 20px;">${dept.name}</h2>
        <div style="margin-bottom: 20px;">
            <strong style="color: var(--text-dark);">Department Head:</strong>
            <p style="color: var(--text-medium); margin-top: 4px;">${dept.head}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <strong style="color: var(--text-dark);">Description:</strong>
            <p style="color: var(--text-medium); margin-top: 4px; line-height: 1.7;">${dept.description}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <strong style="color: var(--text-dark);">Services Offered:</strong>
            <ul style="margin-top: 8px; padding-left: 20px; color: var(--text-medium);">
                ${dept.services.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
            </ul>
        </div>
        <div style="background: var(--bg-light); padding: 20px; border-radius: 8px; margin-top: 24px;">
            <div style="margin-bottom: 12px;"><strong>Office Hours:</strong> ${dept.hours}</div>
            <div style="margin-bottom: 12px;"><strong>Contact:</strong> ${dept.contact}</div>
            <div><strong>Email:</strong> ${dept.email}</div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Save to recent views
    StorageManager.saveRecentView('department', { id: deptId, name: dept.name });
}

function closeModal() {
    const modal = document.getElementById('deptModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== Service Form Functions =====
function showService(serviceId, button) {
    const panels = document.querySelectorAll('.service-panel');
    const buttons = document.querySelectorAll('.tab-btn');
    
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(serviceId).classList.add('active');
    button.classList.add('active');
    
    // Save preference
    StorageManager.saveRecentView('service', { id: serviceId });
}

function submitForm(event, formType) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--danger)';
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Generate reference number
    const refNumber = 'BCR-' + Date.now().toString().slice(-8);
    
    // Save submission (in real app, this would go to server)
    localStorage.setItem('lastSubmission', JSON.stringify({
        formType,
        data,
        refNumber,
        timestamp: new Date().toISOString()
    }));
    
    // Show success modal
    showSuccessModal(formType, refNumber);
    
    // Clear form
    form.reset();
    
    // Clear saved form data
    StorageManager.clearFormData(formType);
}

function showSuccessModal(formType, refNumber) {
    const messages = {
        'business-permit': `Your business permit application has been submitted successfully. Your reference number is <strong>${refNumber}</strong>. You will receive an email confirmation shortly.`,
        'cedula': `Your Community Tax Certificate application has been submitted. Reference number: <strong>${refNumber}</strong>. Please check your email for payment instructions.`,
        'health': `Your health service appointment has been booked. Reference number: <strong>${refNumber}</strong>. We'll send you a confirmation email with the appointment details.`,
        'complaints': `Your complaint has been filed successfully. Reference number: <strong>${refNumber}</strong>. You can track the status of your complaint using this reference number.`
    };
    
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    message.innerHTML = messages[formType] || 'Your submission was successful!';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===== Search Function =====
function performSearch() {
    const searchTerm = document.getElementById('headerSearch').value.toLowerCase();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    // Save search to localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.unshift(searchTerm);
    searchHistory = searchHistory.slice(0, 10); // Keep last 10 searches
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // In a real application, this would search the entire site
    alert(`Searching for: "${searchTerm}"\n\nThis would display search results across all pages.`);
}

// ===== Form Auto-save =====
function checkSavedFormData() {
    const forms = document.querySelectorAll('.service-form');
    
    forms.forEach(form => {
        const formId = form.closest('.service-panel').id;
        const savedData = StorageManager.getFormData(formId);
        
        if (savedData) {
            const restore = confirm('You have unsaved form data. Would you like to restore it?');
            if (restore) {
                Object.keys(savedData).forEach(key => {
                    const field = form.querySelector(`[id="${key}"]`);
                    if (field) {
                        field.value = savedData[key];
                    }
                });
            } else {
                StorageManager.clearFormData(formId);
            }
        }
        
        // Auto-save on input
        form.addEventListener('input', function() {
            const formData = {};
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    formData[input.id] = input.value;
                }
            });
            StorageManager.saveFormData(formId, formData);
        });
    });
}

// ===== Recent Views Display =====
function displayRecentViews() {
    const recentViews = StorageManager.getRecentViews();
    
    if (recentViews.length > 0) {
        console.log('Recent Views:', recentViews);
        // In a real app, this could display a "Recently Viewed" section
    }
}

// ===== Close modals on outside click =====
window.onclick = function(event) {
    const newsModal = document.getElementById('newsModal');
    const deptModal = document.getElementById('deptModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === newsModal) {
        closeNewsModal();
    }
    if (event.target === deptModal) {
        closeModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
};

// ===== Smooth Scrolling for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== Input Validation Helpers =====
document.addEventListener('DOMContentLoaded', function() {
    // Phone number validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    });
    
    // Email validation styling
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
});