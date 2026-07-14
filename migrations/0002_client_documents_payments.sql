CREATE TABLE IF NOT EXISTS project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  folder TEXT NOT NULL DEFAULT 'Documentos',
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Disponivel mediante liberacao',
  url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_payments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  amount TEXT DEFAULT '',
  due_date TEXT DEFAULT '',
  status TEXT DEFAULT 'Previsto',
  notes TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_files_project ON project_files(project_id, folder, sort_order);
CREATE INDEX IF NOT EXISTS idx_payments_project ON project_payments(project_id, sort_order);
