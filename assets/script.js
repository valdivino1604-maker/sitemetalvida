const CONFIG = {
  whatsapp: '5562999999999',
  email: 'contato@metalvida.com.br'
};

document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, vim pelo site da Metal Vida e gostaria de solicitar um orçamento.')}`;
});

const form = document.getElementById('quoteForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const message = `Olá, gostaria de solicitar um orçamento para a Metal Vida.%0A%0A` +
    `Nome: ${data.nome}%0A` +
    `Empresa: ${data.empresa || '-'}%0A` +
    `Telefone: ${data.telefone}%0A` +
    `Cidade: ${data.cidade || '-'}%0A` +
    `Serviço: ${data.servico}%0A` +
    `Descrição: ${data.descricao || '-'}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${message}`, '_blank');
});
