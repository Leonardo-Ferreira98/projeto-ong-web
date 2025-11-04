// script.js | Aguarda o DOM carregar para executar o script
document.addEventListener('DOMContentLoaded', function() {

  // script.js | Seção: Máscaras de Formulário
  
  const inputCpf = document.getElementById('cpf');
  const inputTelefone = document.getElementById('telefone');
  const inputCep = document.getElementById('cep');

  // --- Máscara de CPF (123.456.789-00) ---
  if (inputCpf) {
    inputCpf.addEventListener('input', function(e) {
      let value = e.target.value;
      // Remove tudo que não for dígito
      value = value.replace(/\D/g, '');
      
      // Limita a 11 dígitos
      value = value.substring(0, 11);

      // Aplica a formatação
      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      
      e.target.value = value;
      // Chama a validação amigável
      validarCampo(e.target);
    });
  }

  // --- Máscara de Telefone ((11) 98765-4321) ---
  if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');
      
      // Limita a 11 dígitos (DDD + 9 dígitos)
      value = value.substring(0, 11);

      // Aplica a formatação
      if (value.length > 10) {
        // (11) 98765-4321
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (11) 8765-4321
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        // (11) 8765
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        // (11
        value = value.replace(/(\d{0,2})/, '($1');
      }
      
      e.target.value = value;
      validarCampo(e.target);
    });
  }

  // --- Máscara de CEP (12345-678) ---
  if (inputCep) {
    inputCep.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');
      
      // Limita a 8 dígitos
      value = value.substring(0, 8);

      // Aplica a formatação
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }
      
      e.target.value = value;
      validarCampo(e.target);
    });
  }

  // script.js | Seção: Validação Amigável (Mensagens de Erro)
  
  // Seleciona todos os inputs que possuem 'required' e 'pattern'
  const inputsComPattern = document.querySelectorAll('input[required][pattern]');
  
  inputsComPattern.forEach(input => {
    // Valida no 'blur' (quando o usuário sai do campo)
    input.addEventListener('blur', function(e) {
      validarCampo(e.target);
    });
  });

  function validarCampo(input) {
    // Pega o elemento de erro associado (via aria-describedby)
    const erroMsgId = input.getAttribute('aria-describedby');
    const erroMsgElement = document.getElementById(erroMsgId);

    if (!erroMsgElement) return;

    // 'checkValidity()' testa o 'required' e o 'pattern'
    if (!input.checkValidity()) {
      if (input.validity.valueMissing) {
        // Mensagem de erro para campo obrigatório
        erroMsgElement.textContent = 'Este campo é obrigatório.';
      } else if (input.validity.patternMismatch) {
        // Mensagem de erro para padrão (máscara) incorreto
        erroMsgElement.textContent = `Formato inválido. Use o formato: ${input.placeholder}`;
      }
    } else {
      // Limpa a mensagem de erro se o campo for válido
      erroMsgElement.textContent = '';
    }
  }

});