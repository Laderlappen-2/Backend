import { Sequelize } from "sequelize-typescript"
import * as models from "./models"

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'backend-db.sqlite',
    models: Object.keys(models),
})