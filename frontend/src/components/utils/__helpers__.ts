import { ReactElement } from "react";

// https://the-teacher.medium.com/how-to-test-a-react-components-css-styles-with-react-testing-library-rtl-styled-components-43f744334528
export const getTestStyles = (
  StyledComponent: (args: any) => ReactElement,
  props: any,
  index = 0
) => {
  const componentClass = (StyledComponent as any)(props).type.styledComponentId;
  const components = document.getElementsByClassName(componentClass);

  return window.getComputedStyle(components[index]);
};
