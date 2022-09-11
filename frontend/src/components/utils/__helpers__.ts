/* eslint-disable no-useless-escape */
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

export const toTitleCase = (str: string) =>
  str
    .split("_")
    .map((part: string) =>
      part.replace(
        /\w\S*/g,
        (txt) => `${txt.charAt(0).toUpperCase()}${txt.substr(1).toLowerCase()}`
      )
    )
    .join(" ");

const componentToHex = (c: number): string => {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = (rgb: string): string => {
  try {
    if (rgb.indexOf("#") === 0) {
      return rgb;
    }

    const [r, g, b] = rgb
      .replace(/[rgba\(\)\s]/g, "")
      .split(",")
      .map((s) => parseInt(s));

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  } catch (error) {
    throw new Error(
      `Failed to convert rgb input (${rgb}) to hex: ${(error as Error).message}`
    );
  }
};
