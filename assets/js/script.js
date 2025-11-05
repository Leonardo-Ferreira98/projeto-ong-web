/* ========================================================================
   Arquivo: assets/js/script.js
   Descrição: Script unificado para Entrega II.
   Contém:
   1. [ENTREGA I] Máscaras de Formulário
   2. [ENTREGA II] Menu Hamburger
   3. [ENTREGA II] Validação Visual de Formulário (Corrigida)
   ======================================================================== */

// Aguarda o DOM carregar para executar o script
document.addEventListener('DOMContentLoaded', function() {

  /* --- 1. [ENTREGA I] Seção: Máscaras de Formulário --- */
  /* (Modificado para NÃO conflitar com a validação) */

  const inputCpf = document.getElementById('cpf');
  const inputTelefone = document.getElementById('telefone');
  const inputCep = document.getElementById('cep');

  // --- Máscara de CPF (123.456.789-00) ---
  if (inputCpf) {
    inputCpf.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');
      value = value.substring(0, 11);
      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      e.target.value = value;
      // Removida a chamada 'validarCampo' daqui para evitar conflito.
      // A validação agora SÓ ocorre no 'blur' (ver seção 3).
    });
  }

  // --- Máscara de Telefone ((11) 98765-4321) ---
  if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');
      value = value.substring(0, 11);
      if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/(\d{0,2})/, '($1');
      }
      e.target.value = value;
      // Validação removida do 'input'
    });
  }

  // --- Máscara de CEP (12345-678) ---
  if (inputCep) {
    inputCep.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');
      value = value.substring(0, 8);
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }
      e.target.value = value;
      // Validação removida do 'input'
    });
  }

  /* --- 2. [ENTREGA II] Seção: Menu Hamburger --- */
  
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  /* --- 3. [ENTREGA II] Seção: Validação Visual (Corrigida) --- */
  
  // Seleciona TODOS os inputs obrigatórios no formulário
  const inputsParaValidar = document.querySelectorAll('#formCadastro input[required]');

  // Adiciona o listener 'blur' (quando o usuário SAI do campo)
  inputsParaValidar.forEach(input => {
    input.addEventListener('blur', function(e) {
      // Quando o usuário sai do campo, chama a função de validação
      validarCampo(e.target);
    });
  });

  // Função de validação visual (a mesma do PASSO 12)
  function validarCampo(input) {
    // Pega o elemento de erro associado (via aria-describedby)
    const erroMsgId = input.getAttribute('aria-describedby');
    
    // Alguns campos (como Nome) não têm mensagem de erro, só validação
    const erroMsgElement = erroMsgId ? document.getElementById(erroMsgId) : null;

    // 'checkValidity()' testa o 'required', 'pattern', 'type', 'minlength' etc.
    if (!input.checkValidity()) {
      
      // Adiciona classe de inválido (para borda vermelha)
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      
      // Se houver um elemento de mensagem, mostra a mensagem correta
      if (erroMsgElement) {
        if (input.validity.valueMissing) {
          erroMsgElement.textContent = 'Este campo é obrigatório.';
        } else if (input.validity.patternMismatch) {
          erroMsgElement.textContent = `Formato inválido. Use o formato: ${input.placeholder}`;
        } else if (input.validity.typeMismatch) {
           erroMsgElement.textContent = 'Por favor, insira um e-mail válido.';
        }
        erroMsgElement.style.display = 'block'; // Mostra a mensagem
      }
      
    } else {
      
      // Adiciona classe de válido (para borda verde)
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      
      // Esconde a mensagem de erro
      if (erroMsgElement) {
        erroMsgElement.textContent = '';
        erroMsgElement.style.display = 'none';
      }
    }
  }
  
}); // Fim do 'DOMContentLoaded'