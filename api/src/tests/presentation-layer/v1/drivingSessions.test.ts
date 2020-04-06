import * as supertest from "supertest"
import { describe, it } from "mocha"
import { should, assert, expect } from "chai"
import { app } from "../../../app"
import { Response } from "express"

describe("/drivingsessions", () => {

    it("POST should give status 201 and Location header /v1/drivingsessions/:id", (done) => {
        
        supertest(app)
            .post('/v1/drivingsessions')
            .expect(201)
            .expect("Location", /\/v1\/drivingsessions\/[0-9]+/)
            .expect(201, (res: Response) => {
                expect(res).to.have
                    .property("id")
                        .to.be.a("number")
                    .property("collisions")
                    .property("paths")
            })
            .end((error: Error, res: Response) => {
                assert(!error, error.toString())
                done()
            })

    })
})