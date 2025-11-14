/* ========================================================================
   Arquivo: assets/js/script.js
   Descrição: Script unificado para I.
   Organizado por funcionalidade (Módulos)
   ======================================================================== */

// IIFE (Immediately Invoked Function Expression) para criar um escopo local
(function() {

  // Espera o DOM carregar
  document.addEventListener('DOMContentLoaded', function() {
    
    // Inicia os módulos principais
    MenuModule.init();
    SPARouter.init();
    ThemeModule.init();
    
    // O FormModule será inicializado pelo SPARouter QUANDO a página de cadastro for carregada
    
  });

  /* ========================================================================
     1. MÓDULO DE NAVEGAÇÃO (Menu Hamburger)
     (Funcionalidade da )
     ======================================================================== */
  
  const MenuModule = {
    navToggle: null,
    mainNav: null,
    
    init: function() {
      this.navToggle = document.querySelector('.nav-toggle');
      this.mainNav = document.querySelector('.main-nav');
      
      if (this.navToggle && this.mainNav) {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
      }
      
      // Fecha o menu ao clicar em um link da SPA
      this.mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    },
    
    toggleMenu: function() {
      this.mainNav.classList.toggle('active');
      this.navToggle.classList.toggle('active');
    },
    
    closeMenu: function() {
      if (this.mainNav.classList.contains('active')) {
        this.mainNav.classList.remove('active');
        this.navToggle.classList.remove('active');
      }
    },
    });
    }, // <-- Fim da função toggleMenu()

    closeMenu: function() {
      // ... (código existente da closeMenu)
    }, // <-- Fim da função closeMenu()

    // COLE O NOVO CÓDIGO A PARTIR DAQUI
    initDropdownAccessibility: function() {
      const dropdownLink = document.getElementById('projetos-link');
      const submenu = document.getElementById('submenu-projetos');

      if (!dropdownLink || !submenu) return;

      dropdownLink.addEventListener('keydown', (e) => {
        // Se pressionar Seta para Baixo, abre o menu e foca no primeiro item
        if (e.key === 'ArrowDown') {
          e.preventDefault(); // Impede a página de rolar
          dropdownLink.setAttribute('aria-expanded', 'true');
          submenu.querySelector('a').focus(); // Foca no primeiro link do submenu
        }
      });

      const submenuItems = submenu.querySelectorAll('a');
      submenuItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            // Se pressionar Escape, fecha o menu e foca de volta no link "Projetos"
            e.preventDefault();
            dropdownLink.setAttribute('aria-expanded', 'false');
            dropdownLink.focus();
          }
          if (e.key === 'ArrowDown') {
            // Move para o próximo item
            e.preventDefault();
            if (index < submenuItems.length - 1) {
              submenuItems[index + 1].focus();
            }
          }
          if (e.key === 'ArrowUp') {
            // Move para o item anterior
            e.preventDefault();
            if (index > 0) {
              submenuItems[index - 1].focus();
            }
          }
        });
      });

      // Fecha o menu se o foco sair (ex: Tabbing para fora)
      submenu.addEventListener('focusout', (e) => {
        // `relatedTarget` é o elemento que *recebeu* o foco
        if (!submenu.contains(e.relatedTarget)) {
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });
    }

  };

  /* ========================================================================
     2. MÓDULO DE FORMULÁRIO (Máscaras e Validação)
     (Funcionalidades das Entregas I, II e III)
     ======================================================================== */
     
  const FormModule = {
    
    init: function() {
      // Esta função é chamada pelo Router QUANDO o formulário é carregado
      const form = document.getElementById('formCadastro');
      if (!form) return;
      
      // 1. Aplica as Máscaras
      this.applyMasks();
      
      // 2. Aplica a Validação (com a nova verificação de consistência)
      const inputs = form.querySelectorAll('input[required]');
      inputs.forEach(input => {
        input.addEventListener('blur', (e) => this.validateField(e.target));
      });
    },
    
    applyMasks: function() {
      // ... (código das máscaras da ) ...
      const inputCpf = document.getElementById('cpf');
      const inputTelefone = document.getElementById('telefone');
      const inputCep = document.getElementById('cep');

      if (inputCpf) inputCpf.addEventListener('input', this.maskCPF);
      if (inputTelefone) inputTelefone.addEventListener('input', this.maskTelefone);
      if (inputCep) inputCep.addEventListener('input', this.maskCEP);
    },
    
    maskCPF: function(e) {
      let value = e.target.value.replace(/\D/g, '').substring(0, 11);
      if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      e.target.value = value;
    },
    
    maskTelefone: function(e) {
      let value = e.target.value.replace(/\D/g, '').substring(0, 11);
      if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      else if (value.length > 6) value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (value.length > 0) value = value.replace(/(\d{0,2})/, '($1');
      e.target.value = value;
    },
    
    maskCEP: function(e) {
      let value = e.target.value.replace(/\D/g, '').substring(0, 8);
      if (value.length > 5) value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      e.target.value = value;
    },
    
    validateField: function(input) {
      // 1. Pega o elemento de erro (agora todos têm um)
      const errorId = input.getAttribute('aria-describedby');
      const errorElement = errorId ? document.getElementById(errorId) : null;
      
      if (!errorElement) return;

      let errorMessage = '';

      // 2. Validação padrão do HTML5 (required, pattern, type)
      if (!input.checkValidity()) {
        if (input.validity.valueMissing) errorMessage = 'Este campo é obrigatório.';
        else if (input.validity.patternMismatch) errorMessage = `Formato inválido. Use o formato: ${input.placeholder}`;
        else if (input.validity.typeMismatch) errorMessage = 'Por favor, insira um e-mail válido.';
      }
      
      // 3. [I] - Verificação de Consistência de Dados
      if (input.id === 'nascimento' && input.value) {
        const dataNascimento = new Date(input.value);
        const hoje = new Date();
        
        // Ajusta para comparar apenas datas (ignora fuso horário/hora)
        dataNascimento.setUTCHours(0, 0, 0, 0);
        hoje.setUTCHours(0, 0, 0, 0);

        if (dataNascimento > hoje) {
          errorMessage = 'Data inválida. A data de nascimento não pode ser no futuro.';
        }
      }

      // 4. Atualiza a UI (Classes e Mensagens)
      if (errorMessage) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
      } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }
  };

  /* ========================================================================
     3. MÓDULO DE TEMPLATES
     (Funcionalidade da I - "Sistema de templates JavaScript")
     ======================================================================== */
     
  const TemplateModule = {
    
    // Esta função recebe 1 objeto de projeto (do JSON) e retorna o HTML do card
    buildProjectCard: function(projeto) {
      
      // Operador ternário para lidar com o card sem imagem
      const imagemHTML = projeto.imagem_jpg
        ? `
        <picture class="card-image">
          <source srcset="${projeto.imagem_webp}" type="image/webp">
          <source srcset="${projeto.imagem_jpg}" type="image/jpeg">
          <img src="${projeto.imagem_jpg}" alt="${projeto.alt}">
        </picture>
        `
        : ''; // Retorna string vazia se não houver imagem

      // Mapeia os dados das tags para HTML
      const tagsHTML = projeto.tags.map(tag => 
        `<span class="badge ${tag.classe}">${tag.label}</span>`
      ).join(''); // .join() junta o array de strings em uma string só
      
      // Retorna o template literal do card completo
      return `
        <article class="card">
          ${imagemHTML}
          <div class="card-body">
            <h3>${projeto.titulo}</h3>
            <p>${projeto.descricao}</p>
          </div>
          <footer class="card-footer">
            ${tagsHTML}
          </footer>
        </article>
      `;
    }
  };

  /* ========================================================================
     4. MÓDULO ROTEADOR DA SPA
     (Funcionalidade da I - "Sistema de SPA básico")
     ======================================================================== */
     
  /* ========================================================================
   4. MÓDULO ROTEADOR DA SPA
   (Funcionalidade da I - "Sistema de SPA básico")
   [CORRIGIDO PARA LIDAR COM ÂNCORAS / SCROLL]
   ======================================================================== */
   
const SPARouter = {
  contentArea: null,
  
  init: function() {
    this.contentArea = document.getElementById('main-content-area');
    if (!this.contentArea) {
      console.error("Erro: Área de conteúdo principal 'main-content-area' não encontrada.");
      return;
    }
    
    // Ouve mudanças na URL (ex: #inicio -> #projetos)
    window.addEventListener('hashchange', () => this.route());
    
    // Carrega a rota inicial (ou a página inicial se não houver hash)
    this.route();
  },
  
  route: function() {
    let hash = window.location.hash;
    
    if (!hash) {
      hash = '#inicio';
    }
    
    // [CORREÇÃO] Pega a rota principal E a âncora (ex: #projetos e #acoes-sociais)
    const parts = hash.substring(1).split('#'); // ex: ["projetos", "acoes-sociais"]
    const mainRoute = parts[0]; // ex: "projetos"
    const anchor = parts[1] || null;  // ex: "acoes-sociais" ou null
    
    // Carrega o conteúdo baseado no hash
    switch (mainRoute) {
      case 'inicio':
        this.loadHTML('inicio.html', 'body > *', null, anchor);
        break;
      case 'projetos':
        this.loadProjects(anchor); // Passa a âncora para a função
        break;
      case 'cadastro':
        // Passa a âncora e o callback
        this.loadHTML('cadastro.html', 'body > *', () => FormModule.init(), anchor);
        break;
      default:
        this.loadHTML('inicio.html', 'body > *', null, anchor);
    }
  },
  
  // [CORREÇÃO] Função de scroll para âncora
  scrollToAnchor: function(anchorId) {
    // Usa um setTimeout de 100ms. Isso dá ao navegador tempo
    // para renderizar o novo conteúdo (HTML/Cards) ANTES de
    // tentarmos rolar para um ID dentro dele.
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },
  
  // [CORREÇÃO] loadHTML agora aceita a âncora
  loadHTML: async function(url, selector, callback, anchor) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Não foi possível carregar o conteúdo.');
      
      const text = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const content = doc.querySelector(selector);
      
      if (content) {
        this.contentArea.innerHTML = '';
        doc.querySelectorAll(selector).forEach(node => {
          this.contentArea.appendChild(node.cloneNode(true));
        });
      } else {
        this.contentArea.innerHTML = '<p>Erro: Conteúdo não encontrado.</p>';
      }
      
      if (callback) callback();
      
      // [CORREÇÃO] Tenta rolar para a âncora depois que o HTML for carregado
      if (anchor) {
        this.scrollToAnchor(anchor);
      }
      
    } catch (error) {
      console.error('Erro ao carregar página:', error);
      this.contentArea.innerHTML = '<p>Erro ao carregar o conteúdo. Tente novamente.</p>';
    }
  },
  
  // [CORREÇÃO] loadProjects agora aceita a âncora
  loadProjects: async function(anchor) {
    // 1. Carrega o "esqueleto" da página de projetos
    // (Não passamos a âncora aqui, pois o conteúdo final (cards)
    // ainda não foi carregado)
    await this.loadHTML('projetos.html', 'body > *');
    
    // 2. Agora, busca os dados JSON
    try {
      const response = await fetch('assets/data/projetos.json');
      if (!response.ok) throw new Error('Não foi possível carregar os dados dos projetos.');
      
      const projetos = await response.json();
      
      const grid = document.getElementById('project-card-grid');
      if (grid) {
        grid.innerHTML = '';
        
        projetos.forEach(projeto => {
          const cardHTML = TemplateModule.buildProjectCard(projeto);
          grid.innerHTML += cardHTML;
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos projetos:', error);
      const grid = document.getElementById('project-card-grid');
      if (grid) grid.innerHTML = '<p>Erro ao carregar os projetos.</p>';
    }
    
    // [CORREÇÃO] Tenta rolar para a âncora DEPOIS que os cards
    // e o esqueleto da página foram carregados.
    if (anchor) {
      this.scrollToAnchor(anchor);
    }
  }
};
/* ========================================================================
     5. MÓDULO DE ACESSIBILIDADE (Modo Escuro)
     ======================================================================== */

  const ThemeModule = {
    init: function() {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return;

      // 1. Verifica se há preferência salva no LocalStorage
      const AbraceTheme = localStorage.getItem('AbraceTheme');
      if (AbraceTheme === 'dark') {
        this.enableDarkMode();
        toggle.checked = true;
      }

      // 2. Adiciona o evento de clique
      toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.enableDarkMode();
        } else {
          this.disableDarkMode();
        }
      });
    },

    enableDarkMode: function() {
      document.body.classList.add('dark-mode');
      localStorage.setItem('AbraceTheme', 'dark'); // Salva a preferência
    },

    disableDarkMode: function() {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('AbraceTheme', 'light'); // Salva a preferência
    }
  };
})(); // Fim da IIFE