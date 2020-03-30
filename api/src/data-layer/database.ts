import { Sequelize } from "sequelize-typescript"

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'backend-db.sqlite',
    models: [ __dirname + '/models/*.model.js' ],
})