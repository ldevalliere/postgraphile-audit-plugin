import { makeAddInflectorsPlugin } from "graphile-utils";

const additionalInflectors = {
  pap_AuditedInterface() {
    return "Audited";
  },
  pap_lastModifiedAt() {
    return "lastModifiedAt";
  },
  pap_lastModifiedBy() {
    return "lastModifiedBy";
  },
  pap_firstAuditEvent() {
    return "firstAuditEvent";
  },
  pap_lastAuditEvent() {
    return "lastAuditEvent";
  },
  pap_auditEvents() {
    return "auditEvents";
  },
  pap_usernameField() {
    return "originatedByUserId";
  },
};

export type AdditionalInflectors = typeof additionalInflectors;
export const inflectors = makeAddInflectorsPlugin(additionalInflectors);
