document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('coverForm');
    const profilePreview = document.getElementById('profilePreview');
    const exportBtn = document.getElementById('exportBtn');
    const coverCard = document.getElementById('coverCard');
    const coverStyle = document.getElementById('coverStyle');
    const photoPosition = document.getElementById('photoPosition');
    const colorPickerGroup = document.getElementById('colorPickers');
    const addColorBtn = document.getElementById('addColorBtn');

    const fields = {
        full_name: document.getElementById('previewName'),
        profession: document.getElementById('previewProfession'),
        about_me: document.getElementById('previewAbout'),
        skills: document.getElementById('previewSkills'),
        phone: document.getElementById('previewPhone'),
        email: document.getElementById('previewEmail'),
        location: document.getElementById('previewLocation'),
        social_handle: document.getElementById('previewSocial')
    };

    function getSelectedMode() {
        return document.querySelector('input[name="outputMode"]:checked')?.value || 'image';
    }

    function updateModeUI() {
        const mode = getSelectedMode();
        exportBtn.textContent = mode === 'pdf' ? 'Save as PDF' : 'Download Image';

        document.querySelectorAll('.mode-option').forEach((label) => {
            const radio = label.querySelector('input');
            label.classList.toggle('active', radio.checked);
        });
    }

    function hexToRgb(hex) {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function getLuminance(hex) {
        const { r, g, b } = hexToRgb(hex);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    function getReadableTextColor(colors) {
        const averageLuminance = colors.reduce((total, color) => total + getLuminance(color), 0) / colors.length;
        return averageLuminance > 0.6 ? '#0f172a' : '#f8fafc';
    }

    function applyPhotoPlacement() {
        const position = photoPosition.value || 'left';
        coverCard.classList.remove('photo-left', 'photo-right', 'photo-center');
        coverCard.classList.add(`photo-${position}`);
    }

    function applyCoverTheme() {
        const style = coverStyle.value;
        const colors = [...colorPickerGroup.querySelectorAll('input[type="color"]')].map((input) => input.value);

        coverCard.classList.remove('modern', 'classic', 'glass', 'minimal');
        coverCard.classList.add(style);

        const gradient = colors.length > 1
            ? `linear-gradient(135deg, ${colors.join(', ')})`
            : `linear-gradient(135deg, ${colors[0] || '#0f172a'}, #1e293b)`;

        coverCard.style.background = gradient;
        coverCard.style.setProperty('--card-accent', colors[1] || colors[0] || '#2563eb');
        coverCard.style.setProperty('--card-soft', colors[colors.length - 1] || '#bfdbfe');

        const accentColor = colors[1] || colors[0] || '#2563eb';
        const textColor = getReadableTextColor(colors);
        const softAccent = getLuminance(accentColor) > 0.6 ? '#111827' : '#dbeafe';
        const borderColor = colors[colors.length - 1] || colors[0] || '#ffffff';

        coverCard.style.color = textColor;
        coverCard.querySelector('.title-wrap p').style.color = softAccent;
        coverCard.querySelectorAll('.cover-section h3, .contact-grid span').forEach((el) => {
            el.style.color = softAccent;
        });
        document.getElementById('profilePreview').style.borderColor = borderColor;
    }

    function addColorPicker() {
        const currentCount = colorPickerGroup.querySelectorAll('input[type="color"]').length;
        if (currentCount >= 5) {
            return;
        }

        const label = document.createElement('label');
        label.className = 'color-input';

        const input = document.createElement('input');
        input.type = 'color';
        input.value = ['#0f172a', '#2563eb', '#7c3aed', '#10b981', '#f59e0b'][currentCount % 5];
        input.name = `color${currentCount + 1}`;
        input.addEventListener('input', applyCoverTheme);

        label.appendChild(input);
        colorPickerGroup.appendChild(label);
        applyCoverTheme();
    }

    function downloadImage() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = () => {
            html2canvas(coverCard, { backgroundColor: '#0f172a', scale: 2 }).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'cover-page.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        };
        document.body.appendChild(script);
    }

    function saveAsPdf() {
        window.print();
    }

    function handleExport() {
        const mode = getSelectedMode();
        if (mode === 'pdf') {
            saveAsPdf();
        } else {
            downloadImage();
        }
    }

    function updatePreview() {
        const formData = new FormData(form);

        const platform = formData.get('social_platform')?.toString().trim() || 'Instagram';
        const socialHandle = formData.get('social_handle')?.toString().trim() || '@username';
        const socialText = `${platform}: ${socialHandle}`;

        for (const [name, element] of Object.entries(fields)) {
            const value = formData.get(name)?.toString().trim();

            if (name === 'full_name' && value) {
                element.textContent = value;
            } else if (name === 'full_name' && !value) {
                element.textContent = 'Your Full Name';
            }

            if (name === 'profession' && value) {
                element.textContent = value;
            } else if (name === 'profession' && !value) {
                element.textContent = 'Profession / Course';
            }

            if (name === 'about_me' && value) {
                element.textContent = value;
            } else if (name === 'about_me' && !value) {
                element.textContent = 'Write something about yourself here.';
            }

            if (name === 'skills' && value) {
                element.textContent = value;
            } else if (name === 'skills' && !value) {
                element.textContent = 'Your skills';
            }

            if (['phone', 'email', 'location'].includes(name) && value) {
                element.textContent = value;
            } else if (name === 'phone' && !value) {
                element.textContent = '+000 000 000';
            } else if (name === 'email' && !value) {
                element.textContent = 'your@email.com';
            } else if (name === 'location' && !value) {
                element.textContent = 'Your location';
            }

            if (name === 'social_handle') {
                element.textContent = socialText;
            }
        }

        const fileInput = document.getElementById('profilePhoto');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (event) {
                profilePreview.src = event.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }

    for (const input of form.querySelectorAll('input, textarea, select')) {
        if (input.type === 'color') {
            input.addEventListener('input', applyCoverTheme);
        } else if (input.tagName === 'SELECT') {
            if (input.id === 'photoPosition') {
                input.addEventListener('change', applyPhotoPlacement);
            } else {
                input.addEventListener('change', applyCoverTheme);
            }
        } else {
            input.addEventListener('input', updatePreview);
        }
    }

    document.getElementById('profilePhoto').addEventListener('change', updatePreview);
    document.querySelectorAll('input[name="outputMode"]').forEach((radio) => {
        radio.addEventListener('change', updateModeUI);
    });

    addColorBtn.addEventListener('click', addColorPicker);
    exportBtn.addEventListener('click', handleExport);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        updatePreview();
    });

    applyPhotoPlacement();
    applyCoverTheme();
    updateModeUI();
});
