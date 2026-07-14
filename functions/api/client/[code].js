import { error, json, normalizeCode, requireDb } from "../_utils.js";

async function getFiles(db, projectId) {
  try {
    const { results } = await db
      .prepare("SELECT folder, name, status, url, sort_order FROM project_files WHERE project_id = ? ORDER BY folder, sort_order, name")
      .bind(projectId)
      .all();
    return results || [];
  } catch {
    const { results } = await db
      .prepare("SELECT name, status, url, sort_order FROM project_documents WHERE project_id = ? ORDER BY sort_order, name")
      .bind(projectId)
      .all();
    return (results || []).map((doc) => ({ ...doc, folder: "Documentos" }));
  }
}

async function getPayments(db, projectId) {
  try {
    const { results } = await db
      .prepare("SELECT title, amount, due_date, status, notes, sort_order FROM project_payments WHERE project_id = ? ORDER BY sort_order, title")
      .bind(projectId)
      .all();
    return results || [];
  } catch {
    return [];
  }
}

export async function onRequestGet({ env, params }) {
  try {
    const db = requireDb(env);
    const code = normalizeCode(params.code);
    if (!code) return error("Informe o codigo do projeto.", 400);

    const project = await db
      .prepare("SELECT * FROM projects WHERE access_code = ?")
      .bind(code)
      .first();

    if (!project) return error("Projeto nao encontrado.", 404);

    const [steps, files, payments] = await Promise.all([
      db.prepare("SELECT title, description, done, sort_order FROM project_steps WHERE project_id = ? ORDER BY sort_order, title").bind(project.id).all(),
      getFiles(db, project.id),
      getPayments(db, project.id)
    ]);

    return json({
      ok: true,
      project: {
        id: project.id,
        access_code: project.access_code,
        client_name: project.client_name,
        project_title: project.project_title,
        city: project.city,
        status: project.status,
        owner: project.owner,
        notes: project.notes,
        updated_at: project.updated_at,
        steps: steps.results || [],
        documents: files,
        payments
      }
    });
  } catch (err) {
    return error(err.message || "Erro ao consultar projeto.", 500);
  }
}
