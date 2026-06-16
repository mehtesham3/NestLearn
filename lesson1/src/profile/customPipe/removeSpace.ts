import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RemoveSpacePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type === 'body' &&
      value.name &&
      typeof value.name === 'string'
    ) {
      value.name = value.name.trim();
    }
    return value;
  }
}
