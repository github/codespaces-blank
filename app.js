document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const loginStatusDiv = document.getElementById('login-status');
    const scanResultDiv = document.getElementById('scan-result');

    // Login form handler
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginStatusDiv.className = 'info';
        loginStatusDiv.textContent = 'Memverifikasi kredensial...';

        try {
            const formData = new FormData(loginForm);
            const data = new URLSearchParams(formData);

            const response = await fetch('/cgi-bin/auth.cgi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            
            if (result.status === 'success') {
                loginStatusDiv.textContent = result.message;
                loginStatusDiv.className = 'success';
                // Optional: redirect after successful login
                // setTimeout(() => window.location.href = '/dashboard.html', 1000);
            } else {
                loginStatusDiv.textContent = `Gagal: ${result.message}`;
                loginStatusDiv.className = 'error';
            }

        } catch (error) {
            console.error('Login Error:', error);
            loginStatusDiv.textContent = 'Terjadi kesalahan saat mencoba login.';
            loginStatusDiv.className = 'error';
        }
    });

    // File upload and scan form handler
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('fileUpload');
        
        if (fileInput.files.length === 0) {
            scanResultDiv.textContent = 'Silakan pilih file terlebih dahulu.';
            scanResultDiv.className = 'error';
            return;
        }
        
        scanResultDiv.className = 'info';
        scanResultDiv.textContent = 'Mengunggah dan memindai file...';

        try {
            const formData = new FormData(uploadForm);
            const response = await fetch('/cgi-bin/auth.cgi', {
                method: 'POST',
                body: formData
                // Note: Don't manually set Content-Type for multipart/form-data
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            
            if (result.status === 'clean') {
                scanResultDiv.textContent = `Hasil: ${result.message}`;
                scanResultDiv.className = 'success';
            } else {
                scanResultDiv.textContent = `Hasil: ${result.message}`;
                scanResultDiv.className = 'error';
            }

        } catch (error) {
            console.error('Upload Error:', error);
            scanResultDiv.textContent = 'Terjadi kesalahan saat mengunggah atau memindai file.';
            scanResultDiv.className = 'error';
        }
    });
});