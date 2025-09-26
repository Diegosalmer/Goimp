(function () {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnOB0i2mNa25tKVD3hhdNlOfKYxzT0K1dX-jDsFVsqDMpqPXRDmCFchJVaNx5DUUj5MA/exec';
    const modal = document.getElementById('demoModal');
    const openButton = document.querySelector('[data-modal-open]');
    const closeTriggers = modal.querySelectorAll('[data-modal-close]');
    const form = document.getElementById('demoForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;

    const openModal = () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 200);
        }
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const setLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Enviando...' : originalBtnText;
    };

    const handleSuccess = () => {
        alert('\u2714\uFE0F \u00A1Gracias! Pronto nos pondremos en contacto.');
        form.reset();
        closeModal();
    };

    const handleError = () => {
        alert('\u26A0\uFE0F Ocurri\u00F3 un error al enviar tu solicitud. Intenta de nuevo en unos segundos.');
    };

    openButton.addEventListener('click', openModal);

    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            setLoading(true);
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Response not ok');
            }

            handleSuccess();
        } catch (error) {
            console.error('Error enviando formulario:', error);
            handleError();
        } finally {
            setLoading(false);
        }
    });
})();
