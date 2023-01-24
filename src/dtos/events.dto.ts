import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  public time: string;
  @IsNumber()
  @Min(10)
  @Max(120)
  public duration: number;
  public metaData: any;
}

export class GetAllEventsDto {
  @IsOptional()
  @IsDateString()
  public startDate: string;
  @IsOptional()
  @IsDateString()
  public endDate: string;
}
