import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(path.resolve(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const userAgent = process.env.npm_config_user_agent ?? '';
const usesWorkspaceProtocol = userAgent.includes('yarn') || userAgent.includes('pnpm');
const dependencyValue = usesWorkspaceProtocol ? 'workspace:^' : 'file:../houston-common-css';
const libValue = usesWorkspaceProtocol ? 'workspace:^' : 'file:../houston-common-lib';

let changed = false;
if (packageJson.dependencies['@45drives/houston-common-css'] !== dependencyValue) {
  packageJson.dependencies['@45drives/houston-common-css'] = dependencyValue;
  changed = true;
}
if (packageJson.dependencies['@45drives/houston-common-lib'] !== libValue) {
  packageJson.dependencies['@45drives/houston-common-lib'] = libValue;
  changed = true;
}

if (changed) {
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
