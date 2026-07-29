import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'barbearia.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Criar Tabelas
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      valor REAL NOT NULL,
      comissao REAL NOT NULL,
      tempo TEXT DEFAULT '30 min',
      ativo TEXT DEFAULT 'Sim'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cargo TEXT NOT NULL,
      telefone TEXT,
      chave_pix TEXT,
      ativo TEXT DEFAULT 'Sim'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      cartoes INTEGER DEFAULT 0,
      retorno TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      cliente_telefone TEXT,
      barbeiro TEXT NOT NULL,
      servico TEXT NOT NULL,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      status TEXT DEFAULT 'Agendado',
      valor REAL NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      estoque INTEGER DEFAULT 0,
      valor_compra REAL DEFAULT 0,
      valor_venda REAL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL,
      tipo TEXT DEFAULT 'produto',
      quantidade INTEGER DEFAULT 1,
      valor_total REAL NOT NULL,
      forma_pgto TEXT DEFAULT 'Pix',
      data TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barbeiro TEXT NOT NULL,
      servico TEXT NOT NULL,
      comissao REAL NOT NULL,
      data TEXT NOT NULL,
      pago TEXT DEFAULT 'Não'
    )
  `);

  // Seeding Inicial
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO users (name, email, password, role) VALUES ('Administrador', 'admin@admin', '123', 'admin')`);
      db.run(`INSERT INTO users (name, email, password, role) VALUES ('Super Admin', 'helpus.ecommerce@gmail.com', '@dmLocal1993', 'admin')`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM services', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Corte Tradicional / Moderno', 'Corte', 25.00, 10.00, '30 min')`);
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Barba Completa com Toalha Quente', 'Barba', 17.00, 8.50, '25 min')`);
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Combo Corte + Barba', 'Combo', 38.00, 15.00, '50 min')`);
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Luzes / Mechas', 'Química', 35.00, 8.00, '60 min')`);
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Progressiva / Alisamento', 'Química', 50.00, 15.00, '80 min')`);
      db.run(`INSERT INTO services (nome, categoria, valor, comissao, tempo) VALUES ('Manicure / Pedicure', 'Estética', 20.00, 6.00, '30 min')`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM barbers', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO barbers (nome, cargo, telefone, chave_pix) VALUES ('Márcio Top Barber', 'Barbeiro Principal', '(83) 98739-2265', '83987392265')`);
      db.run(`INSERT INTO barbers (nome, cargo, telefone, chave_pix) VALUES ('Hugo Freitas', 'Barbeiro Master', '(31) 97527-5084', '31975275084')`);
      db.run(`INSERT INTO barbers (nome, cargo, telefone, chave_pix) VALUES ('Marcos Silva', 'Especialista em Barba', '(31) 98888-1111', '31988881111')`);
      db.run(`INSERT INTO barbers (nome, cargo, telefone, chave_pix) VALUES ('Marcelo Santos', 'Barbeiro & Visagista', '(31) 97777-2222', '31977772222')`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO clients (nome, telefone, cartoes, retorno) VALUES ('Cliente 1', '(54) 98441-1121', 4, '2026-08-10')`);
      db.run(`INSERT INTO clients (nome, telefone, cartoes, retorno) VALUES ('Cliente 2', '(74) 99954-5454', 10, '2026-08-15')`);
      db.run(`INSERT INTO clients (nome, telefone, cartoes, retorno) VALUES ('Hugo Freitas', '(31) 97527-5084', 2, '2026-08-20')`);
      db.run(`INSERT INTO clients (nome, telefone, cartoes, retorno) VALUES ('Cliente Teste', '(55) 99664-5454', 6, '2026-08-25')`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO products (nome, categoria, estoque, valor_compra, valor_venda) VALUES ('Pomada Modeladora Efeito Matte', 'Pomadas', 15, 18.00, 35.00)`);
      db.run(`INSERT INTO products (nome, categoria, estoque, valor_compra, valor_venda) VALUES ('Óleo para Barba Hidratante', 'Cremes', 8, 14.00, 28.00)`);
      db.run(`INSERT INTO products (nome, categoria, estoque, valor_compra, valor_venda) VALUES ('Shampoo Fortificante Masculino', 'Cremes', 12, 22.00, 42.00)`);
      db.run(`INSERT INTO products (nome, categoria, estoque, valor_compra, valor_venda) VALUES ('Lâminas de Barba (Caixa 100u)', 'Lâminas', 25, 25.00, 45.00)`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM appointments', (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO appointments (cliente, cliente_telefone, barbeiro, servico, data, hora, status, valor) VALUES ('Cliente 1', '(54) 98441-1121', 'Márcio Top Barber', 'Corte Tradicional / Moderno', '2026-07-28', '14:00', 'Concluído', 25.00)`);
      db.run(`INSERT INTO appointments (cliente, cliente_telefone, barbeiro, servico, data, hora, status, valor) VALUES ('Cliente 2', '(74) 99954-5454', 'Hugo Freitas', 'Barba Completa com Toalha Quente', '2026-07-28', '15:30', 'Concluído', 17.00)`);
      db.run(`INSERT INTO appointments (cliente, cliente_telefone, barbeiro, servico, data, hora, status, valor) VALUES ('Hugo Freitas', '(31) 97527-5084', 'Márcio Top Barber', 'Combo Corte + Barba', '2026-07-29', '09:00', 'Agendado', 38.00)`);
      db.run(`INSERT INTO appointments (cliente, cliente_telefone, barbeiro, servico, data, hora, status, valor) VALUES ('Cliente Teste', '(55) 99664-5454', 'Marcos Silva', 'Luzes / Mechas', '2026-07-29', '10:30', 'Agendado', 35.00)`);
    }
  });
});

export default db;
