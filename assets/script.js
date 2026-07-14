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

const clientProjects = {
  "MV-DEMO": {
    title: "Reservatório tubular sem cone - Demonstração",
    client: "Cliente demonstração",
    city: "Rio Verde/GO",
    status: "Proposta técnica em validação",
    owner: "Valdivino - Metal Vida",
    updated: "14/07/2026",
    steps: [
      { title: "Atendimento inicial", text: "Dados do cliente e aplicação recebidos.", done: true },
      { title: "Levantamento técnico", text: "Capacidade, fluido, local e prazo em análise.", done: true },
      { title: "Proposta técnica", text: "Condições e escopo em validação com o cliente.", done: true },
      { title: "Projeto / fabricação", text: "Liberado após aprovação comercial e técnica.", done: false },
      { title: "Entrega / montagem", text: "Programação definida após fabricação.", done: false }
    ],
    docs: [
      { name: "Proposta técnica", status: "Disponível mediante liberação" },
      { name: "Desenho preliminar", status: "Em preparação" },
      { name: "Memorial / observações", status: "Aguardando validação" }
    ]
  }
};

function setupClientPortal() {
  const form = document.getElementById("clientPortalForm");
  if (!form) return;

  const dashboard = document.getElementById("clientDashboard");
  const empty = document.getElementById("clientEmpty");
  const title = document.getElementById("clientProjectTitle");
  const meta = document.getElementById("clientProjectMeta");
  const status = document.getElementById("clientStatus");
  const owner = document.getElementById("clientOwner");
  const updated = document.getElementById("clientUpdated");
  const steps = document.getElementById("clientSteps");
  const docs = document.getElementById("clientDocs");
  const whatsapp = document.getElementById("clientWhatsappLink");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const code = String(data.codigo || "").trim().toUpperCase();
    loadClientProject(code, data.contato);
  });

  async function loadClientProject(code, contact) {
    let project = null;
    try {
      const response = await fetch(`/api/client/${encodeURIComponent(code)}`);
      const payload = await response.json();
      if (payload.ok) project = payload.project;
    } catch {}

    if (!project && clientProjects[code]) {
      project = {
        ...clientProjects[code],
        access_code: code,
        client_name: clientProjects[code].client,
        project_title: clientProjects[code].title,
        updated_at: clientProjects[code].updated,
        documents: clientProjects[code].docs.map((doc) => ({ name: doc.name, status: doc.status, url: "" }))
      };
    }

    if (!project) {
      const msg = `Ola, preciso liberar acesso da area do cliente Metal Vida. Codigo informado: ${code || "nao informado"}. Contato: ${contact || "-"}`;
      window.open(wa(contacts.valdivino.phone, msg), "_blank");
      return;
    }

    title.textContent = project.project_title || project.title;
    meta.textContent = `${project.client_name || project.client} • ${project.city || ""} • Codigo ${project.access_code || code}`;
    status.textContent = project.status;
    owner.textContent = project.owner;
    updated.textContent = project.updated_at || project.updated;

    steps.innerHTML = (project.steps || []).map((step) => `
      <li class="${step.done ? "done" : ""}">
        <div><strong>${escapeHtml(step.title)}</strong><span>${escapeHtml(step.description || step.text || "")}</span></div>
      </li>
    `).join("");

    docs.innerHTML = (project.documents || project.docs || []).map((doc) => `
      <article class="client-doc">
        <strong>${escapeHtml(doc.name)}</strong>
        ${safeUrl(doc.url) ? `<a href="${safeUrl(doc.url)}" target="_blank" rel="noopener">${escapeHtml(doc.status || "Abrir")}</a>` : `<span>${escapeHtml(doc.status || "")}</span>`}
      </article>
    `).join("");

    const msg = [
      "AREA DO CLIENTE - METAL VIDA",
      "",
      `Codigo: ${project.access_code || code}`,
      `Projeto: ${project.project_title || project.title}`,
      `Cliente: ${project.client_name || project.client}`,
      `Status: ${project.status}`,
      "",
      "Quero falar sobre este projeto."
    ].join("\n");
    whatsapp.href = wa(contacts.valdivino.phone, msg);

    dashboard.hidden = false;
    empty.hidden = true;
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

function setupAdminPortal() {
  const form = document.getElementById("adminProjectForm");
  if (!form) return;

  const tokenInput = document.getElementById("adminToken");
  const message = document.getElementById("adminMessage");
  const list = document.getElementById("projectsList");
  const loadButton = document.getElementById("loadProjects");
  const clearButton = document.getElementById("clearAdminToken");

  tokenInput.value = localStorage.getItem("metalvida_admin_token") || "";

  function setMessage(text, type = "") {
    message.textContent = text;
    message.className = `admin-message ${type}`.trim();
  }

  function getToken() {
    return tokenInput.value.trim();
  }

  async function adminFetch(url, options = {}) {
    const token = getToken();
    if (!token) throw new Error("Informe o token administrativo.");
    localStorage.setItem("metalvida_admin_token", token);
    const response = await fetch(url, {
      ...options,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Erro no painel administrativo.");
    return payload;
  }

  async function loadProjects() {
    try {
      list.innerHTML = "<p class=\"section-intro\">Carregando projetos...</p>";
      const payload = await adminFetch("/api/admin/projects");
      list.innerHTML = payload.projects.length ? payload.projects.map((project) => `
        <article class="project-row">
          <strong>${escapeHtml(project.project_title)}</strong>
          <span>${escapeHtml(project.client_name)} • ${escapeHtml(project.city || "Sem cidade")} • ${escapeHtml(project.status)}</span>
          <span>Código: <code>${escapeHtml(project.access_code)}</code></span>
        </article>
      `).join("") : "<p class=\"section-intro\">Nenhum projeto cadastrado ainda.</p>";
    } catch (err) {
      list.innerHTML = `<p class="admin-message error">${err.message}</p>`;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      setMessage("Salvando projeto...");
      const payload = await adminFetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify(data)
      });
      setMessage(`Projeto salvo. Código: ${payload.project.access_code}`, "ok");
      await loadProjects();
    } catch (err) {
      setMessage(err.message, "error");
    }
  });

  loadButton?.addEventListener("click", loadProjects);
  clearButton?.addEventListener("click", () => {
    localStorage.removeItem("metalvida_admin_token");
    tokenInput.value = "";
    setMessage("Token removido deste navegador.");
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
setupClientPortal();
setupAdminPortal();

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
