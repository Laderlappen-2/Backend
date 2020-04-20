import * as supertest from "supertest"
import { describe, it } from "mocha"
import { expect, should } from "chai"
import { app } from "../../../app"
import { Response, Express } from "express"

describe("/v1/drivingsessions", () => {

    var createdId: number
    it("POST should give status 201 and Location header /v1/drivingsessions/:id", (done) => {
        
        supertest(app)
            .post('/v1/drivingsessions')
            .expect(201)
            .expect("Location", /\/v1\/drivingsessions\/[0-9]+/)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)
                
                expect(res.body).to.have.property("id")
                                        .to.be.a("number")
                
                expect(res.body).to.have.property("collisions")
                expect(res.body).to.have.property("paths")

                createdId = res.body.id
                
                done()
            })
    })

    it("GET should give status 200 and pagination result", (done) => {
        supertest(app)
            .get("/v1/drivingsessions")
            .expect(200)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(res.body).to.have.property("results")
                                        .to.be.an("array")

                expect(res.body.limit).to.equal(0)
            
                done()
            })
    })

    it("GET should give status 200 and a driving session object", (done) => {        
        supertest(app)
            .get("/v1/drivingsessions/" + createdId)
            .expect(200)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(res.body).to.have.property("id")
                                        .to.be.a("number")
                
                expect(res.body).to.have.property("collisions")
                                        .to.be.an("array")

                expect(res.body).to.have.property("paths")
                                        .to.be.an("array")

                done()
            })
    })

    it("DELETE should give status 204 and an empty body", (done) => {
        supertest(app)
            .delete("/v1/drivingsessions/" + createdId)
            .expect(204)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(Object.keys(res.body).length).to.equal(0)

                done()
            })
    })
})