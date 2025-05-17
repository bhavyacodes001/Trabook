// Authentication functionality for Trabook

// Store users in localStorage for demo purposes
// In a real application, this would be handled by a backend server
const users = JSON.parse(localStorage.getItem('users')) || [];

// Function to show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set icon based on type
    let icon = '💬';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    // Add toast to container
    container.appendChild(toast);
    
    // Add event listener for close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        container.removeChild(toast);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 3000);
}

// Function to register a new user
function registerUser(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Simple validation
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        name,
        email,
        password // In a real app, this should be hashed
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear form
    document.getElementById('signup-form').reset();
    
    // Close modal
    closeModal('signup-modal');
    
    // Show success message
    showToast('Registration successful! You can now log in.', 'success');
}

// Function to login
function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store logged in user info
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        
        // Close modal
        closeModal('login-modal');
        
        // Update UI
        updateAuthUI();
        
        // Show success message
        showToast(`Welcome back, ${user.name}! Login successful.`, 'success');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

// Function to logout
function logoutUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const name = currentUser ? currentUser.name : '';
    
    localStorage.removeItem('currentUser');
    updateAuthUI();
    
    showToast(`Goodbye, ${name}! You've been logged out.`, 'info');
}

// Function to update UI based on auth state
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authDiv = document.querySelector('.auth');
    
    if (currentUser) {
        authDiv.innerHTML = `
            <span class="user-name">${currentUser.name}</span>
            <a href="#" class="logout" onclick="logoutUser()">Logout</a>
        `;
    } else {
        authDiv.innerHTML = `
            <a href="#" class="login" onclick="showModal('login-modal')">Login</a>
            <a href="#" class="signup" onclick="showModal('signup-modal')">Sign Up</a>
        `;
    }
}

// Initialize auth UI when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for form submission
    document.getElementById('login-form').addEventListener('submit', loginUser);
    document.getElementById('signup-form').addEventListener('submit', registerUser);
    
    // Set up event listeners for modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
    
    // Update auth UI
    updateAuthUI();
}); 