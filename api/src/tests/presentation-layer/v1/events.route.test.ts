import * as supertest from "supertest"
import { describe, it } from "mocha"
import { expect, should } from "chai"
import { app } from "../../../app"
import { Response, Express } from "express"

describe("/v1/events", () => {

    it("GET should give status 200 and pagination result", (done) => {
        supertest(app)
            .get("/v1/events")
            .expect(200)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(res.body).to.have.property("results")
                                        .to.be.an("array")

                expect(res.body.limit).to.equal(0)
            
                done()
            })
    })

    it("POST should return 201 and Location header /v1/events/:id", (done) => {
        supertest(app)
            .post("/v1/events")
            .send({
                eventType: 5,
                drivingSessionId: 1,
                eventData: {
                    positionX: 1.333,
                    positionY: 9.123324534,
                    positionZ: 7.2
                }
            })
            .expect(201)
            .expect("Location", /\/v1\/events\/[0-9]+/)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(res.body).to.have.property("id")
                                        .to.be.a("number")

                done()
            })
    })

    it("POST should return invalid event type error", (done) => {
        supertest(app)
            .post("/v1/events")
            .send({
                eventType: 0,
                drivingSessionId: 1,
                eventData: {
                    positionX: 1.333,
                    positionY: 9.123324534,
                    positionZ: 7.2
                }
            })
            // TODO Implement status code expectation
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                // TODO Implement error check

                done()
            })
    })

})