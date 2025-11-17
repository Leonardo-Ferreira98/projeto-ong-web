# ONG Abrace o Futuro 🤝

Webapp institucional desenvolvido para a ONG "Abrace o Futuro", focado na divulgação de projetos sociais, captação de voluntários e transparência de ações.

Este projeto foi construído com foco em **Performance**, **Acessibilidade (WCAG 2.1)** e **Arquitetura SPA (Single Page Application)** sem o uso de frameworks pesados.

## 🚀 Funcionalidades Principais

* **Single Page Application (SPA):** Navegação fluida e instantânea sem recarregamento de página, utilizando Roteamento via JavaScript vanilla.
* **Acessibilidade Completa (a11y):**
    * Navegação total por teclado (Tab, Arrows, Esc).
    * **Modo Escuro (Dark Mode)** com persistência de preferência do usuário (LocalStorage).
    * Atributos ARIA para leitores de tela.
    * Contraste de cores otimizado.
* **Design Responsivo:** Layout fluido que se adapta a mobile, tablet e desktop.
* **Formulários Inteligentes:** Validação em tempo real e máscaras de input (CPF, Telefone, CEP).
* **Renderização Dinâmica:** Cards de projetos gerados via JavaScript a partir de arquivos JSON.

## 🛠️ Tecnologias Utilizadas

* **HTML5 Semântico**
* **CSS3 Moderno** (CSS Variables, Flexbox, Grid Layout)
* **JavaScript (ES6+)** (Modules, Async/Await, Fetch API)
* **Git & GitHub** (GitFlow Workflow)

## ⚙️ Como Executar

1.  Clone este repositório.
2.  Abra o arquivo `index.html` em seu navegador.
    * *Nota: Para funcionamento completo da SPA (Fetch API), recomenda-se rodar através de um servidor local (ex: Live Server no VS Code).*

## 📦 Estrutura do Projeto

* `/assets`: Contém CSS, Imagens e Scripts (Minificados para produção).
* `/assets/data`: Dados JSON para alimentação dinâmica de conteúdo.
* `*.html`: Fragmentos de conteúdo carregados dinamicamente pelo roteador.

---
Desenvolvido com ❤️ e código limpo.