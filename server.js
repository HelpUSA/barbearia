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

// Servir arquivos estáticos da pasta public e barbearia legada
app.use(express.static(path.join(__dirname, 'public')));
app.use('/barbearia', express.static(path.join(__dirname, 'barbearia')));

// Banco de Dados em Memória Populado do barbearia.sql
const servicesDB = [
  { id: 1, nome: 'Corte Tradicional / Moderno', categoria: 'Corte', valor: 25.00, comissao: 10.00, tempo: '30 min', ativo: 'Sim', foto: 'CORTE-01.png' },
  { id: 2, nome: 'Barba Completa com Toalha Quente', categoria: 'Barba', valor: 17.00, comissao: 8.50, tempo: '25 min', ativo: 'Sim', foto: 'BARBA-01.png' },
  { id: 3, nome: 'Combo Corte + Barba', categoria: 'Combo', valor: 38.00, comissao: 15.00, tempo: '50 min', ativo: 'Sim', foto: 'COMBO-01.png' },
  { id: 4, nome: 'Luzes / Mechas', categoria: 'Química', valor: 35.00, comissao: 8.00, tempo: '60 min', ativo: 'Sim', foto: 'LUZES-01.png' },
  { id: 5, nome: 'Progressiva / Alisamento', categoria: 'Química', valor: 50.00, comissao: 15.00, tempo: '80 min', ativo: 'Sim', foto: 'PROGRESSIVA.png' },
  { id: 6, nome: 'Manicure / Pedicure', categoria: 'Estética', valor: 20.00, comissao: 6.00, tempo: '30 min', ativo: 'Sim', foto: 'MANICURE.png' }
];

const barbersDB = [
  { id: 1, nome: 'Márcio Top Barber', cargo: 'Barbeiro Principal', telefone: '(83) 98739-2265', foto: 'marcio.jpg', ativo: 'Sim' },
  { id: 2, nome: 'Hugo Freitas', cargo: 'Barbeiro Master', telefone: '(31) 97527-5084', foto: 'hugo.jpg', ativo: 'Sim' },
  { id: 3, nome: 'Marcos Silva', cargo: 'Especialista em Barba', telefone: '(31) 98888-1111', foto: 'marcos.jpg', ativo: 'Sim' },
  { id: 4, nome: 'Marcelo Santos', cargo: 'Barbeiro & Visagista', telefone: '(31) 97777-2222', foto: 'marcelo.jpg', ativo: 'Sim' }
];

const clientsDB = [
  { id: 1, nome: 'Cliente 1', telefone: '(54) 54841-1121', cartoes: 4, retorno: '2026-08-10' },
  { id: 2, nome: 'Cliente 2', telefone: '(74) 45454-5454', cartoes: 10, retorno: '2026-08-15' },
  { id: 3, nome: 'Hugo Freitas', telefone: '(31) 97527-5084', cartoes: 2, retorno: '2026-08-20' },
  { id: 4, nome: 'Cliente Teste', telefone: '(55) 56664-5454', cartoes: 6, retorno: '2026-08-25' }
];

const appointmentsDB = [
  { id: 101, cliente: 'Cliente 1', barbeiro: 'Márcio Top Barber', servico: 'Corte Tradicional / Moderno', data: '2026-07-28', hora: '14:00', status: 'Concluído', valor: 25.00 },
  { id: 102, cliente: 'Cliente 2', barbeiro: 'Hugo Freitas', servico: 'Barba Completa com Toalha Quente', data: '2026-07-28', hora: '15:30', status: 'Concluído', valor: 17.00 },
  { id: 103, cliente: 'Hugo Freitas', barbeiro: 'Márcio Top Barber', servico: 'Combo Corte + Barba', data: '2026-07-29', hora: '09:00', status: 'Agendado', valor: 38.00 },
  { id: 104, cliente: 'Cliente Teste', barbeiro: 'Marcos Silva', servico: 'Luzes / Mechas', data: '2026-07-29', hora: '10:30', status: 'Agendado', valor: 35.00 }
];

const productsDB = [
  { id: 1, nome: 'Pomada Modeladora Efeito Matte', categoria: 'Pomadas', estoque: 15, valor: 35.00 },
  { id: 2, nome: 'Óleo para Barba Hidratante', categoria: 'Cremes', estoque: 8, valor: 28.00 },
  { id: 3, nome: 'Shampoo Fortificante Masculino', categoria: 'Cremes', estoque: 12, valor: 42.00 },
  { id: 4, nome: 'Lâminas de Barberia (Caixa 100u)', categoria: 'Lâminas', estoque: 25, valor: 45.00 }
];

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'barbearia', environment: 'production' });
});

// APIs Públicas
app.get('/api/servicos', (req, res) => {
  res.json(servicesDB);
});

app.get('/api/barbeiros', (req, res) => {
  res.json(barbersDB);
});

app.get('/api/agendamentos', (req, res) => {
  res.json(appointmentsDB);
});

app.post('/api/agendamentos', (req, res) => {
  const { cliente, barbeiro, servico, data, hora } = req.body;
  const newAppointment = {
    id: Date.now(),
    cliente: cliente || 'Cliente Agendado',
    barbeiro: barbeiro || 'Márcio Top Barber',
    servico: servico || 'Corte Tradicional / Moderno',
    data: data || '2026-07-29',
    hora: hora || '10:00',
    status: 'Agendado',
    valor: 25.00
  };
  appointmentsDB.unshift(newAppointment);
  res.status(201).json({ success: true, appointment: newAppointment });
});

app.get('/api/clientes', (req, res) => {
  res.json(clientsDB);
});

app.get('/api/produtos', (req, res) => {
  res.json(productsDB);
});

// API de Autenticação para Painel Admin
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
  console.log(`✅ Servidor Barbearia rodando com sucesso na porta ${PORT}`);
});
