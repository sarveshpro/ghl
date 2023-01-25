import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  public time: string;
  @IsNumber()
  @Min(10)
  @Max(120)
  public duration: number;
  @IsOptional()
  public metaData?: any;
}

export class GetAllEventsDto {
  @IsDateString()
  public startDate: string;
  @IsDateString()
  public endDate: string;
}
