/** BullMQ payloads — identifiers only; no resume/PII blobs. */

export type NotificationFanoutJob = {
  jobId: string;
};

export type PushDeliveryJob = {
  userId: string;
  title: string;
  body: string;
  data: Record<string, string>;
  jobId: string;
  baseDedupe: string;
  dispatchId?: string;
};

export type EmailDeliveryJob = {
  userId: string;
  title: string;
  body: string;
  data: Record<string, string>;
  jobId: string;
  baseDedupe: string;
  dispatchId?: string;
};
