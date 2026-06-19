const contacts={
  financeiro:{name:'Diogo Luna - Gerente Financeiro',phone:'556496411969'},
  paulo:{name:'Paulo Vitor - Vendas Metal Vida',phone:'556499834032'},
  mateus:{name:'Mateus - Comercial / Tec Aço',phone:'556481700228'}
};
function wa(phone,msg){return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`}
function setLinks(){
  document.querySelectorAll('[data-whatsapp]').forEach(el=>{
    const key=el.getAttribute('data-whatsapp')||'paulo';
    const c=contacts[key]||contacts.paulo;
    el.href=wa(c.phone,'Olá, vim pelo site da Metal Vida e gostaria de atendimento.');
  });
  document.querySelectorAll('[data-buy]').forEach(el=>{
    const item=el.getAttribute('data-buy');
    el.href=wa(contacts.paulo.phone,`Olá, vim pelo site da Metal Vida. Tenho interesse em: ${item}. Pode me passar valores, disponibilidade e prazo?`);
  });
}
setLinks();
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'))});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('quoteForm')?.addEventListener('submit',e=>{
 e.preventDefault();
 const d=Object.fromEntries(new FormData(e.target).entries());
 const msg=`Olá, vim pelo site da Metal Vida e quero solicitar atendimento.\n\nNome: ${d.nome||''}\nEmpresa: ${d.empresa||''}\nTelefone: ${d.telefone||''}\nCidade/UF: ${d.cidade||''}\nDemanda: ${d.servico||''}\nDescrição: ${d.descricao||''}`;
 window.open(wa(contacts.paulo.phone,msg),'_blank');
});
