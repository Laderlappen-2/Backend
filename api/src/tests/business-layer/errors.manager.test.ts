import * as supertest from "supertest"
import { describe, it } from "mocha"
import { expect, should } from "chai"
import { NotFoundError, InvalidEventTypeError } from "../../data-layer/errors"
import { ErrorsManager } from "../../business-logic-layer/errors.manager"

describe("Errors manager", () => {

    const errorsManager: ErrorsManager = new ErrorsManager()    
    
    it("Should return all correct status codes", () => {

        // Construct
        const notFound: NotFoundError = new NotFoundError("TestObject", null)
        const invalidEventType: InvalidEventTypeError = new InvalidEventTypeError(0)

        expect(errorsManager.getStatusCode(notFound)).to.equal(404)
        expect(errorsManager.getStatusCode(invalidEventType)).to.equal(400)

    })

})