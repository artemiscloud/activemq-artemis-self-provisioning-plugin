import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import "@patternfly/patternfly/utilities/BackgroundColor/BackgroundColor.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Flex/flex.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Text/text.css";
import "@patternfly/react-core/dist/styles/base.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      xs: {
        name: "Breakpoint: xs",
        styles: {
          width: "400px",
          height: "100%",
        },
      },
      sm: {
        name: "Breakpoint: sm",
        styles: {
          width: "576px",
          height: "100%",
        },
      },
      md: {
        name: "Breakpoint: md",
        styles: {
          width: "768px",
          height: "100%",
        },
      },
      lg: {
        name: "Breakpoint: lg",
        styles: {
          width: "992px",
          height: "100%",
        },
      },
      xl: {
        name: "Breakpoint: xl",
        styles: {
          width: "1200px",
          height: "100%",
        },
      },
      "2xl": {
        name: "2Breakpoint: xl",
        styles: {
          width: "1450px",
          height: "100%",
        },
      },
    },
  },
}