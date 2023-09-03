import express, { request, response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const app = express();
const port = 5000;

app.use(json());

const users = [];
const notes = [];

// Criação de conta
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'E-mail já existe.' });
  }

  const newUser = { id: v4(), name, email, password };
  users.push(newUser);

  res.status(201).json({ message: 'Usuário criado com sucesso' });
});

// Encriptando a senha para maior segurança
//const hashedPassword = await bcrypt.hash(password, 10)
    
// senha salva enciptada
//const newUser = { id: uuidv4(), nome, email, password: hashedPassword}

//users.push(newUser)

//response.status(201).json({
  //  mensagen: "Conta criada com sucesso.",
  //  user: newUser
//})

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  res.status(200).json({ message: 'Usuário Logado.', userId: user.id });
});

// CRUD de recados

// Create
app.post('/notes', (req, res) => {
  const { userId, title, description } = req.body;

  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const newNote = { id: v4(), userId, title, description };
  notes.push(newNote);

  res.status(201).json({ message: 'Nota criada com sucesso.', noteId: newNote.id });
});

// Read
app.get('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  const note = notes.find(note => note.id === noteId);

  if (!note) {
    return res.status(404).json({ message: 'Nota não encontrada.' });
  }

  res.status(200).json(note);
});

// Update
app.put('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  const { title, description } = req.body;

  const note = notes.find(note => note.id === noteId);

  if (!note) {
    return res.status(404).json({ message: 'Nota não encontrada.' });
  }

  note.title = title;
  note.description = description;

  res.status(200).json({ message: 'Nota atualizada com sucesso.' });
});

// Delete
app.delete('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;

  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Nota não encontrada.' });
  }

  notes.splice(noteIndex, 1);

  res.status(200).json({ message: 'Nota excluída com sucesso.' });
});

app.listen(port, () => {
  console.log(`O servidor está escutando na porta ${port}`);
});