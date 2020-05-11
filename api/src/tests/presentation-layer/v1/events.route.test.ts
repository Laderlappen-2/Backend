import * as supertest from "supertest"
import { describe, it, before, after } from "mocha"
import { expect, should } from "chai"
import { app } from "../../../app"
import { Response, Express } from "express"
import { EventTypeEnum, DrivingSession } from "../../../data-layer/models"

var drivingSession: DrivingSession
before(async () => {
    drivingSession = await new DrivingSession().save()
})

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

    it("POST (position event) should return 201 and Location header /v1/events/:id", (done) => {
        supertest(app)
            .post("/v1/events")
            .send({
                eventTypeId: EventTypeEnum.POSITION,
                drivingSessionId: drivingSession.id,
                eventData: {
                    positionX: 1.333,
                    positionY: 9.123324534
                },
                dateCreated: new Date()
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

    it("POST (collision avoidance event) should return 201 and Location header /v1/events/:id", (done) => {
        supertest(app)
            .post("/v1/events")
            .send({
                eventTypeId: EventTypeEnum.COLLISSION_AVOIDANCE,
                drivingSessionId: drivingSession.id,
                eventData: {
                    positionX: 1.337,
                    positionY: 69.69
                },
                dateCreated: new Date()
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

    it("POSTing multiple events should return 201 and contain a count and new event ids", (done) => {
        supertest(app)
            .post("/v1/drivingsessions/"+drivingSession.id+"/events")
            .send([
                {
                    eventTypeId: EventTypeEnum.COLLISSION_AVOIDANCE,
                    eventData: {
                        positionX: 1.337,
                        positionY: 69.69
                    },
                    dateCreated: new Date()
                },
                {
                    eventTypeId: EventTypeEnum.POSITION,
                    eventData: {
                        positionX: 1.333,
                        positionY: 9.123324534
                    },
                    dateCreated: new Date()
                }
            ])
            .expect(201)
            .end((err: any, res: supertest.Response) => {
                if(err) return done(err)

                expect(res.body).to.have.property("count")
                                        .to.be.a("number")
                        
                expect(res.body).to.have.property("eventIds")
                                        .to.be.an("array")

                done()
            })
    })

    it("POST should return invalid event type error", (done) => {
        supertest(app)
            .post("/v1/events")
            .send({
                eventTypeId: 0,
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

after(async () => {
    await drivingSession.destroy()
})