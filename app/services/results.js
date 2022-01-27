import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ResultsService extends Service {
    @tracked values = [
        {
          completeLog:
            '<102>Dec 19 03:06:14 TETSS CEF:0|Trend Micro|Deep Security Manager|12.0.347|600|User Signed In|3|src=172.24.144.102 suser=Admin target=Admin msg=User signed in from 172.24.144.102 TrendMicroDsTenant=Primary TrendMicroDsTenantId=0 ',
        },
        {
          completeLog:
            '<102>Dec 19 03:06:14 TETSS CEF:0|Trend Micro|Deep Security Manager|12.0.347|600|User Signed In|3|src=172.24.144.102 suser=Admin target=Admin msg=User signed in from 172.24.144.102 TrendMicroDsTenant=Primary TrendMicroDsTenantId=0 ',
        }];

}
