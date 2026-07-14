import { error, json, normalizeCode, requireDb } from "../_utils.js";

export async function onRequestGet({ env, params }) {
  try {
    const db = requireDb(env);
    const code = normalizeCode(params.code);
    if (!code) return error("Informe o código do projeto.", 400);

    const project = await db
      .prepare("SELECT * FROM projects WHERE access_code = ?")
      .bind(code)
      .first();

    if (!project) return error("Projeto não encontrado.", 404);

    const [steps, docs] = await Promise.all([
      db.prepare("SELECT title, description, done, sort_order FROM project_steps WHERE project_id = ? ORDER BY sort_order, title").bind(project.id).all(),
      db.prepare("SELECT name, status, url, sort_order FROM project_documents WHERE project_id = ? ORDER BY sort_order, name").bind(project.id).all()
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
        documents: docs.results || []
      }
    });
  } catch (err) {
    return error(err.message || "Erro ao consultar projeto.", 500);
  }
}
