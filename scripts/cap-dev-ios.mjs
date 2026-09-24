/**
 * Opens the iOS app in a simulator, loading the local `next dev` on port 3000
 * with live reload. Start `npm run dev` first.
 *
 * `cap run ios` builds the app with the live-reload URL, but its deploy step
 * opens Simulator.app at the path Xcode 26 used, which Xcode 27 no longer
 * ships, and fails. So this script lets Capacitor build, then boots the
 * simulator and installs and launches the app itself with simctl.
 *
 * Usage: npm run cap:dev:ios [-- "iPhone 17"]
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const APP_ID = 'it.sapiens.app';
const name = process.argv[2] ?? 'iPhone 17';

const { devices } = JSON.parse(execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], { encoding: 'utf8' }));
const device = Object.values(devices)
	.flat()
	.filter((d) => d.name === name)
	.at(-1);
if (!device) {
	console.error(`Nessun simulatore chiamato "${name}". Elenco: xcrun simctl list devices available`);
	process.exit(1);
}

// The deploy step is expected to fail (see above); the build before it is what matters.
spawnSync('npx', ['cap', 'run', 'ios', '--live-reload', '--host', 'localhost', '--port', '3000', '--target', device.udid], { stdio: 'inherit' });

const app = join('ios', 'DerivedData', device.udid, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
if (!existsSync(app)) {
	console.error(`Build non trovata in ${app}.`);
	process.exit(1);
}

if (device.state !== 'Booted') execFileSync('xcrun', ['simctl', 'boot', device.udid], { stdio: 'inherit' });
execFileSync('xcrun', ['simctl', 'install', device.udid, app], { stdio: 'inherit' });
execFileSync('xcrun', ['simctl', 'launch', device.udid, APP_ID], { stdio: 'inherit' });
console.log(`Sapiens aperta su ${device.name} (${device.udid}).`);
