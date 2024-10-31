const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const path = require("path");
const db = require("./db/connection");
const bodyParser = require("body-parser");
const Job = require("./models/Job");
const { where } = require("sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
  console.log(`Express rodando na porta ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//handlebars
app.set("views", path.join(__dirname, "views")); // indica o diretório base dos layouts na pasta views
app.engine("handlebars", engine({ defaultLayout: "main" })); // define o layout principal
app.set("view engine", "handlebars"); // define a biblioteca para redenrizar as views

//static folder
app.use(express.static(path.join(__dirname, "public"))); //indica qual é a pasta de arquivos estáticos

//db connection
db.authenticate()
  .then(() => {
    console.log("Conectou ao banco com sucesso!");
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao conectar: ", err);
  });

//routs
app.get("/", (req, res) => {
    let search = req.query.job;
    let query = '%'+search+'%';

    if (!search) {
        Job.findAll({order: [
            ["createdAt", "DESC"]// Chama todos os jobs e ordena por data de criação decrescente
        ]})
        .then(jobs => {
            res.render("index", {
                jobs,
            });
        })
        .catch(err => console.log(err));
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ["createdAt", "DESC"]// Chama todos os jobs e ordena por data de criação decrescente
        ]})
        .then(jobs => {
            res.render("index", {
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }
});

// jobs routs
app.use("/jobs", require("./routes/jobs"));
