CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  access_code TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  city TEXT DEFAULT '',
  status TEXT DEFAULT 'Em análise técnica',
  owner TEXT DEFAULT 'Valdivino - Metal Vida',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_steps (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  done INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Disponível mediante liberação',
  url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_access_code ON projects(access_code);
CREATE INDEX IF NOT EXISTS idx_steps_project ON project_steps(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_docs_project ON project_documents(project_id, sort_order);
