jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

describe("authSlice", () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
  });

  it("stores tokens and user data on login", async () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    const { default: reducer, authActions } = await import("./authSlice");

    const initialState = {
      accessToken: null,
      refreshToken: null,
      user: null,
    };

    const nextState = reducer(
      initialState,
      authActions.login({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "1",
          name: "Denys",
          email: "tabakdenuc@gmail.com",
        },
      })
    );

    expect(nextState.accessToken).toBe("access-token");
    expect(nextState.refreshToken).toBe("refresh-token");
    expect(nextState.user).toEqual({
      id: "1",
      name: "Denys",
      email: "tabakdenuc@gmail.com",
    });
    expect(localStorage.getItem("accessToken")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");

    consoleLogSpy.mockRestore();
  });
});
