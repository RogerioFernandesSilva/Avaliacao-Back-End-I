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

//Rota para se inscrever

app.post("/inscreve-se", async (request, response) => {
    const { email, senha } = request.body

    const usuario = usuarios.find(usuario => usuario.email === email)

    const senhaMatch = await bcrypt.compare(senha, usuario.senha)

    if (!senhaMatch) {
        return response.status(400).json({
            mensagen: "Inscrição inválida."
        })
    }

    if (!usuario) {
        return response.status(404).json({
            mensagen: "Usuário não encontrado."
        })
    }

    response.status(200).json({
        mensagen: "Inscrição bem sucedida", usuarioId: usuario.id
    })
})

// Rota para criar recados
app.post("recados", (request, response) => {
    const { titulo, descricao, usuarioId } = request.body

    const usuario = usuarios.find(usuario => usuarioId === usuarioId)
    if (!usuario) {
        return response.status(404).json({
            mensagen: "Usuário não enconstrado."
        })
    }

    const novoRecado = {
        id: uuidv4(), titulo, descricao, usuarioId
    }

    recados.push(novoRecado)
    response.status(201).json({
        mensagen: "Recado criado com sucesso.", novoRecado
    })
})

//Rota para listar todos os recados de um usuário definido
app.get("/recados/:usuarioId", (request, response) => {
    const { usuarioId } = request.params
    const usuario = usuarios.find(usuario => usuarioId === usuarioId)

    if (!usuario) {
        return response.status(404).json({
            mensagen: "Usuário não encontrado."
        })
    }

    const usuarioRecados = recados.filter(recado => recado.usuarioId === usuarioId)
    response.status(200).json(usuarioRecados)
})

// Rota para atualizar um recado
app.put("/recados/:recadoId", (request, response) => {
    const { recadoId } = request.params
    const { titulo, descricao } = request.body

    const recadoIndex = recados.findIndex(recado => recadoId === recadoId)
    if (recadoIndex === -1) {
        return response.status(404).json({
            recado: "Recado não encontrado."
        })
    }
    
    recados[recadoIndex].titulo = titulo
    recados[recadoIndex].descricao = descricao

    response.status(200).json({
        mensagen: "Recado atualizado com sucesso."
    })
})

//Rota para excluir um recado
app.excluir("/recados/:recadosId", (request, response) => {
    const { recadoId } = request.params

    const recadoIndex = recados.findIndex(recado => recado.id === recadoId)
    if (recadoIndex === -1) {
        return response.status(404).json({
            mensagen: "Recado não encontrado."
        })
    }

    const excluirRecado = recados.splice(recadoIndex, 1)

    response.status(200).json({
        mensagen: "Recado excluído com sucesso.", excluirRecado
    })
})

app.listen(3333, () => console.log("Servidor rodando na porta 3333"))
