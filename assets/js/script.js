/* ========================================================================
   Arquivo: assets/js/script.js
   Descrição: Script unificado para Entrega III.
   Organizado por funcionalidade (Módulos)
   ======================================================================== */

// IIFE (Immediately Invoked Function Expression) para criar um escopo local
(function() {

  // Espera o DOM carregar
  document.addEventListener('DOMContentLoaded', function() {
    
    // Inicia os módulos principais
    MenuModule.init();
    SPARouter.init();
    
    // O FormModule será inicializado pelo SPARouter QUANDO a página de cadastro for carregada
    
  });

  /* ========================================================================
     1. MÓDULO DE NAVEGAÇÃO (Menu Hamburger)
     (Funcionalidade da Entrega II)
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
      // ... (código das máscaras da Entrega I) ...
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
      
      // 3. [ENTREGA III] - Verificação de Consistência de Dados
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
     (Funcionalidade da Entrega III - "Sistema de templates JavaScript")
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
     (Funcionalidade da Entrega III - "Sistema de SPA básico")
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
      
      // Se não houver hash, define o padrão como #inicio
      if (!hash) {
        hash = '#inicio';
      }
      
      // Limpa a âncora (ex: #projetos#acoes-sociais -> #projetos)
      hash = hash.split('#')[1];
      
      // Carrega o conteúdo baseado no hash
      switch (hash) {
        case 'inicio':
        this.loadHTML('inicio.html', 'main > *'); // <-- CORRIGIDO
        break;
      case 'projetos':
        this.loadProjects(); 
        break;
      case 'cadastro':
        this.loadHTML('cadastro.html', 'main > *', () => {
          FormModule.init();
        });
        break;
      default:
        this.loadHTML('inicio.html', 'main > *'); // <-- CORRIGIDO
  }
    },
    
    // Função para buscar e injetar HTML (para #inicio e #cadastro)
    loadHTML: async function(url, selector, callback) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Não foi possível carregar o conteúdo.');
        
        const text = await response.text();
        
        // Usa um 'parser' para converter o texto HTML em um documento DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Seleciona *apenas* o conteúdo de <main> do arquivo buscado
        const content = doc.querySelector(selector);
        
        if (content) {
          this.contentArea.innerHTML = ''; // Limpa a área
          // O querySelectorAll retorna uma NodeList, precisamos iterar
          doc.querySelectorAll(selector).forEach(node => {
            this.contentArea.appendChild(node.cloneNode(true));
          });
        } else {
          this.contentArea.innerHTML = '<p>Erro: Conteúdo não encontrado.</p>';
        }
        
        // Se houver um callback (como o FormModule.init), executa-o
        if (callback) callback();
        
      } catch (error) {
        console.error('Erro ao carregar página:', error);
        this.contentArea.innerHTML = '<p>Erro ao carregar o conteúdo. Tente novamente.</p>';
      }
    },
    
    // Função especial para #projetos (cumpre "JS Templating")
    loadProjects: async function() {
      // 1. Carrega o "esqueleto" da página de projetos
      await this.loadHTML('projetos.html', 'main > *');
      
      // 2. Agora, busca os dados JSON
      try {
        const response = await fetch('assets/data/projetos.json');
        if (!response.ok) throw new Error('Não foi possível carregar os dados dos projetos.');
        
        const projetos = await response.json();
        
        // 3. Pega o container dos cards (que foi carregado no passo 1)
        const grid = document.getElementById('project-card-grid');
        if (grid) {
          grid.innerHTML = ''; // Limpa a mensagem "Carregando..."
          
          // 4. Usa o TemplateModule para construir e injetar cada card
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
    }
  };

})(); // Fim da IIFE