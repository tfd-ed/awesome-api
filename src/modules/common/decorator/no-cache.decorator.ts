import { SetMetadata } from '@nestjs/common';

export const IGNORE_CACHE = 'ignoreCache';
export const NoCache = () => SetMetadata(IGNORE_CACHE, true);
