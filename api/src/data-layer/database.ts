import { Sequelize } from "sequelize-typescript"

/**
 * The database instance for the whole application
 */
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    models: [__dirname + "/models/*.model.ts"],
    modelMatch: (filename, member) => {
        // filename = filnamn :^)
        // member = klassnamn
        var val = filename.substr(0, filename.indexOf(".model")).toLowerCase() === member.toLowerCase()
        return val
    },
    logging: process.env.NODE_ENV?.trim() != "test"
})