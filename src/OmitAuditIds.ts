import { Plugin } from "graphile-build";
import { PgAttribute } from "graphile-build-pg";
import { isAuditedClass } from "./util";
import { getOptions } from "./options";

// NOTE(ncurbez): We do not use this plugin because our 'AuditId' is simply the id of the model
export const OmitAuditIds: Plugin = builder => {
  builder.hook(
    "build",
    build => {
      const attributes: PgAttribute[] =
        build.pgIntrospectionResultsByKind.attribute;

      const auditOptions = getOptions(build);
      const { auditIdColumnName } = auditOptions;

      for (const attr of attributes) {
        if (
          attr.name === auditIdColumnName &&
          isAuditedClass(attr.class, auditOptions)
        ) {
          attr.tags.omit = true;
        }
      }
      return build;
    },
    ["OmitAuditIds"],
    [],
    []
  );
};
