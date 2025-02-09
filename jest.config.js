import { pathsToModuleNameMapper } from 'ts-jest';

export default {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    roots: ['<rootDir>/tests'],
    modulePaths: ['.'],
    moduleNameMapper: pathsToModuleNameMapper({
        '@src/*': ['src/*'],
    }),
};