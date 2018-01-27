/**
 * @module utils
 *
 */
import { isEmpty } from '@ember/utils';

const USER_AGENTS = [
	{ regex: /OPR/, name: 'Opera', version: a => a.replace(/^((?!OPR)[\s\S])*OPR\/([\s\S]*)$/, '$2') },
	{ regex: /Edge/, name: "Microsoft Edge", version: a => a.replace(/^((?!Edge)[\s\S])*Edge\/([\s\S]*)$/, '$2') },
	{ regex: /CriOS/, name: "Chrome", version: a => a.replace(/^((?!CriOS)[\s\S])*CriOS\/([^ ]*)[\s\S]*$/, '$2') },
	{ regex: /FxiOS/, name: "Firefox", version: a => a.replace(/^((?!FxiOS)[\s\S])*FxiOS\/([^ ]*)[\s\S]*$/, '$2') },
	{ regex: /Chrome/, name: "Chrome", version: a => a.replace(/^((?!Chrome)[\s\S])*Chrome\/([^ ]*)[\s\S]*$/, '$2') },
	{ regex: /Safari/, name: "Safari", version: a => a.replace(/^((?!Safari)[\s\S])*Safari\/([\s\S]*)$/, '$2') },
	{ regex: /MSIE/, name: "Internet Explorer", version: a => a.replace(/^((?!MSIE)[\s\S])*MSIE ([^;]*)[\s\S]*$/, '$2') },
	{ regex: /Firefox/, name: "Firefox", version: a => a.replace(/^((?!Firefox)[\s\S])*Firefox\/([\s\S]*)$/, '$2') }
];

const PLATFORMS = [
	{ regex: /Android/, name: 'Android' },
	{ regex: /iPhone|iPad|iPod/, name: 'iOS' },
	{ regex: /Macintosh/, name: 'Mac OS X' },
	{ regex: /Windows/, name: 'Windows' },
	{ regex: /Linux/, name: 'Linux' },
];

export default function systemInfo() {
	let userAgent = window.navigator.userAgent;

	let browser;
	let version;
	USER_AGENTS.forEach(br => {
		if (isEmpty(browser) && br.regex.test(userAgent)) {
			browser = br.name;
			version = br.version(userAgent);
		}
	});

	browser = browser || 'unknown';
	version = version || '0';

	let platform;
	PLATFORMS.forEach(pl => {
		if (isEmpty(platform) && pl.regex.test(userAgent)) {
			platform = pl.name;
		}
	});

	platform = platform || 'unknown';

	return { browser, version, platform };
}
