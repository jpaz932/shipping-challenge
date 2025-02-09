import { pathsToModuleNameMapper } from 'ts-jest';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
    },
    roots: ['<rootDir>/tests'],
    modulePaths: ['.'],
    moduleNameMapper: pathsToModuleNameMapper({
        '@src/*': ['src/*'],
    }),
};
