import React from "react";
import CheckoutButton from "./CheckoutButton";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer
    .create(<CheckoutButton total={19.0} savingsTotal={18.22} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("Button executes onClick function", () => {
  // Create the mock function
  const fn = jest.fn();
  // crate the component
  const component = renderer.create(<CheckoutButton onClick={fn} />);
  //Simulate button click
  const button = component.root.findByType("button");
  button.props.onClick();
  //Verify callback is invoked
  expect(fn.mock.calls.length).toBe(1);
});

test("Displays proper number formatting", () => {
  let input = 19.0000001;
  const tree = renderer.create(<CheckoutButton total={input} />).toJSON();
  expect(tree).toMatchSnapshot();
});
