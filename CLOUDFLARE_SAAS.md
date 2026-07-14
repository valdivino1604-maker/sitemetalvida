# SaaS Metal Vida no Cloudflare

Este site agora tem uma primeira versao de area do cliente com painel administrativo.

## O que ficou pronto

- `/admin/`: painel para cadastrar e atualizar projetos de clientes.
- `/clientes/`: pagina para o cliente consultar o projeto usando um codigo.
- `/api/admin/projects`: API protegida por token para salvar/listar projetos.
- `/api/client/[codigo]`: API publica para consultar um projeto pelo codigo.
- `migrations/0001_client_portal.sql`: estrutura do banco D1.

## Configuracao obrigatoria no Cloudflare Pages

No projeto Pages do site, entre em:

Settings > Bindings

Adicione um binding:

- Type: D1 database
- Variable name: `DB`
- D1 database: `ennea-path-pro-db` ou o banco D1 usado para o portal

Depois entre em:

Settings > Variables and Secrets

Adicione uma variavel/segredo:

- Name: `ADMIN_TOKEN`
- Value: uma senha forte para abrir o painel administrativo

Exemplo de token:

`MetalVida-Admin-2026`

## Criar as tabelas no D1

Abra o banco D1 no Cloudflare:

D1 Database > ennea-path-pro-db > Console

Cole e execute o conteudo do arquivo:

`migrations/0001_client_portal.sql`

## Como usar

1. Acesse `https://www.metalvida.com.br/admin/`.
2. Informe o token administrativo.
3. Cadastre um projeto com um codigo, por exemplo `MV-001`.
4. Entregue esse codigo ao cliente.
5. O cliente acessa `https://www.metalvida.com.br/clientes/` e consulta o projeto.

## Observacao

Se aparecer "D1 nao esta ligado", significa que o binding `DB` ainda nao foi adicionado no projeto Pages certo, ou a ultima versao ainda nao terminou de publicar.
