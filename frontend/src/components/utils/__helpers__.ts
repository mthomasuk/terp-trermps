import { ReactElement } from "react";

export const getTestStyles = (
  StyledComponent: (args: any) => ReactElement,
  props: any,
  index = 0
) => {
  const componentClass = (StyledComponent as any)(props).type.styledComponentId;
  const components = document.getElementsByClassName(componentClass);

  return window.getComputedStyle(components[index]);
};
