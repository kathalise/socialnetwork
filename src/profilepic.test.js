import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

// test("When no url is passed, /default.jpg is used as a source", () => {
//     // container is our DOM (container instead of "document")
//     const { container } = render(<ProfilePic />);
//     console.log(container.querySelector("img").src).toBe("/default.png");
// });

// test("When a url is passed, that url is used as a source", () => {
//     const { container } = render(<ProfilePic imgUrl="/cute-puppy.jpg" />);
//     expect(container.querySelector("img").src.endsWith("/cute-puppy.jpg")).toBe(
//         true
//     );
// });

// test("First and last name in props get put in all attribute", () => {
//     const { container } = render(
//         <ProfilePic firstname="Lara" lastname="Croft" />
//     );
//     expect(container.querySelector("img").getAttribute("alt")).toBe(
//         "Lara Croft"
//     );
// });

test("onClick prop runs when the img is clicked", () => {
    const mockOnClick = jest.fn(() => console.log("CLICKED!!!!!"));
    const { container } = render(<ProfilePic toggleUploader={mockOnClick} />);
    fireEvent.click(container.querySelector("img"));
    expect(mockOnClick.mock.calls.length).toBe(1);
});
