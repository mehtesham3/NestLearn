import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Res,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
// import { createProfile } from './dto/create-profile.dto';
// import { updateProfile } from './dto/updateProfile.dto';
import { ProfileService } from './profile.service';
import { createProfile } from './dto/create-profile.dto';
import { RemoveSpacePipe } from './customPipe/removeSpace';
import { AdminGuard } from './guard/admin.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll() {
    return this.profileService.findAll();
    return { message: 'List of profiles' };
  }

  @Post()
  create(@Body(new RemoveSpacePipe()) createIdentity: createProfile) {
    return this.profileService.create(createIdentity);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    let profile = this.profileService.findOne(id);
    if (!profile) {
      throw new NotFoundException(`Profile with Id ${id} is not found`);
    }
    return profile;
  }

  @Get('admin/only')
  @UseGuards(AdminGuard)
  adminData() {
    return { message: 'Admin data' };
  }
}

// Response handle with custom codes like as of express
// @Get(':id')
// findOne(@Param('id') id: string, @Res() res: express.Response) {
//   let profile = this.profileService.findOne(parseInt(id));
//   if (!profile) {
//     return res
//       .status(HttpStatus.NOT_FOUND)
//       .json({ message: 'Profile not found' });
//   }
//   return res.status(HttpStatus.OK).json(profile);
// }
// /Wildacard
// @Get('abcd/*')
// findAl() {
// return 'This route uses a wildcard';
// }

// //POST /profile
// @Post()
// create(@Body() createProfile: createProfile) {
//   return createProfile;
// }

// // GET /profile
// @Get()
// findLocation(@Query('location') location: string) {
//   return [{location}];
// }
// // GET /profile/:idx
// @Get(':id')
// findOne(@Param('id') id: string) {
//   return { id };
// }

// //PUT /profile update the data
// @Put(':id')
// update(@Param('id') id: string, @Body() updateProfile: updateProfile) {
//   return {id:id, name:updateProfile.name, description:updateProfile.description}
// }
