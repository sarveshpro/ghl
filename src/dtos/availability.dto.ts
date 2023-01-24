import { IsDateString } from 'class-validator';

export class GetAvailabilityDto {
  @IsDateString()
  public startDate: string;
  @IsDateString()
  public endDate: string;
}
