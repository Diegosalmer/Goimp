(() => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJVN9yQtMHwZQh1QKBg_RzMZOqeQDf59WQ4o5bw0bxx0VP2KsPqctlAr72_eBzOMjCOQ/exec';
    const modal = document.getElementById('demoModal');
    const openButton = document.querySelector('[data-modal-open]');
    const closeTriggers = Array.from(document.querySelectorAll('[data-modal-close]'));
    const form = document.getElementById('demoForm');
    const submitBtn = form.querySelector('.submit-btn');
    const feedback = document.querySelector('.form-feedback');
    const originalBtnText = submitBtn.textContent;
    let lastFocusedElement = null;

    const openModal = () => {
        lastFocusedElement = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input');
        window.setTimeout(() => firstInput?.focus(), 200);
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        window.setTimeout(() => lastFocusedElement?.focus?.(), 120);
    };

    const setLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Enviando...' : originalBtnText;
        form.querySelectorAll('input').forEach(input => {
            input.readOnly = isLoading;
        });
    };

    const clearFeedback = () => {
        if (!feedback) return;
        feedback.textContent = '';
        feedback.classList.remove('is-visible', 'is-success', 'is-error');
    };

    const showFeedback = (message, type) => {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.classList.remove('is-success', 'is-error');
        if (type === 'success') {
            feedback.classList.add('is-success');
        }
        if (type === 'error') {
            feedback.classList.add('is-error');
        }
        feedback.classList.add('is-visible');
    };

    const sendFormData = async (formData) => {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`Unhandled status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.warn('Falling back to no-cors submission', error);
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: new FormData(form)
            });
            return true;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearFeedback();

        const formData = new FormData(form);

        try {
            setLoading(true);
            await sendFormData(formData);
            showFeedback('\u00A1Gracias! Pronto nos pondremos en contacto.', 'success');
            form.reset();
            window.setTimeout(() => closeModal(), 1000);
        } catch (error) {
            console.error('Error enviando formulario:', error);
            showFeedback('No pudimos enviar tu solicitud. Int\u00E9ntalo nuevamente en unos segundos.', 'error');
        } finally {
            setLoading(false);
        }
    };

    openButton?.addEventListener('click', () => {
        clearFeedback();
        openModal();
    });

    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            clearFeedback();
            closeModal();
        });
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            clearFeedback();
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            clearFeedback();
            closeModal();
        }
    });

    form.addEventListener('submit', handleSubmit);
})();





