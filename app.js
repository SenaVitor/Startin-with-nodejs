const express = require('express');
const {randomUUID} = require("crypto");
const fs = require("fs");
const { response } = require('express');
const { json } = require('stream/consumers');

const app = express();

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    }else{
        products = JSON.parse(data);
    }
});

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

    productFile();

    return response.json(product);

});

app.get("/products", (request, response) => {
    return response.json(products);
});

app.get("/products/:id", (request, response) => {
    const {id} = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product);
});

app.put("/products/:id", (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;
    console.log("nome: " + name + " preço: " + price);
    const productIndex = products.findIndex((product) => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
    };
    
    productFile();

    return response.json({ message: "Produto alterado com sucesso" });
});

app.delete("/products/:id", (request, response) => {
    const {id} = request.params;
    const productIndex = products.findIndex((product) => product.id === id);
    products.splice(productIndex, 1);
    productFile();
    return response.json({ message: "Produto removido com sucesso" });
})

function productFile(){
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("Produto inserido");
        }
    });
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));