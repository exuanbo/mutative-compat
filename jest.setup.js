let warn

beforeAll(() => {
  warn = jest.spyOn(console, "warn").mockImplementation(() => {})
})

afterAll(() => {
  warn.mock.calls.forEach((call) => {
    expect(call).toEqual([
      "The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance.",
    ])
  })
  warn.mockRestore()
})
