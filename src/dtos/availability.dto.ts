import { IsDateString, IsNumber, IsString } from 'class-validator';

export class GetAvailabilityDto {
  @IsDateString()
  public startDate: string;
  @IsDateString()
  public endDate: string;
  @IsString()
  public duration: number;
  @IsString()
  public timezone: string;
}
