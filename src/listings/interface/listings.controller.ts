import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateListingUseCase } from '../application/use-cases/create-listing.use-case';
import { UpdateListingUseCase } from '../application/use-cases/update-listing.use-case';
import { DeleteListingUseCase } from '../application/use-cases/delete-listing.use-case';
import { FindListingUseCase } from '../application/use-cases/find-listing.use-case';
import { FindAllListingsUseCase } from '../application/use-cases/find-all-listings.use-case';
import { CreateListingDto } from '../application/dto/create-listing.dto';
import { UpdateListingDto } from '../application/dto/update-listing.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FindListingsByUserUseCase } from '../application/use-cases/find-listing-by-user.use-case';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
    private readonly findListingUseCase: FindListingUseCase,
    private readonly findListingsByUserUseCase: FindListingsByUserUseCase,
    private readonly findAllListingsUseCase: FindAllListingsUseCase,
  ) {}

  @Post()
  create(
    @Body() createListingDto: CreateListingDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.createListingUseCase.execute(createListingDto, activeUser);
  }

  @Get('my-listings')
  findMyListings(@ActiveUser() activeUser: ActiveUserData) {
    return this.findListingsByUserUseCase.execute({
      id: activeUser.sub,
    } as User);
  }

  @Get()
  findAll() {
    return this.findAllListingsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findListingUseCase.execute(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.updateListingUseCase.execute({ ...updateListingDto, id: +id });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteListingUseCase.execute(+id);
  }
}
