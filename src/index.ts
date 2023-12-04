import { makePluginByCombiningPlugins } from "graphile-utils";
import { AddAuditFields } from "./AddAuditFields";
import { AddAuditedInterface } from "./AddAuditInterface";
import { OrderByAudit } from "./OrderByAudit";

import { AdditionalInflectors, inflectors } from "./inflectors";
import { AuditPluginOptions } from "./options";
import { UserNameField } from "./UserNameField";

declare module "graphile-build" {
  interface Inflection extends AdditionalInflectors {}
  interface Options {
    auditPlugin?: Partial<AuditPluginOptions>;
  }
}

export {
  AuditPluginOptions,
  AdditionalInflectors,
  AddAuditedInterface,
  OrderByAudit,
  UserNameField,
  inflectors as InflectorsPlugin,
};

export default makePluginByCombiningPlugins(
  inflectors,
  AddAuditFields,
  AddAuditedInterface,
  OrderByAudit,
  UserNameField
);
