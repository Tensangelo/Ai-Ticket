import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHealthStatus(): { status: string } {
    return { status: 'ok' };
  }
}
