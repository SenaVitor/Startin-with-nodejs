const express = require('express');
const {randomUUID} = require("crypto");

const app = express();

app.use(express.json());

const products = [];

/*
POST => Inserir
GET => Buscar
PUT => Alterar
DELETE => Remover

Body => Utilizado para enviar dados para a aplicação
Params => /product/abc -> parâmetros de rota. Não são obrigatórios (/)
Query => /product?id=123&value=2 -> parâmetros que fazem parte da rota mas não são obrigatórios (?)
*/

app.post("/products", (request, response) => {

    const { name, price } = request.body;
    const product = {
        name,
        price,
        id: randomUUID(), 
    }
    
    products.push(product);
    
    return response.json(product);

});

app.get("/products", (request, response) => {
    return response.json(products);
});

app.get("/products/:id", (request, response) => {
    const {id} = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product);
})

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));