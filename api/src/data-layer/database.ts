import { Sequelize } from "sequelize-typescript"

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'backend-db.sqlite',
    models: [__dirname + "/models/*.model.ts"],
    modelMatch: (filename, member) => {
        // filename = filnamn :^)
        // member = klassnamn
        var val = filename.substr(0, filename.indexOf(".model")).toLowerCase() === member.toLowerCase()
        return val
    },
    logging: process.env.NODE_ENV?.trim() != "test"
})