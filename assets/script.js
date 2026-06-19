const contacts={
  financeiro:{name:'Diogo Luna - Gerente Financeiro',phone:'556496411969'},
  paulo:{name:'Paulo Vitor - Vendas Metal Vida',phone:'556499834032'},
  mateus:{name:'Mateus - Comercial / Tec Aço',phone:'556481700228'},
  valdivino:{name:'Valdivino - Gestão Metal Vida',phone:'5564981616434'}
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

function ensureLobaoChat(){
  document.querySelector('.whatsapp-float')?.remove();
  if(!document.getElementById('lobao-chat-styles')){
    const style=document.createElement('style');
    style.id='lobao-chat-styles';
    style.textContent=`
#lobao-chat-root{position:fixed;right:22px;bottom:22px;z-index:60;font-family:Arial,Helvetica,sans-serif}
.lobao-launcher{position:relative;min-width:190px;height:58px;display:flex;align-items:center;justify-content:center;gap:11px;border:0;border-radius:999px;background:linear-gradient(135deg,#e50914,#8d0505);color:#fff;cursor:pointer;box-shadow:0 16px 34px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.22);transition:transform .18s ease,box-shadow .18s ease,background .18s ease;padding:0 18px 0 12px}
.lobao-launcher:hover,.lobao-launcher:focus-visible{transform:translateY(-2px);background:linear-gradient(135deg,#ff2630,#a60606);box-shadow:0 20px 40px rgba(0,0,0,.46);outline:3px solid rgba(229,9,20,.28);outline-offset:4px}
.lobao-launcher-icon{position:relative;width:42px;height:42px;display:block;flex:0 0 auto;border-radius:50%;border:2px solid #fff;background:#111 url("assets/lobao-avatar.svg") center/cover no-repeat;box-shadow:0 6px 14px rgba(0,0,0,.28);font-size:0;overflow:hidden}
.lobao-launcher-icon:after{content:"";position:absolute;right:0;bottom:1px;width:11px;height:11px;border-radius:50%;border:2px solid #fff;background:#25d366}
.lobao-notice{display:block;white-space:nowrap;color:#fff;font-size:15px;font-weight:1000;line-height:1}
.lobao-panel{position:absolute;right:0;bottom:70px;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100vh - 124px));display:grid;grid-template-rows:auto 1fr auto auto;overflow:hidden;border-radius:8px;background:#fff;color:#111;box-shadow:0 24px 60px rgba(0,0,0,.48);border:1px solid rgba(255,255,255,.2);opacity:0;pointer-events:none;transform:translateY(14px) scale(.96);transition:opacity .18s ease,transform .18s ease}
.lobao-panel.is-open{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
.lobao-header{display:flex;align-items:center;gap:12px;padding:14px;background:linear-gradient(135deg,#070707,#2a2d31);color:#fff}
.lobao-avatar{width:46px;height:46px;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;border:2px solid rgba(255,255,255,.82);background:#d20a0a;font-size:24px;font-weight:1000}
.lobao-header strong,.lobao-header span{display:block}.lobao-header strong{font-size:15px}.lobao-header span{margin-top:4px;color:#d7d7d7;font-size:12px}
.lobao-header i{display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:50%;background:#25d366;box-shadow:0 0 0 4px rgba(37,211,102,.18)}
.lobao-close{margin-left:auto;width:36px;height:36px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-weight:900}
.lobao-messages{display:flex;flex-direction:column;gap:10px;min-height:0;overflow-y:auto;padding:15px;background:#f3f4f6}
.lobao-bubble{max-width:88%;padding:11px 12px;border-radius:8px;font-size:14px;line-height:1.42;white-space:pre-line}
.lobao-bubble.bot{align-self:flex-start;background:#fff;border:1px solid #e1e1e1;color:#222}.lobao-bubble.user{align-self:flex-end;background:#111;color:#fff}
.lobao-action{align-self:flex-start;margin-top:-2px;border-radius:8px;background:#25d366;color:#062b14;padding:10px 12px;text-decoration:none;font-size:13px;font-weight:1000}
.lobao-quick{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px;border-top:1px solid #e7e7e7;background:#fff}
.lobao-quick button{border:1px solid #dadada;border-radius:8px;background:#f8f8f8;color:#111;padding:9px;cursor:pointer;font-weight:800;font-size:12px}
.lobao-form{display:grid;grid-template-columns:1fr auto;gap:8px;padding:12px;border-top:1px solid #e7e7e7;background:#fff}
.lobao-form input{min-width:0;border:1px solid #d7d7d7;border-radius:8px;padding:12px;color:#111;font-size:14px}
.lobao-form button{border:0;border-radius:8px;background:#d20a0a;color:#fff;padding:0 14px;cursor:pointer;font-weight:1000}
@media(max-width:900px){#lobao-chat-root{right:14px;bottom:14px}.lobao-launcher{min-width:174px;height:54px;padding:0 15px 0 11px}.lobao-launcher-icon{width:38px;height:38px}.lobao-notice{font-size:14px}.lobao-panel{bottom:70px}}`;
    document.head.appendChild(style);
  }
  if(!document.getElementById('lobao-chat-root')){
    const root=document.createElement('div');
    root.id='lobao-chat-root';
    root.setAttribute('aria-live','polite');
    root.innerHTML=`<section class="lobao-panel" id="lobaoPanel" aria-label="Chat do Lobao da Metal Vida" aria-hidden="true"><header class="lobao-header"><div class="lobao-avatar" aria-hidden="true">L</div><div><strong>Lobao da Metal Vida</strong><span><i></i> Atendimento online</span></div><button class="lobao-close" id="lobaoClose" type="button" aria-label="Fechar chat">x</button></header><div class="lobao-messages" id="lobaoMessages"></div><div class="lobao-quick"><button type="button" data-chat-quick="Quero um orçamento">Orçamento</button><button type="button" data-chat-quick="Quero comprar chapas metálicas">Comprar chapas</button><button type="button" data-chat-quick="Preciso de reservatório metálico">Reservatório</button><button type="button" data-chat-quick="Quero falar com um vendedor">Vendedor</button></div><form class="lobao-form" id="lobaoForm"><input id="lobaoInput" type="text" autocomplete="off" placeholder="Digite sua dúvida..." aria-label="Mensagem para o Lobao" /><button type="submit">Enviar</button></form></section><button class="lobao-launcher" id="lobaoLauncher" type="button" aria-label="Abrir atendimento do Lobao" aria-expanded="false" aria-controls="lobaoPanel"><span class="lobao-launcher-icon" aria-hidden="true"></span><span class="lobao-notice">Fale com Lobão</span></button>`;
    document.body.appendChild(root);
  }
}
ensureLobaoChat();

const lobaoLauncher=document.getElementById('lobaoLauncher');
const lobaoPanel=document.getElementById('lobaoPanel');
const lobaoClose=document.getElementById('lobaoClose');
const lobaoMessages=document.getElementById('lobaoMessages');
const lobaoForm=document.getElementById('lobaoForm');
const lobaoInput=document.getElementById('lobaoInput');
let lobaoStarted=false;
let lobaoLeadStep=null;
let lobaoLead={};

const lobaoLeadFields=[
  {key:'nome',label:'Nome/empresa',question:'Para montar o pedido, qual é seu nome e o nome da empresa?'},
  {key:'telefone',label:'Telefone/WhatsApp',question:'Qual telefone ou WhatsApp para o comercial retornar?'},
  {key:'cidade',label:'Cidade/UF',question:'Qual é a cidade e UF da obra, entrega ou retirada?'},
  {key:'servico',label:'Serviço/produto',question:'O que você precisa? Exemplo: estrutura, galpão, reservatório, chapas, escada, mezanino ou projeto sob medida.'},
  {key:'medidas',label:'Medidas/detalhes',question:'Passe as medidas, quantidade, espessura/capacidade e qualquer detalhe importante.'},
  {key:'prazo',label:'Prazo desejado',question:'Tem prazo desejado ou urgência para atendimento?'}
];
const lobaoStorageKeys={
  chat:'metalvida_lobao_conversa',
  leads:'metalvida_lobao_orcamentos'
};

function lobaoReadStorage(key,fallback){
  try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}
}

function lobaoWriteStorage(key,value){
  try{localStorage.setItem(key,JSON.stringify(value))}catch{}
}

function lobaoRemember(type,text){
  const log=lobaoReadStorage(lobaoStorageKeys.chat,[]);
  log.push({type,text,date:new Date().toISOString()});
  lobaoWriteStorage(lobaoStorageKeys.chat,log.slice(-80));
}

function lobaoAdd(text,type='bot'){
  if(!lobaoMessages)return;
  const el=document.createElement('div');
  el.className=`lobao-bubble ${type}`;
  el.textContent=text;
  lobaoMessages.appendChild(el);
  lobaoMessages.scrollTop=lobaoMessages.scrollHeight;
  lobaoRemember(type,text);
}

function lobaoWhatsapp(label,message,phone=contacts.paulo.phone){
  if(!lobaoMessages)return;
  const link=document.createElement('a');
  link.className='lobao-action';
  link.href=wa(phone,message);
  link.target='_blank';
  link.rel='noopener';
  link.textContent=label;
  lobaoMessages.appendChild(link);
  lobaoMessages.scrollTop=lobaoMessages.scrollHeight;
}

function lobaoStartBudgetFlow(origin='Atendimento pelo site'){
  lobaoLead={
    origem:origin,
    startedAt:new Date().toISOString()
  };
  lobaoLeadStep=0;
  lobaoAdd('Vou montar um pedido de orçamento para enviar ao comercial da Metal Vida. Não é valor final, mas já deixa tudo organizado para responderem mais rápido.');
  lobaoAdd(lobaoLeadFields[lobaoLeadStep].question);
}

function lobaoBuildBudgetSummary(){
  const lines=[
    'NOVO PEDIDO DE ORÇAMENTO - SITE METAL VIDA',
    '',
    `Origem/interesse: ${lobaoLead.origem||'Atendimento pelo site'}`
  ];
  lobaoLeadFields.forEach(field=>{
    lines.push(`${field.label}: ${lobaoLead[field.key]||'-'}`);
  });
  lines.push('');
  lines.push('Conversa registrada no site:');
  lobaoReadStorage(lobaoStorageKeys.chat,[]).slice(-16).forEach(item=>{
    lines.push(`${item.type==='user'?'Cliente':'Lobão'}: ${item.text}`);
  });
  return lines.join('\n');
}

function lobaoFinishBudgetFlow(){
  const summary=lobaoBuildBudgetSummary();
  const leads=lobaoReadStorage(lobaoStorageKeys.leads,[]);
  leads.push({date:new Date().toISOString(),lead:lobaoLead,summary});
  lobaoWriteStorage(lobaoStorageKeys.leads,leads.slice(-30));
  lobaoLeadStep=null;
  lobaoAdd('Pronto. Montei o resumo do orçamento e salvei esta conversa neste navegador. Agora envie pelo WhatsApp na ordem: primeiro Paulo, depois Mateus e por último uma cópia para Valdivino.');
  lobaoWhatsapp('1. Enviar para Paulo - Comercial',summary,contacts.paulo.phone);
  lobaoWhatsapp('2. Enviar para Mateus - Comercial',summary,contacts.mateus.phone);
  lobaoWhatsapp('3. Enviar cópia para Valdivino',summary,contacts.valdivino.phone);
}

function lobaoHandleBudgetAnswer(text){
  const normalized=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(normalized.includes('cancelar')||normalized.includes('parar')){
    lobaoLeadStep=null;
    lobaoLead={};
    lobaoAdd('Tudo bem, cancelei este pedido. Se quiser começar novamente, digite orçamento.');
    return true;
  }
  const field=lobaoLeadFields[lobaoLeadStep];
  lobaoLead[field.key]=text;
  lobaoLeadStep+=1;
  if(lobaoLeadStep<lobaoLeadFields.length){
    lobaoAdd(lobaoLeadFields[lobaoLeadStep].question);
  }else{
    lobaoFinishBudgetFlow();
  }
  return true;
}

function lobaoOpen(){
  lobaoPanel?.classList.add('is-open');
  lobaoPanel?.setAttribute('aria-hidden','false');
  lobaoLauncher?.setAttribute('aria-expanded','true');
  if(!lobaoStarted){
    lobaoStarted=true;
    lobaoAdd('Fala! Eu sou o Lobão da Metal Vida. Posso montar um pedido de orçamento, salvar a conversa no navegador e enviar o resumo para o comercial pelo WhatsApp. O que você precisa?');
  }
  setTimeout(()=>lobaoInput?.focus(),120);
}

function lobaoHide(){
  lobaoPanel?.classList.remove('is-open');
  lobaoPanel?.setAttribute('aria-hidden','true');
  lobaoLauncher?.setAttribute('aria-expanded','false');
}

function lobaoReply(text){
  const t=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(lobaoLeadStep!==null){
    lobaoHandleBudgetAnswer(text);
    return;
  }
  if(t.includes('chapa')||t.includes('compr')){
    lobaoStartBudgetFlow(text);
    return;
  }
  if(t.includes('reservatorio')||t.includes('tanque')){
    lobaoStartBudgetFlow(text);
    return;
  }
  if(t.includes('galpao')||t.includes('cobertura')||t.includes('estrutura')){
    lobaoStartBudgetFlow(text);
    return;
  }
  if(t.includes('vendedor')||t.includes('atendente')||t.includes('humano')||t.includes('whatsapp')){
    lobaoAdd('Claro. Vou te mandar direto para o vendedor da Metal Vida.');
    lobaoWhatsapp('Falar com vendedor','Olá, vim pelo site da Metal Vida e quero falar com um vendedor.');
    return;
  }
  if(t.includes('orcamento')||t.includes('preco')||t.includes('valor')){
    lobaoStartBudgetFlow(text);
    return;
  }
  lobaoAdd('Entendi. A Metal Vida atende estruturas metálicas, reservatórios, galpões, coberturas, chapas, mezaninos, escadas e peças sob medida. Se preferir, posso te encaminhar para o WhatsApp agora.');
  lobaoWhatsapp('Continuar no WhatsApp','Olá, vim pelo site da Metal Vida e preciso de atendimento.');
}

lobaoLauncher?.addEventListener('click',()=>{
  lobaoPanel?.classList.contains('is-open')?lobaoHide():lobaoOpen();
});
lobaoClose?.addEventListener('click',lobaoHide);
lobaoForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const text=lobaoInput.value.trim();
  if(!text)return;
  lobaoAdd(text,'user');
  lobaoInput.value='';
  setTimeout(()=>lobaoReply(text),260);
});
document.querySelectorAll('[data-chat-quick]').forEach(button=>{
  button.addEventListener('click',()=>{
    const text=button.dataset.chatQuick;
    lobaoOpen();
    lobaoAdd(text,'user');
    setTimeout(()=>lobaoReply(text),220);
  });
});
