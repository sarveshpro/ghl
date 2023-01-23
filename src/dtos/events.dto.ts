import { IsDateString, IsNumber, Max, Min } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  public time: Date;
  @IsNumber()
  @Min(10)
  @Max(120)
  public duration: number;
  public metaData: any;
}
