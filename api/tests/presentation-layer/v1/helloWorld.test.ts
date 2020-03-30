import * as supertest from "supertest"
import { describe, it } from "mocha"
import { app } from "../../../src/app"

describe("/helloworld", () => {
    it("Get status code 200", () => {
        supertest(app)
        .get('/helloworld')
        .expect(200)
        .end(function(err, res) {
            if (err) throw err
        })
    })
})