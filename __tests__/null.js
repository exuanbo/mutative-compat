"use strict"
import {produce} from "../src/immer"

describe("null functionality", () => {
	const baseState = null

	it("should return the original without modifications", () => {
		const nextState = produce(baseState, () => {})
		expect(nextState).toBe(baseState)
	})
})
