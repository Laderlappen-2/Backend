import * as supertest from "supertest"
import { describe, it } from "mocha"
import { app } from "../../../app"
import { Response } from "express"


describe("/helloworld", () => {
    it("Get status code 200", (done) => {
        supertest(app)
        .get('/helloworld')
        .expect(200)
        .end(function(err, res: Response) {
            if (err) throw err
            done()
        })
    })
})