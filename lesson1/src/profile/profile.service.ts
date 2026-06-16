import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './DbIntegrate/profile.entity';
import { Repository } from 'typeorm';

// export interface Profile {
//   id: number;
//   [key: string]: any;
// }
@Injectable()
export class ProfileService {
  // private Profiles: Profile[] = [];
  constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}

  findAll() {
    return this.repo.find();
    // return this.Profiles;
  }

  create(data: Partial<Profile>) {
    const newProfile = this.repo.create(data);
    return this.repo.save(newProfile);
    // let maxId =
    //   this.Profiles.length > 0
    //     ? Math.max(...this.Profiles.map((p) => p.id))
    //     : 0;
    // let newData = { id: maxId + 1, ...data };
    // this.Profiles.push(newData);
    // return newData;
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
    // return this.Profiles.find((p) => p.id === id);
  }
}
