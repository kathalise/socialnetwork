import React from "react";
import App from "./app";
import { render, waitForElement } from "@testing-library/react";
import axios from "./axios";

// automatic mock - this is a jest thing, not a React thing
// this creates my "dumb" version of axios
jest.mock("./axios");

//this allows me to create a "dumb" copy of the response we get from axios
axios.get.mockResolvedValue({
    data: {
        id: 1,
    },
});

test("App eventually shows a div", async () => {
    const { container } = render(<App />);
    console.log("Lets look at the html that is rendered", container.innerHTML);
    await waitForElement(() => container.querySelector("div"));
    console.log("after waiting the html is: ", container.innerHTML);
    expect(container.querySelector("div").children.length).toBe(1);
});
