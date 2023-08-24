import express, { request, response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const app = express()

const usuarios = []
const recados = []

app.use(express.json())

// Cadastrar Usuários
app.post("/inscreve-se", async (request, response) => {
    const { nome, email, senha } = request.body

    // Verifica se há usuário com esse e-mail cadastrado
    const emailJaRegistrado = usuarios.find(usuario => usuario.email === email)

    if (emailJaRegistrado) {
        return response.status(400).json({
            mensagen: "E-mail já cadastrado."
        })
    }
    // Encriptando a senha para maior segurança
    const hashedSenha = await bcrypt.hash(senha, 10)
    
    // senha salva enciptada
    const novoUsuario = { id: uuidv4(), nome, email, senha: hashedSenha}

    usuarios.push(novoUsuario)

    response.status(201).json({
        mensagen: "Conta criada com sucesso.",
        usuario: novoUsuario
    })
})