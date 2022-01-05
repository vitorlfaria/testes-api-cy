/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then(res => {
               expect(res.status).to.equal(200)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario("Fulano de tal", `beltrano${Math.floor(Math.random() * 100)}@qa.com.br`, "teste", "true")
               .then(res => {
                    expect(res.status).to.equal(201)
                    expect(res.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Fulano de tal", "beltrano@qa.com.br", "teste", "true")
               .then(res => {
                    expect(res.status).to.equal(400)
                    expect(res.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let email = `beltrano${Math.floor(Math.random() * 100)}@qa.com.br`
          cy.cadastrarUsuario("Fulano de tal", email, "teste", "true")
               .then(res => {
                    let id = res.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body: {
                              "nome": "Fulano da Silva",
                              "email": email,
                              "password": "teste",
                              "administrador": "true"
                         }
                    }).then(res => {
                         expect(res.status).to.equal(200)
                         expect(res.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let email = `beltrano${Math.floor(Math.random() * 100)}@qa.com.br`
          cy.cadastrarUsuario("Fulano de tal", email, "teste", "true")
               .then(res => {
                    let id = res.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                    }).then(res => {
                         expect(res.status).to.equal(200)
                         expect(res.body.message).to.equal('Registro excluído com sucesso')
                    })
               })
     });


});
