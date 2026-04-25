import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Json Toolkit workspace", () => {
    render(<App />);

    expect(
        screen.getByRole("button", { name: /refresh json toolkit/i }),
    ).toBeInTheDocument();
    expect(
        screen.getByPlaceholderText(/paste your json here/i),
    ).toBeInTheDocument();
    expect(
        screen.getByRole("button", { name: /format json/i }),
    ).toBeInTheDocument();
});
