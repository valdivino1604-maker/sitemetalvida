const contacts = {
  valdivino: { name: "Valdivino - Metal Vida", phone: "5564981616434" },
  financeiro: { name: "Marliana - Financeiro Metal Vida", phone: "5564984180380" }
};

const assistantName = "Metalzinho";

function wa(phone, msg) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function normalizeContactLabels() {
  const financeCard = Array.from(document.querySelectorAll(".contact-card")).find((card) =>
    card.textContent.toLowerCase().includes("financeiro")
  );
  if (financeCard) {
    financeCard.setAttribute("data-whatsapp", "financeiro");
    financeCard.setAttribute("data-message", "Ola, vim pelo site da Metal Vida e preciso falar com o financeiro.");
    financeCard.setAttribute("href", "#");
    financeCard.querySelector("strong")?.replaceChildren(document.createTextNode("Financeiro"));
    financeCard.querySelector("span")?.replaceChildren(document.createTextNode("Assuntos administrativos e pagamentos"));
    financeCard.querySelector("small")?.replaceChildren(document.createTextNode("WhatsApp: +55 64 98418-0380"));
  }

  document.querySelectorAll(".email-route").forEach((route) => {
    const text = route.textContent.toLowerCase();
    const strong = route.querySelector("strong");
    const span = route.querySelector("span");
    const ghost = route.querySelector(".btn.ghost");

    if (text.includes("comercial")) {
      strong?.replaceChildren(document.createTextNode("Comercial"));
      span?.replaceChildren(document.createTextNode("E-mail comercial"));
      if (ghost) ghost.textContent = "Enviar e-mail comercial";
    }

    if (text.includes("financeiro")) {
      if (ghost) {
        ghost.setAttribute("data-whatsapp", "financeiro");
        ghost.setAttribute("data-message", "Ola, preciso falar com o financeiro da Metal Vida.");
        ghost.setAttribute("href", "#");
        ghost.textContent = "WhatsApp financeiro";
      }
    }
  });
}

function setLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const key = el.getAttribute("data-whatsapp") || "valdivino";
    const c = contacts[key] || contacts.valdivino;
    const customMessage = el.getAttribute("data-message");
    el.href = wa(c.phone, customMessage || "Ola, vim pelo site da Metal Vida e gostaria de atendimento.");
  });

  document.querySelectorAll("[data-buy]").forEach((el) => {
    const item = el.getAttribute("data-buy");
    el.href = wa(
      contacts.valdivino.phone,
      `Ola, vim pelo site da Metal Vida. Tenho interesse em: ${item}. Pode me orientar sobre proposta tecnica, capacidade e prazo?`
    );
  });

  document.querySelectorAll("[data-service]").forEach((el) => {
    const item = el.getAttribute("data-service");
    el.href = wa(
      contacts.valdivino.phone,
      `Ola, vim pelo site da Metal Vida. Quero solicitar proposta tecnica para: ${item}. Pode me orientar?`
    );
  });
}

function setupMenu() {
  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  menu?.addEventListener("click", () => {
    nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

function setupQuoteForm() {
  document.getElementById("quoteForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target).entries());
    const msg = [
      "SOLICITACAO DE ORCAMENTO - METAL VIDA",
      "",
      `Nome: ${d.nome || ""}`,
      `Empresa: ${d.empresa || ""}`,
      `WhatsApp: ${d.whatsapp || d.telefone || ""}`,
      `Cidade/UF: ${d.cidade || ""}`,
      `Tipo de servico: ${d.servico || ""}`,
      `Medidas aproximadas: ${d.medidas || ""}`,
      `Prazo desejado: ${d.prazo || ""}`,
      `Descricao: ${d.descricao || ""}`,
      "",
      "Mensagem enviada pelo site metalvida.com.br"
    ].join("\n");
    window.open(wa(contacts.valdivino.phone, msg), "_blank");
  });
}

function injectMetalzinhoStyles() {
  if (document.getElementById("metalzinho-chat-styles")) return;
  const style = document.createElement("style");
  style.id = "metalzinho-chat-styles";
  style.textContent = `
    .lobao-panel{grid-template-rows:auto 1fr auto auto auto}
    .lobao-transfer{padding:0 12px 12px;background:#fff}
    .lobao-transfer button{width:100%;min-height:42px;border:0;border-radius:8px;background:#25d366;color:#062b14;cursor:pointer;font-weight:1000}
  `;
  document.head.appendChild(style);
}

function ensureMetalzinhoChat() {
  document.querySelector(".whatsapp-float")?.remove();
  injectMetalzinhoStyles();

  if (!document.getElementById("lobao-chat-root")) {
    const root = document.createElement("div");
    root.id = "lobao-chat-root";
    root.setAttribute("aria-live", "polite");
    root.innerHTML = `
      <section class="lobao-panel" id="lobaoPanel" aria-label="Chat do Metalzinho da Metal Vida" aria-hidden="true">
        <header class="lobao-header">
          <div class="lobao-avatar" aria-hidden="true">M</div>
          <div>
            <strong>Metalzinho da Metal Vida</strong>
            <span><i></i> Orcamentos e atendimento</span>
          </div>
          <button class="lobao-close" id="lobaoClose" type="button" aria-label="Fechar chat">x</button>
        </header>
        <div class="lobao-messages" id="lobaoMessages"></div>
        <div class="lobao-quick">
          <button type="button" data-chat-quick="Quero orcamento de reservatorio">Orcamento</button>
          <button type="button" data-chat-quick="Preciso de reservatorio tipo taca">Tipo taca</button>
          <button type="button" data-chat-quick="Preciso de reservatorio tubular sem cone">Tubular</button>
          <button type="button" data-chat-quick="Preciso de tanque para combustivel">Combustivel</button>
        </div>
        <div class="lobao-transfer">
          <button type="button" id="metalzinhoTransfer">Finalizar e falar no WhatsApp</button>
        </div>
        <form class="lobao-form" id="lobaoForm">
          <input id="lobaoInput" type="text" autocomplete="off" placeholder="Digite sua duvida..." aria-label="Mensagem para o Metalzinho" />
          <button type="submit">Enviar</button>
        </form>
      </section>
      <button class="lobao-launcher" id="lobaoLauncher" type="button" aria-label="Abrir atendimento do Metalzinho" aria-expanded="false" aria-controls="lobaoPanel">
        <span class="lobao-launcher-icon" aria-hidden="true"></span>
        <span class="lobao-notice">Fale com Metalzinho</span>
      </button>
    `;
    document.body.appendChild(root);
  }

  document.getElementById("lobaoPanel")?.setAttribute("aria-label", "Chat do Metalzinho da Metal Vida");
  document.querySelector(".lobao-avatar")?.replaceChildren(document.createTextNode("M"));
  const title = document.querySelector(".lobao-header strong");
  if (title) title.textContent = "Metalzinho da Metal Vida";
  const notice = document.querySelector(".lobao-notice");
  if (notice) notice.textContent = "Fale com Metalzinho";
  const launcher = document.getElementById("lobaoLauncher");
  launcher?.setAttribute("aria-label", "Abrir atendimento do Metalzinho");
  const input = document.getElementById("lobaoInput");
  input?.setAttribute("aria-label", "Mensagem para o Metalzinho");

  const form = document.getElementById("lobaoForm");
  if (form && !document.getElementById("metalzinhoTransfer")) {
    const transfer = document.createElement("div");
    transfer.className = "lobao-transfer";
    transfer.innerHTML = '<button type="button" id="metalzinhoTransfer">Finalizar e falar no WhatsApp</button>';
    form.before(transfer);
  }
}

ensureMetalzinhoChat();
normalizeContactLabels();
setLinks();
setupMenu();
setupQuoteForm();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const lobaoLauncher = document.getElementById("lobaoLauncher");
const lobaoPanel = document.getElementById("lobaoPanel");
const lobaoClose = document.getElementById("lobaoClose");
const lobaoMessages = document.getElementById("lobaoMessages");
const lobaoForm = document.getElementById("lobaoForm");
const lobaoInput = document.getElementById("lobaoInput");
const metalzinhoTransfer = document.getElementById("metalzinhoTransfer");

let chatStarted = false;
let leadStep = null;
let lead = {};

const leadFields = [
  { key: "nome", label: "Nome/empresa", question: "Para montar o pedido, qual e seu nome e o nome da empresa?" },
  { key: "telefone", label: "Telefone/WhatsApp", question: "Qual telefone ou WhatsApp para o comercial retornar?" },
  { key: "cidade", label: "Cidade/UF", question: "Qual e a cidade e UF do local de instalacao?" },
  { key: "servico", label: "Produto/modelo", question: "Qual produto voce precisa: tipo taca, tubular sem cone, tanque horizontal para combustivel ou ainda precisa de orientacao?" },
  { key: "medidas", label: "Capacidade/medidas", question: "Qual capacidade desejada e medidas aproximadas? Exemplo: 15 m3, 30.000 L, altura desejada ou espaco disponivel." },
  { key: "fluido", label: "Fluido/aplicacao", question: "Vai armazenar o que: agua, diesel, outro combustivel, graos, efluente ou outro material?" },
  { key: "prazo", label: "Prazo desejado", question: "Tem prazo desejado ou urgencia para atendimento?" },
  { key: "detalhes", label: "Detalhes adicionais", question: "Tem algum detalhe importante: local de montagem, base pronta, escada, plataforma, pintura, acesso para caminhao ou guindaste?" }
];

const storageKeys = {
  chat: "metalvida_metalzinho_conversa",
  leads: "metalvida_metalzinho_orcamentos"
};

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function remember(type, text) {
  const log = readStorage(storageKeys.chat, []);
  log.push({ type, text, date: new Date().toISOString() });
  writeStorage(storageKeys.chat, log.slice(-80));
}

function addMessage(text, type = "bot") {
  if (!lobaoMessages) return;
  const el = document.createElement("div");
  el.className = `lobao-bubble ${type}`;
  el.textContent = text;
  lobaoMessages.appendChild(el);
  lobaoMessages.scrollTop = lobaoMessages.scrollHeight;
  remember(type, text);
}

function addWhatsappAction(label, message, phone = contacts.valdivino.phone) {
  if (!lobaoMessages) return;
  const link = document.createElement("a");
  link.className = "lobao-action";
  link.href = wa(phone, message);
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = label;
  lobaoMessages.appendChild(link);
  lobaoMessages.scrollTop = lobaoMessages.scrollHeight;
}

function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function detectBudgetIntent(text) {
  const t = normalizeText(text);
  return (
    t.includes("orcamento") ||
    t.includes("preco") ||
    t.includes("valor") ||
    t.includes("reservatorio") ||
    t.includes("tanque") ||
    t.includes("taca") ||
    t.includes("tubular") ||
    t.includes("combustivel") ||
    t.includes("diesel") ||
    t.includes("agua") ||
    t.includes("alcool") ||
    t.includes("gasolina") ||
    /\b\d+([,.]\d+)?\s*(m3|m³|mil litros|litros|l|lts?)\b/i.test(text)
  );
}

function prefillLeadFromText(text) {
  const t = normalizeText(text);
  const capacity = text.match(/\b\d+([,.]\d+)?\s*(m3|m³|mil litros|litros|l|lts?)\b/i);

  if (capacity) lead.medidas = capacity[0];
  if (t.includes("taca")) lead.servico = "Reservatorio tipo taca";
  if (t.includes("tubular")) lead.servico = "Reservatorio tubular sem cone";
  if (t.includes("combustivel") || t.includes("diesel") || t.includes("gasolina") || t.includes("alcool")) {
    lead.fluido = "Combustivel";
    if (!lead.servico) lead.servico = "Tanque horizontal para combustivel";
  }
  if (t.includes("agua")) lead.fluido = "Agua";
}

function askNextLeadQuestion() {
  while (leadStep < leadFields.length && lead[leadFields[leadStep].key]) {
    leadStep += 1;
  }
  if (leadStep < leadFields.length) {
    addMessage(leadFields[leadStep].question);
  } else {
    finishBudgetFlow();
  }
}

function buildLeadSummary() {
  const lines = [
    "NOVO PEDIDO DE ORCAMENTO - SITE METAL VIDA",
    "",
    `Origem/interesse: ${lead.origem || "Atendimento pelo site"}`,
    `Primeira mensagem: ${lead.mensagemInicial || "-"}`
  ];
  leadFields.forEach((field) => {
    lines.push(`${field.label}: ${lead[field.key] || "-"}`);
  });
  lines.push("");
  lines.push("Conversa registrada no site:");
  readStorage(storageKeys.chat, []).slice(-16).forEach((item) => {
    lines.push(`${item.type === "user" ? "Cliente" : assistantName}: ${item.text}`);
  });
  return lines.join("\n");
}

function buildTransferSummary() {
  const lines = [
    "ATENDIMENTO METALZINHO - SITE METAL VIDA",
    "",
    "Cliente quer continuar pelo WhatsApp.",
    "",
    "Conversa registrada no site:"
  ];
  readStorage(storageKeys.chat, []).slice(-18).forEach((item) => {
    lines.push(`${item.type === "user" ? "Cliente" : assistantName}: ${item.text}`);
  });
  return lines.join("\n");
}

function startBudgetFlow(origin = "Atendimento pelo site") {
  lead = { origem: origin, mensagemInicial: origin, startedAt: new Date().toISOString() };
  prefillLeadFromText(origin);
  leadStep = 0;
  addMessage("Perfeito. Vou coletar os dados do pedido antes de transferir para o Valdivino. Assim ele recebe tudo organizado no WhatsApp e consegue responder mais rapido.");
  if (lead.medidas || lead.servico || lead.fluido) {
    addMessage(`Ja anotei: ${[lead.servico, lead.medidas, lead.fluido].filter(Boolean).join(" | ")}.`);
  }
  askNextLeadQuestion();
}

function finishBudgetFlow() {
  const summary = buildLeadSummary();
  const leads = readStorage(storageKeys.leads, []);
  leads.push({ date: new Date().toISOString(), lead, summary });
  writeStorage(storageKeys.leads, leads.slice(-30));
  leadStep = null;
  addMessage("Pronto. Montei o resumo do orcamento e salvei esta conversa neste navegador. Agora e so enviar para o WhatsApp do Valdivino.");
  addWhatsappAction("Enviar orcamento para Valdivino", summary, contacts.valdivino.phone);
}

function handleBudgetAnswer(text) {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized.includes("cancelar") || normalized.includes("parar")) {
    leadStep = null;
    lead = {};
    addMessage("Tudo bem, cancelei este pedido. Se quiser comecar novamente, digite orcamento.");
    return true;
  }
  const field = leadFields[leadStep];
  lead[field.key] = text;
  leadStep += 1;
  askNextLeadQuestion();
  return true;
}

function openChat() {
  lobaoPanel?.classList.add("is-open");
  lobaoPanel?.setAttribute("aria-hidden", "false");
  lobaoLauncher?.setAttribute("aria-expanded", "true");
  if (!chatStarted) {
    chatStarted = true;
    addMessage("Fala! Eu sou o Metalzinho da Metal Vida. Posso montar um pedido de proposta para reservatorio tipo taca, tubular sem cone ou tanque para combustivel, salvar a conversa no navegador e enviar o resumo para o Valdivino pelo WhatsApp. O que voce precisa?");
  }
  setTimeout(() => lobaoInput?.focus(), 120);
}

function hideChat() {
  lobaoPanel?.classList.remove("is-open");
  lobaoPanel?.setAttribute("aria-hidden", "true");
  lobaoLauncher?.setAttribute("aria-expanded", "false");
}

function transferToWhatsapp() {
  if (leadStep !== null) {
    addMessage("Antes de transferir, preciso completar o pedido para o Valdivino receber tudo organizado.");
    askNextLeadQuestion();
    return;
  }
  if (!lead.nome && !lead.telefone && !lead.medidas) {
    startBudgetFlow("Cliente clicou para falar no WhatsApp pelo Metalzinho");
    return;
  }
  const message = leadStep !== null ? buildLeadSummary() : buildTransferSummary();
  addMessage("Perfeito. Vou transferir voce para o WhatsApp do Valdivino para continuar o atendimento.");
  window.open(wa(contacts.valdivino.phone, message), "_blank");
}

function reply(text) {
  const t = normalizeText(text);
  if (leadStep !== null) {
    handleBudgetAnswer(text);
    return;
  }
  if (t.includes("vendedor") || t.includes("atendente") || t.includes("humano") || t.includes("whatsapp") || t.includes("especialista")) {
    startBudgetFlow(text);
    return;
  }
  if (detectBudgetIntent(text)) {
    startBudgetFlow(text);
    return;
  }
  addMessage("Entendi. Para eu te ajudar de verdade, vou montar um pedido antes de transferir. Me diga se voce precisa de reservatorio tipo taca, tubular, tanque para combustivel ou outra solucao metalica.");
}

lobaoLauncher?.addEventListener("click", () => {
  lobaoPanel?.classList.contains("is-open") ? hideChat() : openChat();
});

lobaoClose?.addEventListener("click", hideChat);
metalzinhoTransfer?.addEventListener("click", transferToWhatsapp);

lobaoForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = lobaoInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  lobaoInput.value = "";
  setTimeout(() => reply(text), 260);
});

document.querySelectorAll("[data-chat-quick]").forEach((button) => {
  button.addEventListener("click", () => {
    const text = button.dataset.chatQuick;
    openChat();
    addMessage(text, "user");
    setTimeout(() => reply(text), 220);
  });
});
