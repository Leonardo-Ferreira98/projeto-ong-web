(function() {

  document.addEventListener('DOMContentLoaded', function() {
    MenuModule.init();
    MenuModule.initDropdownAccessibility();
    SPARouter.init();
    ThemeModule.init();
  });

  const MenuModule = {
    navToggle: null,
    mainNav: null,
    
    init: function() {
      this.navToggle = document.querySelector('.nav-toggle');
      this.mainNav = document.querySelector('.main-nav');
      
      if (this.navToggle && this.mainNav) {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
      }
      
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

    initDropdownAccessibility: function() {
      const dropdownLink = document.getElementById('projetos-link');
      const submenu = document.getElementById('submenu-projetos');

      if (!dropdownLink || !submenu) return;

      dropdownLink.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dropdownLink.setAttribute('aria-expanded', 'true');
          submenu.querySelector('a').focus();
        }
      });

      const submenuItems = submenu.querySelectorAll('a');
      submenuItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            dropdownLink.setAttribute('aria-expanded', 'false');
            dropdownLink.focus();
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < submenuItems.length - 1) {
              submenuItems[index + 1].focus();
            }
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
              submenuItems[index - 1].focus();
            }
          }
        });
      });

      submenu.addEventListener('focusout', (e) => {
        if (!submenu.contains(e.relatedTarget)) {
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });
    }
  };

  const FormModule = {
    init: function() {
      const form = document.getElementById('formCadastro');
      if (!form) return;
      
      this.applyMasks();
      
      const inputs = form.querySelectorAll('input[required]');
      inputs.forEach(input => {
        input.addEventListener('blur', (e) => this.validateField(e.target));
      });
    },
    
    applyMasks: function() {
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
      const errorId = input.getAttribute('aria-describedby');
      const errorElement = errorId ? document.getElementById(errorId) : null;
      
      if (!errorElement) return;

      let errorMessage = '';

      if (!input.checkValidity()) {
        if (input.validity.valueMissing) errorMessage = 'Este campo é obrigatório.';
        else if (input.validity.patternMismatch) errorMessage = `Formato inválido.`;
        else if (input.validity.typeMismatch) errorMessage = 'Por favor, insira um e-mail válido.';
      }
      
      if (input.id === 'nascimento' && input.value) {
        const dataNascimento = new Date(input.value);
        const hoje = new Date();
        dataNascimento.setUTCHours(0, 0, 0, 0);
        hoje.setUTCHours(0, 0, 0, 0);

        if (dataNascimento > hoje) {
          errorMessage = 'Data inválida. A data de nascimento não pode ser no futuro.';
        }
      }

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

  const TemplateModule = {
    buildProjectCard: function(projeto) {
      const imagemHTML = projeto.imagem_jpg
        ? `
        <picture class="card-image">
          <source srcset="${projeto.imagem_webp}" type="image/webp">
          <source srcset="${projeto.imagem_jpg}" type="image/jpeg">
          <img src="${projeto.imagem_jpg}" alt="${projeto.alt}">
        </picture>
        `
        : '';

      const tagsHTML = projeto.tags.map(tag => 
        `<span class="badge ${tag.classe}">${tag.label}</span>`
      ).join('');
      
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

  const SPARouter = {
    contentArea: null,
    
    init: function() {
      this.contentArea = document.getElementById('main-content-area');
      if (!this.contentArea) return;
      
      window.addEventListener('hashchange', () => this.route());
      this.route();
    },
    
    route: function() {
      let hash = window.location.hash;
      if (!hash) hash = '#inicio';
      
      const parts = hash.substring(1).split('#');
      const mainRoute = parts[0];
      const anchor = parts[1] || null;
      
      switch (mainRoute) {
        case 'inicio':
          this.loadHTML('inicio.html', 'body > *', null, anchor);
          break;
        case 'projetos':
          this.loadProjects(anchor);
          break;
        case 'cadastro':
          this.loadHTML('cadastro.html', 'body > *', () => FormModule.init(), anchor);
          break;
        default:
          this.loadHTML('inicio.html', 'body > *', null, anchor);
      }
    },
    
    scrollToAnchor: function(anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    
    loadHTML: async function(url, selector, callback, anchor) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar');
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const content = doc.querySelector(selector);
        
        if (content) {
          this.contentArea.innerHTML = '';
          doc.querySelectorAll(selector).forEach(node => {
            this.contentArea.appendChild(node.cloneNode(true));
          });
        }
        
        if (callback) callback();
        if (anchor) this.scrollToAnchor(anchor);
        
      } catch (error) {
        console.error(error);
        this.contentArea.innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
      }
    },
    
    loadProjects: async function(anchor) {
      await this.loadHTML('projetos.html', 'body > *');
      
      try {
        const response = await fetch('assets/data/projetos.json');
        if (!response.ok) throw new Error('Erro no JSON');
        
        const projetos = await response.json();
        const grid = document.getElementById('project-card-grid');
        
        if (grid) {
          grid.innerHTML = '';
          projetos.forEach(projeto => {
            grid.innerHTML += TemplateModule.buildProjectCard(projeto);
          });
        }
      } catch (error) {
        console.error(error);
      }
      
      if (anchor) this.scrollToAnchor(anchor);
    }
  };

  const ThemeModule = {
    init: function() {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return;
      
      const AbraceTheme = localStorage.getItem('AbraceTheme');
      if (AbraceTheme === 'dark') {
        this.enableDarkMode();
        toggle.checked = true;
      }
      
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
      localStorage.setItem('AbraceTheme', 'dark');
    },
    
    disableDarkMode: function() {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('AbraceTheme', 'light');
    }
  };

})();