// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on Scroll
function animateOnScroll() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Música Play Buttons
const playButtons = document.querySelectorAll('.play-button');
playButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Aqui seria a implementação real para tocar a música
        // Como é apenas um demo, vamos mostrar uma mensagem
        alert('Tocando a música... (Esta funcionalidade seria implementada com uma API real de streaming)');
    });
});




// Configuração do Web3Forms para o formulário de contato
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar mensagem de loading
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Capturar todos os dados do formulário
        const formData = new FormData(contactForm);
        
        // Enviar formulário para Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Sucesso:', data);
                
                // Esconder os campos do formulário
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.display = 'none';
                });
                submitButton.style.display = 'none';
                
                // Criar e exibir a mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Mensagem enviada com sucesso!</h3>
                    <p>Agradecemos seu contato. Responderemos o mais breve possível.</p>
                    <button class="btn btn-primary mt-4" id="resetForm">Enviar outra mensagem</button>
                `;
                contactForm.appendChild(successMessage);
                
                // Configurar o botão para resetar o formulário
                document.getElementById('resetForm').addEventListener('click', function() {
                    contactForm.reset();
                    formGroups.forEach(group => {
                        group.style.display = 'block';
                    });
                    submitButton.style.display = 'block';
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    successMessage.remove();
                });
            } else {
                throw new Error(data.message || 'Erro ao enviar formulário');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            
            // Restaurar o botão e mostrar mensagem de erro
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Criar e mostrar mensagem de erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message mt-2';
            errorDiv.textContent = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.';
            submitButton.parentNode.insertBefore(errorDiv, submitButton.nextSibling);
            
            // Remover mensagem de erro após 5 segundos
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        });
    });
}