import { Sequelize } from "sequelize-typescript"

// export const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'backend-db.sqlite',
//     models: [__dirname + "/models/*.model.ts"],
//     modelMatch: (filename, member) => {
//         // filename = filnamn :^)
//         // member = klassnamn
//         var val = filename.substr(0, filename.indexOf(".model")).toLowerCase() === member.toLowerCase()
//         return val
//     },
//     logging: process.env.NODE_ENV?.trim() != "test"
// })

var url: string
switch(process.env.NODE_ENV) {
    case "test":
    case "development": {
        url = "postgres://root:test@postgres:5432/backend"
        break
    }
    case "production": {
        url = process.env.POSTGRES_URL
        break
    }
}

export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    //storage: 'backend-db.sqlite',
    models: [__dirname + "/models/*.model.ts"],
    modelMatch: (filename, member) => {
        // filename = filnamn :^)
        // member = klassnamn
        var val = filename.substr(0, filename.indexOf(".model")).toLowerCase() === member.toLowerCase()
        return val
    },
    logging: process.env.NODE_ENV?.trim() != "test"
})