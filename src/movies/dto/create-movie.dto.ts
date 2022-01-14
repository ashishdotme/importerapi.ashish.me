import {
  ApiProperty,
} from '@nestjs/swagger';

export class CreateMovieDto {

  @ApiProperty()
  title: string

  @ApiProperty()
  date?: Date

  @ApiProperty()
  startDate?: Date

  @ApiProperty()
  endDate?: Date

  @ApiProperty()
  loved?: boolean
}
