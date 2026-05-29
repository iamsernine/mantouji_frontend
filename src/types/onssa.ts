export type OnssaAccreditationStatus = "approved" | "rejected";

export type OnssaAccreditationDemand = {
  id: string;
  coopId: string;
  coopName: string;
  filiereId: string;
  status: OnssaAccreditationStatus;
  inOnssaDatabase: boolean;
  createdAt: string;
  resolvedAt: string;
  rejectionReason?: string;
};

export type CoopNotification = {
  id: string;
  coopId: string;
  type:
    | "onssa_rejected"
    | "onssa_approved"
    | "coop_registration_approved"
    | "coop_registration_rejected";
  title: string;
  message: string;
  filiereId?: string;
  read: boolean;
  createdAt: string;
};
