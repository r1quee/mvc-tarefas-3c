var express = require("express");
var router = express.Router();

const moment = require("moment");
moment.locale('pt-br');

const { body, validationResult } = require("express-validator");

const {tarefasController} = require("../controllers/tarefasController");


router.get("/", async function (req, res) {
   tarefasController.listarTarefas(req, res);
});


router.get("/cadastro", (req, res) => {
    tarefasController.exibirCadastro(req, res);
});


router.get("/alterar", async (req, res) => {
    res.locals.moment = moment;
    //recuperar o id da queryString
    const id = req.query.id;
    try {
        const tarefa = await tarefasModel.findById(id);

        res.render("pages/cadastro", {
            tituloAba: "Edição de tarefa", tituloPagina: "Alterar Tarefa",
            tarefa: tarefa[0]
        });
    } catch (erro) {
        console.log(erro);
    }
});


// adicionar validação de dados com o express-validator
// nome - 5 a 45 caracteres
// prazo data válida e hoje ou no futuro
// situação - inteiro de 0 a 4 
router.post("/cadastro", tarefasController.validarFormCad ,
   
    async (req, res) => {
        res.locals.moment = moment;
        let listaErros = validationResult(req);

        if (listaErros.isEmpty()) {
            // vazio ==  sem erros
            const objJson = {
                id: req.body.id,
                nome: req.body.tarefa,
                prazo: req.body.prazo,
                situacao: req.body.situacao
            }

            try {
                if (objJson.id == 0) {
                    var result = await tarefasModel.create(objJson);
                } else {
                    var result = await tarefasModel.update(objJson);
                }
                console.log(result);
                res.redirect("/");
            } catch (erro) {
                console.log(erro)
            }
        } else {
            console.log(listaErros);
            if (req.query.id == 0) {
                var tituloAba = "Cadastro de tarefa";
                var tituloPagina = "Nova Tarefa";
            } else {
                var tituloAba = "Edição de tarefa";
                var tituloPagina = "Alterar Tarefa";
            }
            res.render("pages/cadastro", {
                "listaErros": listaErros,
                "tituloAba": tituloAba, "tituloPagina": tituloPagina,
                tarefa: { id_tarefa: req.body.id, nome_tarefa: req.body.tarefa, prazo_tarefa: req.body.prazo, situacao_tarefa: req.body.situacao }
            })
        }


    });


router.get("/teste-insert", async (req, res) => {
    const dadosInsert = {
        nome: "instalar o fortnite no Lab 1 Terreo",
        prazo: "2026-03-19"
    }
    try {
        const resultInsert = await tarefasModel.create(dadosInsert);
        res.send(resultInsert)
    } catch (erro) {
        console.log(erro);
    }

});


//delete físico - hard delete
router.get("/teste-delete", async (req, res) => {
    let idTarefa = 17;
    try {
        res.send(resultDelete)
    } catch (erro) {
        console.log(erro);
    }
});

//exercicio - teste de update -> delete lógico ou soft delete
//delete lógico - soft delete
router.get("/teste-soft-delete", async (req, res) => {
    let idTarefa = 15;
    try {
        res.send(resultUpdate);
    } catch (erro) {
        console.log(erro);
    }
});






module.exports = router;