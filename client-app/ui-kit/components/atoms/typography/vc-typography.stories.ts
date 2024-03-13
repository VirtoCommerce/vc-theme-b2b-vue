import { VcTypography } from "..";
import type { Meta, StoryFn } from "@storybook/vue3";

const VARIANTS = ["h1", "h2", "h3", "h4", "h5", "h6", "base"];
const WEIGHTS = ["thin", "light", "normal", "bold", "black"];

export default {
  title: "Components/Atoms/VcTypography",
  component: VcTypography,
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      type: { name: "string", required: false },
      table: {
        type: {
          summary: VARIANTS.join(" | "),
        },
      },
    },
    weight: {
      control: "select",
      options: WEIGHTS,
      type: { name: "string", required: false },
      table: {
        type: {
          summary: WEIGHTS.join(" | "),
        },
      },
    },
  },
} as Meta<typeof VcTypography>;

const Template: StoryFn<typeof VcTypography> = (args) => ({
  components: { VcTypography },
  setup: () => ({ args }),
  template: '<VcTypography v-bind="args">Lorem ipsum DOLOR</VcTypography>',
});

export const Basic = Template.bind({});

export const H1 = Template.bind({});
H1.args = {
  tag: "h1",
};

export const H2 = Template.bind({});
H2.args = {
  tag: "h2",
};

export const H3 = Template.bind({});
H3.args = {
  tag: "h3",
};

export const H1FontWeightNormal = Template.bind({});
H1FontWeightNormal.args = {
  tag: "h1",
  weight: "normal",
};

export const H1TextTransformNone = Template.bind({});
H1TextTransformNone.args = {
  tag: "h1",
  textTransform: "none",
};
