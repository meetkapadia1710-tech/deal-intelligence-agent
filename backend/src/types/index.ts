export interface Deal {
  dealId: string;
  dealName: string;
}

export interface Interaction {
  dealId: string;
  dealName: string;
  note: string;
  stakeholder?: string;
}
