import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "..";
import { MockedProvider } from "@apollo/client/testing";

const mockOnCloseForm = jest.fn();

describe("ContactForm", () => {
  it("should not contain special characters for names", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ContactForm onCloseForm={mockOnCloseForm} />
      </MockedProvider>
    );

    const firstNameInput = screen.getByTestId("first-name");
    const lastNameInput = screen.getByTestId("last-name");

    await userEvent.type(firstNameInput, "John#");
    await userEvent.type(lastNameInput, "Doe");

    expect(
      await screen.findByText("Name must not contain special characters")
    ).toBeInTheDocument();
  });
});
