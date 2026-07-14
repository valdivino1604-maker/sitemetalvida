const contacts = {
  valdivino: { name: "Valdivino - Metal Vida", phone: "5564981616434" },
  financeiro: { name: "Valdivino - Metal Vida", phone: "5564981616434" },
  paulo: { name: "Valdivino - Metal Vida", phone: "5564981616434" },
  mateus: { name: "Valdivino - Metal Vida", phone: "5564981616434" }
};

const assistantName = "Metalzinho";

function wa(phone, msg) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
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
      `Ola, vim pelo site da Metal Vida. Tenho interesse em: ${item}. Pode me passar valores, disponibilidade e prazo?`
    );
  });

  document.querySelectorAll("[data-service]").forEach((el) => {
    const item = el.getAttribute("data-service");
    el.href = wa(
      contacts.valdivino.phone,
      `Ola, vim pelo site da Metal Vida. Quero solicitar orcamento tecnico para: ${item}. Pode me orientar?`
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
          <button type="button" data-chat-quick="Quero um orcamento tecnico">Orcamento</button>
          <button type="button" data-chat-quick="Preciso de galpao ou cobertura metalica">Galpao/cobertura</button>
          <button type="button" data-chat-quick="Preciso de reservatorio metalico">Reservatorio</button>
          <button type="button" data-chat-quick="Quero falar com especialista">Especialista</button>
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
  { key: "cidade", label: "Cidade/UF", question: "Qual e a cidade e UF da obra, entrega ou retirada?" },
  { key: "servico", label: "Servico/produto", question: "O que voce precisa? Exemplo: estrutura, galpao, reservatorio, chapas, escada, mezanino ou projeto sob medida." },
  { key: "medidas", label: "Medidas/detalhes", question: "Passe as medidas, quantidade, espessura/capacidade e qualquer detalhe importante." },
  { key: "prazo", label: "Prazo desejado", question: "Tem prazo desejado ou urgencia para atendimento?" }
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

function buildLeadSummary() {
  const lines = [
    "NOVO PEDIDO DE ORCAMENTO - SITE METAL VIDA",
    "",
    `Origem/interesse: ${lead.origem || "Atendimento pelo site"}`
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
  lead = { origem: origin, startedAt: new Date().toISOString() };
  leadStep = 0;
  addMessage("Vou montar um pedido de orcamento para enviar ao comercial da Metal Vida. Nao e valor final, mas ja deixa tudo organizado para responderem mais rapido.");
  addMessage(leadFields[leadStep].question);
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
  if (leadStep < leadFields.length) {
    addMessage(leadFields[leadStep].question);
  } else {
    finishBudgetFlow();
  }
  return true;
}

function openChat() {
  lobaoPanel?.classList.add("is-open");
  lobaoPanel?.setAttribute("aria-hidden", "false");
  lobaoLauncher?.setAttribute("aria-expanded", "true");
  if (!chatStarted) {
    chatStarted = true;
    addMessage("Fala! Eu sou o Metalzinho da Metal Vida. Posso montar um pedido de orcamento, salvar a conversa no navegador e enviar o resumo para o Valdivino pelo WhatsApp. O que voce precisa?");
  }
  setTimeout(() => lobaoInput?.focus(), 120);
}

function hideChat() {
  lobaoPanel?.classList.remove("is-open");
  lobaoPanel?.setAttribute("aria-hidden", "true");
  lobaoLauncher?.setAttribute("aria-expanded", "false");
}

function transferToWhatsapp() {
  const message = leadStep !== null ? buildLeadSummary() : buildTransferSummary();
  addMessage("Perfeito. Vou transferir voce para o WhatsApp do Valdivino para continuar o atendimento.");
  window.open(wa(contacts.valdivino.phone, message), "_blank");
}

function reply(text) {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (leadStep !== null) {
    handleBudgetAnswer(text);
    return;
  }
  if (t.includes("chapa") || t.includes("compr")) {
    startBudgetFlow(text);
    return;
  }
  if (t.includes("reservatorio") || t.includes("tanque")) {
    startBudgetFlow(text);
    return;
  }
  if (t.includes("galpao") || t.includes("cobertura") || t.includes("estrutura")) {
    startBudgetFlow(text);
    return;
  }
  if (t.includes("vendedor") || t.includes("atendente") || t.includes("humano") || t.includes("whatsapp") || t.includes("especialista")) {
    addMessage("Claro. Vou te mandar direto para o WhatsApp do Valdivino.");
    addWhatsappAction("Falar no WhatsApp", "Ola, vim pelo site da Metal Vida e quero falar com um especialista.", contacts.valdivino.phone);
    return;
  }
  if (t.includes("orcamento") || t.includes("preco") || t.includes("valor")) {
    startBudgetFlow(text);
    return;
  }
  addMessage("Entendi. A Metal Vida atende estruturas metalicas, reservatorios, galpoes, coberturas, chapas, mezaninos, escadas e pecas sob medida. Se preferir, posso te encaminhar para o WhatsApp agora.");
  addWhatsappAction("Continuar no WhatsApp", "Ola, vim pelo site da Metal Vida e preciso de atendimento.", contacts.valdivino.phone);
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