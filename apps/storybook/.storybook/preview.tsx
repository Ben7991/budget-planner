import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";

const preview: Preview = {
  initialGlobals: {
    theme: "light",
  },
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);

      return (
        <div className={isDark ? "dark" : undefined}>
          <div className="min-h-16 bg-background p-6 text-foreground">
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
