import { VcChip, VcIcon } from "..";
import type { Meta, StoryFn } from "@storybook/vue3";

const SIZES = ["xs", "sm", "md", "lg"];
const COLORS = ["primary", "secondary", "success", "info", "neutral", "warning", "danger"];
const VARIANTS = ["solid", "solid-light", "outline", "outline-dark"];

export default {
  title: "Components/Atoms/VcChip",
  component: VcChip,
  argTypes: {
    size: {
      control: "inline-radio",
      options: SIZES,
      type: { name: "string", required: false },
      table: {
        type: {
          summary: SIZES.join(" | "),
        },
      },
    },
    color: {
      control: "select",
      options: COLORS,
      type: { name: "string", required: false },
      table: {
        type: {
          summary: COLORS.join(" | "),
        },
      },
    },
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
  },
} as Meta<typeof VcChip>;

const Template: StoryFn<typeof VcChip> = (args) => ({
  components: { VcChip },
  setup: () => ({ args }),
  template: '<VcChip v-bind="args">Chip text</VcChip>',
});

export const Basic = Template.bind({});

export const Rounded = Template.bind({});
Rounded.args = {
  rounded: true,
};

export const Closable = Template.bind({});
Closable.args = {
  closable: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const AllStates: StoryFn<typeof VcChip> = () => ({
  components: { VcChip },
  setup: () => ({ colors: COLORS, variants: VARIANTS, sizes: SIZES }),
  template: `<div class="space-y-8">
    <div v-for="size in sizes" class="space-y-3">
      <h2 class="text-lg font-bold">Size: {{ size }}</h2>


      <div class="space-y-1" v-for="variant in variants">
        <div class="text-base">Variant: <b>{{ variant }}</b></div>

        <div class="flex flex-wrap gap-2 items-center">
          <VcChip v-for="color in colors" :size="size" :color="color" :variant="variant">
            Color: {{ color }}
          </VcChip>
        </div>
      </div>
    </div>

    <div v-for="size in sizes" class="space-y-3">
      <h2 class="text-lg font-bold">Size: {{ size }}</h2>


      <div class="space-y-1" v-for="variant in variants">
        <div class="text-base">Variant: <b>{{ variant }}</b></div>

        <div class="flex flex-wrap gap-2 items-center">
          <VcChip v-for="color in colors" :size="size" :color="color" :variant="variant" closable>
            Color: {{ color }}
          </VcChip>
        </div>
      </div>
    </div>
  </div>
  `,
});
