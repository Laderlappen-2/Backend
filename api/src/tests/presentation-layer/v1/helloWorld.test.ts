import * as supertest from "supertest"
import { describe, it } from "mocha"
import { app } from "../../../app"
import { Response } from "express"


// describe("/v1/helloworld", () => {
//     it("Get status code 200", (done) => {
//         supertest(app)
//         .get('/v1/helloworld')
//         .expect(200)
//         .end((err: any, res: supertest.Response) => {
//             if (err) throw err
//             done()
//         })
//     })
// })