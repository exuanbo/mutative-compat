import {produce, produceWithPatches, applyPatches} from "../src/immer"

// !!! This is different from immer

test("error when using Maps", () => {
	expect(() => {
		produce(new Map(), function() {})
	}).not.toThrowError()
})

test("error when using patches - 1", () => {
	expect(() => {
		produce(
			{},
			function() {},
			function() {}
		)
	}).not.toThrowError()
})

test("error when using patches - 2", () => {
	expect(() => {
		produceWithPatches({}, function() {})
	}).not.toThrowError()
})

test("error when using patches - 3", () => {
	expect(() => {
		applyPatches({}, [])
	}).not.toThrowError()
})
