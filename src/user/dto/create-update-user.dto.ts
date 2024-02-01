import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUpdateUserDto {
  @IsNotEmpty({ message: 'Field name must be added' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Field email must be added' })
  @IsString()
  @IsEmail()
  email: string;
}