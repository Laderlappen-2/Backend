import * as supertest from "supertest"
import { describe, it } from "mocha"
import { expect, should } from "chai"
import { app } from "../../../app"
import { Response } from "express"

before((done) => {
    app.on("database_ready", done)
})

describe("/v1/events/position", () => {

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
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)
                done()
            })
    })

    // it("POST should return 201 and Location header /v1/events/position/:id", (done) => {
    //     supertest(app)
    //         .post("/v1/events/position")
    //         .send({
    //             positionEventType: 1,
    //             drivingSessionId: 1,
    //             event: {
    //                 positionX: 0,
    //                 positionY: 0,
    //                 positionZ: 0,
    //             }
    //         })
    //         .expect(201)
    //         .expect("Location", /\/v1\/events\/position\/[0-9]+/)
    //         .end((err: any, res: supertest.Response) => {
    //             if(err) return done(err)

    //             expect(res.body).to.have.property("id")
    //                                     .to.be.a("number")

    //             done()
    //         })
    // })

})