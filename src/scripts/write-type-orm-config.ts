import { configServiceInstance } from '../config/config.service';
import fs = require('fs');

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configServiceInstance.getTypeOrmConfig(), null, 2)
);
