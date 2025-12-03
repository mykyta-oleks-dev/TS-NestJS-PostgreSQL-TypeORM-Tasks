import { ConfigService } from '@nestjs/config';
import ConfigType from './config.types';

export default class TypedConfigService extends ConfigService<ConfigType> {}
