import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sqlite3;
try {
  sqlite3 = (await import('sqlite3')).default;
} catch (err) {
  console.warn('⚠️ SQLite3 native addon não pôde ser carregado no ambiente Serverless. Usando motor em memória.');
}

const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dataDir = isVercel ? os.tmpdir() : path.join(__dirname);

if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {}
}

// Memory Store de Fallback para Vercel Serverless
const memoryStore = {
  users: [
    { id: 1, name: 'Administrador', email: 'admin@admin', password: '123', role: 'admin' },
    { id: 2, name: 'Super Admin', email: 'helpus.ecommerce@gmail.com', password: '@dmLocal1993', role: 'admin' }
  ],
  services: [
    { id: 1, nome: 'Corte Tradicional / Moderno', categoria: 'Corte', valor: 25.00, comissao: 10.00, tempo: '30 min', ativo: 'Sim' },
    { id: 2, nome: 'Barba Completa com Toalha Quente', categoria: 'Barba', valor: 17.00, comissao: 8.50, tempo: '25 min', ativo: 'Sim' },
    { id: 3, nome: 'Combo Corte + Barba', categoria: 'Combo', valor: 38.00, comissao: 15.00, tempo: '50 min', ativo: 'Sim' },
    { id: 4, nome: 'Luzes / Mechas', categoria: 'Química', valor: 35.00, comissao: 8.00, tempo: '60 min', ativo: 'Sim' },
    { id: 5, nome: 'Progressiva / Alisamento', categoria: 'Química', valor: 50.00, comissao: 15.00, tempo: '80 min', ativo: 'Sim' },
    { id: 6, nome: 'Manicure / Pedicure', categoria: 'Estética', valor: 20.00, comissao: 6.00, tempo: '30 min', ativo: 'Sim' }
  ],
  barbers: [
    { id: 1, nome: 'Márcio Top Barber', cargo: 'Barbeiro Principal', telefone: '(83) 98739-2265', chave_pix: '83987392265', ativo: 'Sim' },
    { id: 2, nome: 'Hugo Freitas', cargo: 'Barbeiro Master', telefone: '(31) 97527-5084', chave_pix: '31975275084', ativo: 'Sim' },
    { id: 3, nome: 'Marcos Silva', cargo: 'Especialista em Barba', telefone: '(31) 98888-1111', chave_pix: '31988881111', ativo: 'Sim' },
    { id: 4, nome: 'Marcelo Santos', cargo: 'Barbeiro & Visagista', telefone: '(31) 97777-2222', chave_pix: '31977772222', ativo: 'Sim' }
  ],
  clients: [
    { id: 1, nome: 'Cliente 1', telefone: '(54) 98441-1121', cartoes: 4, retorno: '2026-08-10' },
    { id: 2, nome: 'Cliente 2', telefone: '(74) 99954-5454', cartoes: 10, retorno: '2026-08-15' },
    { id: 3, nome: 'Hugo Freitas', telefone: '(31) 97527-5084', cartoes: 2, retorno: '2026-08-20' },
    { id: 4, nome: 'Cliente Teste', telefone: '(55) 99664-5454', cartoes: 6, retorno: '2026-08-25' }
  ],
  appointments: [
    { id: 101, cliente: 'Cliente 1', cliente_telefone: '(54) 98441-1121', barbeiro: 'Márcio Top Barber', servico: 'Corte Tradicional / Moderno', data: '2026-07-28', hora: '14:00', status: 'Concluído', valor: 25.00 },
    { id: 102, cliente: 'Cliente 2', cliente_telefone: '(74) 99954-5454', barbeiro: 'Hugo Freitas', servico: 'Barba Completa com Toalha Quente', data: '2026-07-28', hora: '15:30', status: 'Concluído', valor: 17.00 },
    { id: 103, cliente: 'Hugo Freitas', cliente_telefone: '(31) 97527-5084', barbeiro: 'Márcio Top Barber', servico: 'Combo Corte + Barba', data: '2026-07-29', hora: '09:00', status: 'Agendado', valor: 38.00 },
    { id: 104, cliente: 'Cliente Teste', cliente_telefone: '(55) 99664-5454', barbeiro: 'Marcos Silva', servico: 'Luzes / Mechas', data: '2026-07-29', hora: '10:30', status: 'Agendado', valor: 35.00 }
  ],
  products: [
    { id: 1, nome: 'Pomada Modeladora Efeito Matte', categoria: 'Pomadas', estoque: 15, valor_compra: 18.00, valor_venda: 35.00 },
    { id: 2, nome: 'Óleo para Barba Hidratante', categoria: 'Cremes', estoque: 8, valor_compra: 14.00, valor_venda: 28.00 },
    { id: 3, nome: 'Shampoo Fortificante Masculino', categoria: 'Cremes', estoque: 12, valor_compra: 22.00, valor_venda: 42.00 },
    { id: 4, nome: 'Lâminas de Barba (Caixa 100u)', categoria: 'Lâminas', estoque: 25, valor_compra: 25.00, valor_venda: 45.00 }
  ],
  sales: [
    { id: 1, item: 'Pomada Modeladora Efeito Matte', tipo: 'produto', quantidade: 2, valor_total: 70.00, forma_pgto: 'Pix', data: '2026-07-28' }
  ],
  commissions: [
    { id: 1, barbeiro: 'Márcio Top Barber', servico: 'Corte Tradicional', comissao: 10.00, data: '2026-07-28', pago: 'Sim' },
    { id: 2, barbeiro: 'Hugo Freitas', servico: 'Barba Completa', comissao: 8.50, data: '2026-07-28', pago: 'Não' }
  ]
};

let sqliteInstance = null;
if (sqlite3) {
  try {
    const dbPath = path.join(dataDir, 'barbearia.sqlite');
    sqliteInstance = new sqlite3.Database(isVercel ? ':memory:' : dbPath);

    sqliteInstance.serialize(() => {
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, categoria TEXT, valor REAL, comissao REAL, tempo TEXT, ativo TEXT)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS barbers (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, cargo TEXT, telefone TEXT, chave_pix TEXT, ativo TEXT)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, telefone TEXT, cartoes INTEGER, retorno TEXT)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente TEXT, cliente_telefone TEXT, barbeiro TEXT, servico TEXT, data TEXT, hora TEXT, status TEXT, valor REAL)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, categoria TEXT, estoque INTEGER, valor_compra REAL, valor_venda REAL)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, tipo TEXT, quantidade INTEGER, valor_total REAL, forma_pgto TEXT, data TEXT)`);
      sqliteInstance.run(`CREATE TABLE IF NOT EXISTS commissions (id INTEGER PRIMARY KEY AUTOINCREMENT, barbeiro TEXT, servico TEXT, comissao REAL, data TEXT, pago TEXT)`);

      sqliteInstance.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (row && row.count === 0) {
          sqliteInstance.run(`INSERT INTO users (name, email, password, role) VALUES ('Administrador', 'admin@admin', '123', 'admin')`);
          sqliteInstance.run(`INSERT INTO users (name, email, password, role) VALUES ('Super Admin', 'helpus.ecommerce@gmail.com', '@dmLocal1993', 'admin')`);
          memoryStore.services.forEach(s => sqliteInstance.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo, ativo) VALUES (?, ?, ?, ?, ?, 'Sim')`, [s.nome, s.categoria, s.valor, s.comissao, s.tempo]));
          memoryStore.barbers.forEach(b => sqliteInstance.run(`INSERT INTO barbers (nome, cargo, telefone, chave_pix, ativo) VALUES (?, ?, ?, ?, 'Sim')`, [b.nome, b.cargo, b.telefone, b.chave_pix]));
          memoryStore.clients.forEach(c => sqliteInstance.run(`INSERT INTO clients (nome, telefone, cartoes, retorno) VALUES (?, ?, ?, ?)`, [c.nome, c.telefone, c.cartoes, c.retorno]));
          memoryStore.products.forEach(p => sqliteInstance.run(`INSERT INTO products (nome, categoria, estoque, valor_compra, valor_venda) VALUES (?, ?, ?, ?, ?)`, [p.nome, p.categoria, p.estoque, p.valor_compra, p.valor_venda]));
          memoryStore.appointments.forEach(a => sqliteInstance.run(`INSERT INTO appointments (cliente, cliente_telefone, barbeiro, servico, data, hora, status, valor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [a.cliente, a.cliente_telefone, a.barbeiro, a.servico, a.data, a.hora, a.status, a.valor]));
        }
      });
    });
  } catch (e) {
    sqliteInstance = null;
  }
}

export { sqliteInstance, memoryStore };
