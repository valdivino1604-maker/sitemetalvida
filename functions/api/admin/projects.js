import { error, json, normalizeCode, parseLines, readJson, requireAdmin, requireDb } from "../_utils.js";

function makeId() {
  return crypto.randomUUID();
}

function defaultSteps() {
  return [
    { title: "Atendimento inicial", description: "Dados do cliente e aplicacao recebidos.", done: true },
    { title: "Levantamento tecnico", description: "Capacidade, fluido, local e prazo em analise.", done: false },
    { title: "Proposta tecnica", description: "Escopo, condicoes e proximos passos em validacao.", done: false },
    { title: "Projeto / fabricacao", description: "Liberado apos aprovacao comercial e tecnica.", done: false },
    { title: "Entrega / montagem", description: "Programacao definida apos fabricacao.", done: false }
  ];
}

function normalizeSteps(payload) {
  if (Array.isArray(payload.steps) && payload.steps.length) {
    return payload.steps.map((step) => ({
      title: String(step.title || "").trim(),
      description: String(step.description || "").trim(),
      done: Boolean(step.done)
    })).filter((step) => step.title);
  }
  return parseLines(payload.steps_text, (line) => {
    const done = /^\[x\]/i.test(line);
    const clean = line.replace(/^\[[ x]\]\s*/i, "");
    const [title, ...rest] = clean.split("|");
    return { title: title.trim(), description: rest.join("|").trim(), done };
  });
}

function normalizeDocs(payload) {
  return parseLines(payload.documents_text, (line) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 4) {
      const [folder, name, status = "Disponivel mediante liberacao", url = ""] = parts;
      return { folder: folder || "Documentos", name, status, url };
    }
    const [name, status = "Disponivel mediante liberacao", url = ""] = parts;
    return { folder: "Documentos", name, status, url };
  }).filter((doc) => doc.name);
}

function normalizePayments(payload) {
  return parseLines(payload.payments_text, (line) => {
    const paid = /^\[x\]/i.test(line);
    const clean = line.replace(/^\[[ x]\]\s*/i, "");
    const [title, amount = "", dueDate = "", status = paid ? "Pago" : "Previsto", notes = ""] = clean.split("|").map((part) => part.trim());
    return { title, amount, due_date: dueDate, status, notes };
  }).filter((payment) => payment.title);
}

async function saveChildren(db, projectId, steps, docs, payments) {
  await db.batch([
    db.prepare("DELETE FROM project_steps WHERE project_id = ?").bind(projectId),
    db.prepare("DELETE FROM project_documents WHERE project_id = ?").bind(projectId),
    db.prepare("DELETE FROM project_files WHERE project_id = ?").bind(projectId),
    db.prepare("DELETE FROM project_payments WHERE project_id = ?").bind(projectId)
  ]);

  const statements = [];
  steps.forEach((step, index) => {
    statements.push(
      db.prepare("INSERT INTO project_steps (id, project_id, title, description, done, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(makeId(), projectId, step.title, step.description, step.done ? 1 : 0, index)
    );
  });
  docs.forEach((doc, index) => {
    statements.push(
      db.prepare("INSERT INTO project_documents (id, project_id, name, status, url, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(makeId(), projectId, doc.name, doc.status, doc.url, index)
    );
    statements.push(
      db.prepare("INSERT INTO project_files (id, project_id, folder, name, status, url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(makeId(), projectId, doc.folder, doc.name, doc.status, doc.url, index)
    );
  });
  payments.forEach((payment, index) => {
    statements.push(
      db.prepare("INSERT INTO project_payments (id, project_id, title, amount, due_date, status, notes, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(makeId(), projectId, payment.title, payment.amount, payment.due_date, payment.status, payment.notes, index)
    );
  });
  if (statements.length) await db.batch(statements);
}

export async function onRequestGet({ env, request }) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return admin.response;

  try {
    const db = requireDb(env);
    const { results } = await db
      .prepare("SELECT id, access_code, client_name, project_title, city, status, owner, updated_at FROM projects ORDER BY updated_at DESC LIMIT 100")
      .all();
    return json({ ok: true, projects: results || [] });
  } catch (err) {
    return error(err.message || "Erro ao listar projetos.", 500);
  }
}

export async function onRequestPost({ env, request }) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return admin.response;

  try {
    const db = requireDb(env);
    const payload = await readJson(request);
    const accessCode = normalizeCode(payload.access_code);
    if (!accessCode) return error("Codigo do projeto e obrigatorio.", 400);
    if (!payload.client_name) return error("Nome do cliente e obrigatorio.", 400);
    if (!payload.project_title) return error("Titulo do projeto e obrigatorio.", 400);

    const now = new Date().toISOString();
    const existing = await db.prepare("SELECT id FROM projects WHERE access_code = ?").bind(accessCode).first();
    const projectId = existing?.id || makeId();

    if (existing) {
      await db.prepare(`
        UPDATE projects
        SET client_name = ?, project_title = ?, city = ?, status = ?, owner = ?, notes = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        payload.client_name,
        payload.project_title,
        payload.city || "",
        payload.status || "Em analise tecnica",
        payload.owner || "Valdivino - Metal Vida",
        payload.notes || "",
        now,
        projectId
      ).run();
    } else {
      await db.prepare(`
        INSERT INTO projects (id, access_code, client_name, project_title, city, status, owner, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        projectId,
        accessCode,
        payload.client_name,
        payload.project_title,
        payload.city || "",
        payload.status || "Em analise tecnica",
        payload.owner || "Valdivino - Metal Vida",
        payload.notes || "",
        now,
        now
      ).run();
    }

    const steps = normalizeSteps(payload);
    const docs = normalizeDocs(payload);
    const payments = normalizePayments(payload);
    await saveChildren(db, projectId, steps.length ? steps : defaultSteps(), docs, payments);

    return json({ ok: true, project: { id: projectId, access_code: accessCode } });
  } catch (err) {
    return error(err.message || "Erro ao salvar projeto. Confira se a migracao 0002 foi executada no D1.", 500);
  }
}
