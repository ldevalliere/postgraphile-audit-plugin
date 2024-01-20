type Build = import("graphile-build").Build;
type Options = import("graphile-build").Options;

export interface AuditPluginOptions {
  /**
   * name of the schema that contains the `get_audit_information` function
   */
  auditFunctionSchema: string;

  /**
   * Name of the audit id column. Defaults to `id`
   */
  auditIdColumnName: string;

  /**
   * include "auditEvents" connection on audited types
   */
  auditEventConnection: boolean;

  /**
   * Define audit event fields and connection as optional, defaults to false
   */
  auditEventFieldsAndConnectionOptional?: boolean;

  /**
   * include "firstAuditEvent" and "lastAuditEvent" field on audited types
   */
  firstLastAuditEvent: boolean;
  /**
   * include "createdAt" and "lastModifiedAt" field on audited types
   */
  dateProps: boolean;
  /**
   * include "createdBy" and "lastModifiedBy" on audited types
   */
  nameProps: boolean;
  /**
   * define how "name" properties should be filled - either with the transaction's "originated_by_user_id", or with a value from the "session_info" JSON
   */
  nameSource: "originated_by_user_id" | "session_info";

  /**
   * if `nameSource` is "session_info", this describes the path to the username within the JSON
   * e.g. "{name}" or "{nested,user,name}" (see the #>> notation described in https://www.postgresql.org/docs/9.3/functions-json.html)
   */
  nameSessionInfoJsonPath: string;

  /**
   * if name cannot be filled (because it is null or undefined), fall back to this value
   */
  nameFallback: string;
}
export function getOptions(build: Build): AuditPluginOptions {
  const options: Options = build.options;
  const {
    auditPlugin: {
      auditFunctionSchema = "app_public",
      auditIdColumnName = "id",
      auditEventConnection = true,
      auditEventFieldsAndConnectionOptional = false,
      firstLastAuditEvent = true,
      dateProps = true,
      nameProps = true,
      nameSource = "originated_by_user_id", // only use "originated_by_user_id", don't use session_info in our app
      nameSessionInfoJsonPath = "{name}", // code for this option has been removed
      nameFallback = "unknown user", // we will just return null for the UUID, code for this option has been removed
    } = {},
  } = options;
  return {
    auditFunctionSchema,
    auditIdColumnName,
    auditEventConnection,
    auditEventFieldsAndConnectionOptional,
    firstLastAuditEvent,
    dateProps,
    nameProps,
    nameSource,
    nameSessionInfoJsonPath,
    nameFallback,
  };
}
