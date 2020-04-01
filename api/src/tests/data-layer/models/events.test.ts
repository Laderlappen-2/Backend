import { describe, it } from "mocha"
import { Sequelize } from "sequelize-typescript"
import * as models from "../../../data-layer/models"

var sequelize: Sequelize

describe("sequelize", () => {
    it("setup", (done) => {
        sequelize = new Sequelize({
            database: 'testdb',
            dialect: 'sqlite',
            storage: ':memory:',
            models: Object.keys(models)
        })
        sequelize.sync()
        done()
    })
})