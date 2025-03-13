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





// Adicione este código ao seu arquivo script.js

// Configuração do FormSubmit para o formulário de contato
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar mensagem de loading
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Utilizar o serviço FormSubmit
        fetch('https://formsubmit.co/ajax/SEU_EMAIL@AQUI.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nome: contactForm.querySelector('input[name="nome"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                telefone: contactForm.querySelector('input[name="telefone"]').value,
                assunto: contactForm.querySelector('select[name="assunto"]').value,
                mensagem: contactForm.querySelector('textarea[name="mensagem"]').value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Exibir mensagem de sucesso
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
        })
        .catch(error => {
            console.error('Erro:', error);
            // Restaurar o botão e mostrar mensagem de erro
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
        });
    });
}