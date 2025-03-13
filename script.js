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

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aqui você poderia adicionar o código para enviar o formulário via email
        // Como estamos usando apenas HTML/CSS/JS, podemos simular o envio
        
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Google Sheets API Integration for Events
async function loadEvents() {
    // URL da API SheetDB conectada à sua planilha do Google
    const sheetdbUrl = 'https://sheetdb.io/api/v1/5qkify7trsj77';
    
    try {
        // Fazer a requisição para a API SheetDB
        const response = await fetch(sheetdbUrl);
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        // Converter a resposta para JSON
        const events = await response.json();
        
        // Verificar se há eventos para exibir
        if (!events || events.length === 0) {
            document.getElementById('eventsList').innerHTML = `
                <p>Não há shows agendados no momento. Volte em breve para novidades!</p>
            `;
            return;
        }
        
        // Limpar a lista de eventos
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        // Ordenar eventos por data (do mais próximo para o mais distante)
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Criar elementos para cada evento
        events.forEach(event => {
            // Converter a string de data para objeto Date
            const date = new Date(event.date);
            
            // Verificar se a data é válida
            if (isNaN(date.getTime())) {
                console.error('Data inválida para o evento:', event);
                return; // Pular este evento
            }
            
            // Obter o dia e mês formatados
            const day = date.getDate();
            const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const month = monthNames[date.getMonth()];
            
            // Criar elemento do evento
            const eventItem = document.createElement('li');
            eventItem.className = 'event-item fade-in';
            
            // Definir o HTML interno do item
            eventItem.innerHTML = `
                <div class="event-date">
                    <div class="event-day">${day}</div>
                    <div class="event-month">${month}</div>
                </div>
                <div class="event-details">
                    <h3 class="event-title">${event.title || 'Evento'}</h3>
                    <p class="event-location">${event.location || 'Local a confirmar'}</p>
                </div>
                <div class="event-button">
                    <a href="${event.ticketLink || '#'}" class="btn btn-primary">
                        ${event.ticketLink ? 'Ingressos' : 'Em breve'}
                    </a>
                </div>
            `;
            
            // Adicionar o item à lista
            eventsList.appendChild(eventItem);
        });
        
        // Ativar animações
        animateOnScroll();
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        document.getElementById('eventsList').innerHTML = `
            <p>Não foi possível carregar os eventos. Por favor, tente novamente mais tarde.</p>
        `;
    }
}

// Carregar eventos ao abrir a página
window.addEventListener('load', loadEvents);