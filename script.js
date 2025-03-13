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

// Função para carregar eventos da API SheetDB
async function loadEvents() {
    try {
        // Referência à lista de eventos
        const eventsList = document.getElementById('eventsList');
        
        // URL da API SheetDB conectada à planilha
        const sheetdbUrl = 'https://sheetdb.io/api/v1/5qkify7trsj77';
        
        // Fazer a requisição para a API SheetDB
        const response = await fetch(sheetdbUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // Adicionar modo no-cors para tentar evitar problemas de CORS
            // Nota: em produção, isso pode não ser necessário
            mode: 'cors',
            cache: 'no-cache'
        });
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        // Converter a resposta para JSON
        const events = await response.json();
        
        // Verificar se há eventos para exibir
        if (!events || events.length === 0) {
            eventsList.innerHTML = `
                <div class="text-center">
                    <p>Não há shows agendados no momento. Fique atento para novidades!</p>
                </div>
            `;
            return;
        }
        
        // Limpar a lista de eventos e remover mensagem de carregamento
        eventsList.innerHTML = '';
        
        // Ordenar eventos por data (do mais próximo para o mais distante)
        // Ajuste para o formato de data usado na sua planilha (DD/MM/YYYY)
        events.sort((a, b) => {
            const dateA = convertDate(a.date);
            const dateB = convertDate(b.date);
            return dateA - dateB;
        });
        
        // Criar elementos para cada evento
        events.forEach(event => {
            // Converter a string de data para objeto Date
            const date = convertDate(event.date);
            
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
                    <a href="${event.ticketLink || '#'}" class="btn btn-primary" ${!event.ticketLink ? 'disabled' : ''}>
                        ${event.ticketLink ? 'Ingressos' : 'Em breve'}
                    </a>
                </div>
            `;
            
            // Adicionar o item à lista
            eventsList.appendChild(eventItem);
        });
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        
        // Exibir mensagem de erro para o usuário
        document.getElementById('eventsList').innerHTML = `
            <div class="text-center">
                <p>Não foi possível carregar a agenda de shows. Por favor, tente novamente mais tarde.</p>
                <button id="retryLoadEvents" class="btn btn-outline mt-4">Tentar novamente</button>
            </div>
        `;
        
        // Configurar botão para tentar novamente
        document.getElementById('retryLoadEvents')?.addEventListener('click', loadEvents);
    }
    
    // Ativar animações
    animateOnScroll();
}

// Função auxiliar para converter string de data no formato DD/MM/YYYY para objeto Date
function convertDate(dateString) {
    // Verificar se a data está no formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const parts = dateString.split('/');
        // Criar data no formato MM/DD/YYYY (formato aceito pelo construtor Date)
        return new Date(parts[2], parts[1] - 1, parts[0]);
    } 
    // Se estiver no formato YYYY-MM-DD (ISO)
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return new Date(dateString);
    }
    // Tentar converter diretamente (caso seja outro formato)
    return new Date(dateString);
}

// Carregar eventos ao abrir a página
window.addEventListener('load', loadEvents);