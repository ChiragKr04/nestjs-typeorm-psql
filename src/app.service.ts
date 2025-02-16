import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      date: moment().format(),
    };
  }
}
