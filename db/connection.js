const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite', //Qual banco irá utilizar
    storage: './db/app.db' //Onde está o banco
});

module.exports = sequelize