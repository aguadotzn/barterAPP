export interface InterchangeDTO {
  _id?: string | number;
  requestor: string;
  acknowledger: string;
  requestor_event_id: string;
  acknowledger_event_id: string;
  status: string;

}
