import {
  embed,
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
} from "graphile-utils";

import { getOptions } from "./options";

type Plugin = import("graphile-build").Plugin;
type PgProc = import("graphile-build-pg").PgProc;
type PgType = import("graphile-build-pg").PgType;
type Build = import("graphile-build").Build;
type PgSql2 = typeof import("pg-sql2");
type QueryBuilder = import("graphile-build-pg").QueryBuilder;

function getAuditFunctionInfo(build: Build) {
  const procedures: PgProc[] = build.pgIntrospectionResultsByKind.procedure;
  const types: PgType[] = build.pgIntrospectionResultsByKind.type;
  const options = getOptions(build);
  const procedure = procedures.find(
    p =>
      p.namespaceName === options.auditFunctionSchema &&
      p.name === "get_audit_information"
  );
  const returnType = types.find(t => t.id === procedure?.returnTypeId);
  const returnTypeClass = returnType?.class;

  return {
    procedure,
    returnType,
    returnTypeClass,
  };
}

const OmitOriginalUserNameField: Plugin = builder => {
  builder.hook("build", build => {
    const { returnTypeClass } = getAuditFunctionInfo(build);

    if (returnTypeClass) {
      returnTypeClass.attributes.find(
        a => a.name === "originated_by_user_id"
      )!.tags.omit = true;
    }

    return build;
  });
};

const AddCorrectedNameField = makeExtendSchemaPlugin(build => {
  // const options = getOptions(build);
  const { returnTypeClass } = getAuditFunctionInfo(build);

  const returnTypeName: string = returnTypeClass
    ? build.inflection.tableType(returnTypeClass)
    : "AuditEvent";

  const sql: PgSql2 = build.pgSql;

  function nameFragment(queryBuilder: QueryBuilder) {
    return sql.fragment`
      // NOTE(ncurbez): don't use the session_info option since the event already has the proper originated_by_user_id
      // NOTE(ncurbez): revisit this - it's only safe to do this lookup if the user is never deleted
      ${queryBuilder.getTableAlias()}.originated_by_user_id
    `;
  }

  // TODO(ncurbez): create another field originatedByUser that uses this id to find a User?
  return {
    typeDefs: gql`
  extend type ${returnTypeName} {
     ${build.inflection.pap_usernameField()}: UUID @pgQuery(
      fragment: ${embed(nameFragment)})
  }
  `,
  };
});

export const UserNameField = makePluginByCombiningPlugins(
  // These two plugins effectively don't do anything since originated_by_user_id is returned as-is,
  // but could become useful if we add `originatedByUser: User`
  OmitOriginalUserNameField,
  AddCorrectedNameField
);
