const CONFIG = {
  financeiro: '556496411969',
  paulo: '556499834032',
  mateus: '556481700228',
  email: 'contato@metalvida.com.br'
};

document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

const mensagens = {
  financeiro: 'Olá, vim pelo site da Metal Vida e gostaria de falar com o financeiro.',
  paulo: 'Olá, vim pelo site da Metal Vida e gostaria de falar com Paulo Vitor sobre vendas/orçamento.',
  mateus: 'Olá, vim pelo site da Metal Vida e gostaria de falar com Mateus sobre comercial/Tec Aço.'
};

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const setor = link.dataset.whatsapp || 'financeiro';
  const numero = CONFIG[setor] || CONFIG.financeiro;
  const texto = mensagens[setor] || mensagens.financeiro;
  link.href = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  link.target = '_blank';
  link.rel = 'noopener';
});

const form = document.getElementById('quoteForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const message = `Olá, gostaria de solicitar um orçamento para a Metal Vida.

` +
    `Nome: ${data.nome}
` +
    `Empresa: ${data.empresa || '-'}
` +
    `Telefone: ${data.telefone}
` +
    `Cidade: ${data.cidade || '-'}
` +
    `Serviço: ${data.servico}
` +
    `Descrição: ${data.descricao || '-'}`;
  window.open(`https://wa.me/${CONFIG.financeiro}?text=${encodeURIComponent(message)}`, '_blank');
});
