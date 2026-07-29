import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/barbearia', express.static(path.join(__dirname, 'barbearia')));

// --- BASE DE DADOS EM MEMÓRIA (POPULADA DO BARBEARIA.SQL) ---

let servicesDB = [
  { id: 1, nome: 'Corte Tradicional / Moderno', categoria: 'Corte', valor: 25.00, comissao: 10.00, tempo: '30 min', ativo: 'Sim' },
  { id: 2, nome: 'Barba Completa com Toalha Quente', categoria: 'Barba', valor: 17.00, comissao: 8.50, tempo: '25 min', ativo: 'Sim' },
  { id: 3, nome: 'Combo Corte + Barba', categoria: 'Combo', valor: 38.00, comissao: 15.00, tempo: '50 min', ativo: 'Sim' },
  { id: 4, nome: 'Luzes / Mechas', categoria: 'Química', valor: 35.00, comissao: 8.00, tempo: '60 min', ativo: 'Sim' },
  { id: 5, nome: 'Progressiva / Alisamento', categoria: 'Química', valor: 50.00, comissao: 15.00, tempo: '80 min', ativo: 'Sim' },
  { id: 6, nome: 'Manicure / Pedicure', categoria: 'Estética', valor: 20.00, comissao: 6.00, tempo: '30 min', ativo: 'Sim' }
];

let barbersDB = [
  { id: 1, nome: 'Márcio Top Barber', cargo: 'Barbeiro Principal', telefone: '(83) 98739-2265', chave_pix: '83987392265', ativo: 'Sim' },
  { id: 2, nome: 'Hugo Freitas', cargo: 'Barbeiro Master', telefone: '(31) 97527-5084', chave_pix: '31975275084', ativo: 'Sim' },
  { id: 3, nome: 'Marcos Silva', cargo: 'Especialista em Barba', telefone: '(31) 98888-1111', chave_pix: '31988881111', ativo: 'Sim' },
  { id: 4, nome: 'Marcelo Santos', cargo: 'Barbeiro & Visagista', telefone: '(31) 97777-2222', chave_pix: '31977772222', ativo: 'Sim' }
];

let clientsDB = [
  { id: 1, nome: 'Cliente 1', telefone: '(54) 54841-1121', cartoes: 4, retorno: '2026-08-10' },
  { id: 2, nome: 'Cliente 2', telefone: '(74) 45454-5454', cartoes: 10, retorno: '2026-08-15' },
  { id: 3, nome: 'Hugo Freitas', telefone: '(31) 97527-5084', cartoes: 2, retorno: '2026-08-20' },
  { id: 4, nome: 'Cliente Teste', telefone: '(55) 56664-5454', cartoes: 6, retorno: '2026-08-25' }
];

let appointmentsDB = [
  { id: 101, cliente: 'Cliente 1', barbeiro: 'Márcio Top Barber', servico: 'Corte Tradicional / Moderno', data: '2026-07-28', hora: '14:00', status: 'Concluído', valor: 25.00 },
  { id: 102, cliente: 'Cliente 2', barbeiro: 'Hugo Freitas', servico: 'Barba Completa com Toalha Quente', data: '2026-07-28', hora: '15:30', status: 'Concluído', valor: 17.00 },
  { id: 103, cliente: 'Hugo Freitas', barbeiro: 'Márcio Top Barber', servico: 'Combo Corte + Barba', data: '2026-07-29', hora: '09:00', status: 'Agendado', valor: 38.00 },
  { id: 104, cliente: 'Cliente Teste', barbeiro: 'Marcos Silva', servico: 'Luzes / Mechas', data: '2026-07-29', hora: '10:30', status: 'Agendado', valor: 35.00 }
];

let productsDB = [
  { id: 1, nome: 'Pomada Modeladora Efeito Matte', categoria: 'Pomadas', estoque: 15, valor_compra: 18.00, valor_venda: 35.00 },
  { id: 2, nome: 'Óleo para Barba Hidratante', categoria: 'Cremes', estoque: 8, valor_compra: 14.00, valor_venda: 28.00 },
  { id: 3, nome: 'Shampoo Fortificante Masculino', categoria: 'Cremes', estoque: 12, valor_compra: 22.00, valor_venda: 42.00 },
  { id: 4, nome: 'Lâminas de Barba (Caixa 100u)', categoria: 'Lâminas', estoque: 25, valor_compra: 25.00, valor_venda: 45.00 }
];

let suppliersDB = [
  { id: 1, nome: 'Distribuidora Barber Pro', telefone: '(11) 98888-5555', produto: 'Pomadas & Cremes' },
  { id: 2, nome: 'Cosméticos Silva', telefone: '(31) 97777-4444', produto: 'Shampoos & Lâminas' }
];

let salesDB = [
  { id: 1, produto: 'Pomada Modeladora Efeito Matte', quantidade: 2, valor_total: 70.00, forma_pgto: 'Pix', data: '2026-07-28' },
  { id: 2, produto: 'Óleo para Barba Hidratante', quantidade: 1, valor_total: 28.00, forma_pgto: 'Cartão de Crédito', data: '2026-07-28' }
];

let commissionsDB = [
  { id: 1, barbeiro: 'Márcio Top Barber', servico: 'Corte Tradicional', comissao: 10.00, data: '2026-07-28', pago: 'Sim' },
  { id: 2, barbeiro: 'Hugo Freitas', servico: 'Barba Completa', comissao: 8.50, data: '2026-07-28', pago: 'Não' }
];

let payablesDB = [
  { id: 1, descricao: 'Aluguel do Salão', valor: 1200.00, vencimento: '2026-08-05', pago: 'Não' },
  { id: 2, descricao: 'Conta de Energia', valor: 380.00, vencimento: '2026-08-10', pago: 'Sim' }
];

let receivablesDB = [
  { id: 1, descricao: 'Pacote Mensal Cliente 1', valor: 150.00, vencimento: '2026-08-01', pago: 'Sim' },
  { id: 2, descricao: 'Venda de Produtos em Atacado', valor: 280.00, vencimento: '2026-08-12', pago: 'Não' }
];

// --- ENDPOINTS REST ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'barbearia', environment: 'production' });
});

// Serviços & Categorias
app.get('/api/servicos', (req, res) => res.json(servicesDB));
app.post('/api/servicos', (req, res) => {
  const newService = { id: Date.now(), ...req.body, ativo: 'Sim' };
  servicesDB.push(newService);
  res.status(201).json(newService);
});
app.delete('/api/servicos/:id', (req, res) => {
  servicesDB = servicesDB.filter(s => s.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// Barbeiros / Funcionários
app.get('/api/barbeiros', (req, res) => res.json(barbersDB));
app.post('/api/barbeiros', (req, res) => {
  const newBarber = { id: Date.now(), ...req.body, ativo: 'Sim' };
  barbersDB.push(newBarber);
  res.status(201).json(newBarber);
});

// Clientes
app.get('/api/clientes', (req, res) => res.json(clientsDB));
app.post('/api/clientes', (req, res) => {
  const newClient = { id: Date.now(), cartoes: 1, ...req.body };
  clientsDB.push(newClient);
  res.status(201).json(newClient);
});

// Agendamentos
app.get('/api/agendamentos', (req, res) => res.json(appointmentsDB));
app.post('/api/agendamentos', (req, res) => {
  const newAppointment = {
    id: Date.now(),
    cliente: req.body.cliente || 'Cliente Agendado',
    barbeiro: req.body.barbeiro || 'Márcio Top Barber',
    servico: req.body.servico || 'Corte Tradicional / Moderno',
    data: req.body.data || new Date().toISOString().split('T')[0],
    hora: req.body.hora || '14:00',
    status: 'Agendado',
    valor: req.body.valor || 25.00
  };
  appointmentsDB.unshift(newAppointment);
  res.status(201).json({ success: true, appointment: newAppointment });
});
app.patch('/api/agendamentos/:id/status', (req, res) => {
  const appt = appointmentsDB.find(a => a.id === parseInt(req.params.id));
  if (appt) appt.status = req.body.status;
  res.json({ success: true, appointment: appt });
});

// Produtos & Estoque
app.get('/api/produtos', (req, res) => res.json(productsDB));
app.post('/api/produtos', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  productsDB.push(newProduct);
  res.status(201).json(newProduct);
});

// Fornecedores & Financeiro
app.get('/api/fornecedores', (req, res) => res.json(suppliersDB));
app.get('/api/vendas', (req, res) => res.json(salesDB));
app.post('/api/vendas', (req, res) => {
  const newSale = { id: Date.now(), data: new Date().toISOString().split('T')[0], ...req.body };
  salesDB.unshift(newSale);
  res.status(201).json(newSale);
});
app.get('/api/comissoes', (req, res) => res.json(commissionsDB));
app.get('/api/pagar', (req, res) => res.json(payablesDB));
app.get('/api/receber', (req, res) => res.json(receivablesDB));

// Autenticação Admin
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const validEmails = ['admin@admin.com', 'admin@admin', 'helpus.ecommerce@gmail.com'];
  const validPasswords = ['123', 'admin123', '@dmLocal1993'];

  const normalizedEmail = (email || '').trim().toLowerCase();

  if (validEmails.includes(normalizedEmail) && validPasswords.includes(password)) {
    return res.json({
      success: true,
      access_token: 'token_barbearia_legacy_' + Date.now(),
      user: {
        id: 1,
        name: 'Administrador Barbearia',
        email: normalizedEmail,
        role: 'admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    detail: 'E-mail ou senha inválidos.'
  });
});

// Rota Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Barbearia Completo rodando na porta ${PORT}`);
});
