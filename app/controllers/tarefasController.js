
//requisição do Model uso onrigatório de chaves e nome definido no objeto
const { tarefasModel } = require("../models/tarefasModel");

const { body, validationResult } = require("express-validator");

const moment = require("moment");
moment.locale('pt-br');

const tarefasController = {

    // array de validações
    validarFormCad:[
         body("tarefa").isLength({ min: 5, max: 45 }).withMessage("Nome da tarefa deve ter de 5 a 45 caracteres!"),
            body("situacao").isInt({ min: 0, max: 4 }).withMessage("Situação deve ser um inteiro de 0 a 4"),
            body("prazo").isISO8601().withMessage("A data deve ser válida!"),
            body("prazo").custom((value) => {
                let hoje = moment().format("L");
                let prazo = moment(value).format("L");
                if (moment(prazo).isSameOrAfter(hoje)) {
                    return true;
                } else {
                    throw new Error("A data deve ser hoje ou no futuro!");
                }
        
            }),
    ],

    //funções para executar ações

    listarTarefas: async function (req, res) {
        res.locals.moment = moment;
        //recuperar a página solicitada caso não exista será a página 1
        let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
        //definir a qtde de registros por página
        let qtdePagina = 5;
        //definir o offset em relação a pagina atual
        let offset = (paginaAtual - 1) * qtdePagina;
        //definir o número de páginas de resultados
        let totalPaginas = Math.ceil(await tarefasModel.totRegistros() / qtdePagina);

        if (totalPaginas > 1) {
            var paginador = { "paginaAtual": paginaAtual, "totalPaginas": totalPaginas }
        } else {
            var paginador = null
        }


        try {
            const linhas = await tarefasModel.findAll(offset, qtdePagina);
            res.render("pages/index", { linhasTabela: linhas, "notificador": paginador });
        } catch (erro) {
            console.log(erro);
        }
    },


    exibirCadastro: (req, res) => {
        res.locals.moment = moment;
        res.render("pages/cadastro", {
            "listaErros": null,
            tituloAba: "Cadastro de tarefa", tituloPagina: "Nova Tarefa",
            tarefa: { id_tarefa: 0, nome_tarefa: "", prazo_tarefa: "", situacao_tarefa: 1 }
        });
    }


}


module.exports = { tarefasController }