document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultsSection = document.getElementById('results');
    const originalImg = document.getElementById('original-img');
    const processBtn = document.getElementById('process-btn');
    const resetBtn = document.getElementById('reset-btn');
    const outputGrid = document.getElementById('output-grid');
    const toast = document.getElementById('toast');

    let currentFile = null;

    // --- Event Listeners ---

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    processBtn.addEventListener('click', () => {
        splitImage();
    });

    resetBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        dropZone.classList.remove('hidden');
        outputGrid.innerHTML = '';
        currentFile = null;
    });

    // --- Core logic ---

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file (PNG, JPG, WEBP).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImg.src = e.target.result;
            dropZone.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            // Auto-scroll to preview
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        };
        reader.readAsDataURL(file);
    }

    async function splitImage() {
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        outputGrid.innerHTML = '';

        const img = new Image();
        img.src = originalImg.src;

        await img.decode();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const sectionWidth = img.width / 2;
        const sectionHeight = img.height / 2;

        const positions = [
            { x: 0, y: 0, name: 'top-left' },
            { x: sectionWidth, y: 0, name: 'top-right' },
            { x: 0, y: sectionHeight, name: 'bottom-left' },
            { x: sectionWidth, y: sectionHeight, name: 'bottom-right' }
        ];

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            
            canvas.width = sectionWidth;
            canvas.height = sectionHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, pos.x, pos.y, sectionWidth, sectionHeight, 0, 0, sectionWidth, sectionHeight);

            // Compress and get data URL
            const blob = await compressImage(canvas);
            const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
            const url = URL.createObjectURL(blob);

            createResultCard(url, `${pos.name}.jpg`, sizeInMB, i);
        }

        processBtn.disabled = false;
        processBtn.textContent = 'Split & Optimize';
        showToast('Successfully split into 4 photos!');
    }

    /**
     * Compresses the canvas content to be less than 1MB
     */
    async function compressImage(canvas) {
        let quality = 0.95;
        let blob = await canvasToBlob(canvas, 'image/jpeg', quality);

        // Max size: 1MB (1,048,576 bytes)
        const MAX_SIZE = 1 * 1024 * 1024;

        while (blob.size > MAX_SIZE && quality > 0.1) {
            quality -= 0.1;
            blob = await canvasToBlob(canvas, 'image/jpeg', quality);
        }

        return blob;
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), type, quality);
        });
    }

    function createResultCard(url, filename, size, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${url}" alt="${filename}">
            <div class="result-info">
                <div class="file-info">
                    <strong>Photo ${index + 1}</strong>
                    <span>${size} MB</span>
                </div>
                <a href="${url}" download="${filename}" class="btn primary small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
            </div>
        `;

        outputGrid.appendChild(card);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
});
