export type CampaignStatus = 'draft' | 'active' | 'ended' | 'archived';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: CampaignStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
