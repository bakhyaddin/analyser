export interface Pattern {
  merchant: string;
  type: string;
  frequency: string;
  amount: string;
  notes: string;
  nextExpected: string | null;
}
