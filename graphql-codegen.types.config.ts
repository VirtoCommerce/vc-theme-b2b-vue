/* eslint-disable @typescript-eslint/naming-convention */
import type { CodegenConfig } from "@graphql-codegen/cli";

const graphQLCodegenTypesConfig: CodegenConfig = {
  schema: `client-app/core/api/graphql/schema.json`,
  documents: "client-app/**/*.(graphql|gql)",
  generates: {
    "client-app/core/api/graphql/types.ts": {
      plugins: [
        {
          add: {
            content: "// This file is auto-generated. Do not edit manually.\n",
          },
        },
        "typescript",
        "typescript-operations",
        "typed-document-node",
        "named-operations-object",
      ],
    },
    "client-app/": {
      preset: "near-operation-file",
      presetConfig: {
        baseTypesPath: "core/api/graphql/types.ts",
      },
      plugins: ["typescript-operations", "typed-document-node"],
    },
  },
  config: {
    dedupeFragments: true,
    identifierName: "OperationNames",
    maybeValue: "T",
    scalars: {
      BigInt: "number",
      Byte: "number",
      Date: "string",
      DateOnly: "string",
      Decimal: "number",
      DynamicPropertyValue: "string | number | boolean | null",
      Guid: "string",
      Half: "number",
      Long: "number",
      Milliseconds: "number",
      ModuleSettingValue: "string | number | boolean | null",
      OptionalDecimal: "number | undefined",
      OptionalNullableDecimal: "number | null | undefined",
      OptionalString: "string | undefined",
      PropertyValue: "string | number | boolean | null",
      SByte: "number",
      Seconds: "number",
      Short: "number",
      TimeOnly: "string",
      UInt: "number",
      ULong: "number",
      Uri: "string",
      UShort: "number",
    },
    skipTypename: true,
    useTypeImports: true,
    skipGraphQLImport: true,
  },
};

export default graphQLCodegenTypesConfig;
