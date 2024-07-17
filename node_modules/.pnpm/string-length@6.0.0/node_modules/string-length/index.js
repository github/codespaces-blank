import stripAnsi from 'strip-ansi';

const segmenter = new Intl.Segmenter();

export default function stringLength(string, {countAnsiEscapeCodes = false} = {}) {
	if (string === '') {
		return 0;
	}

	if (!countAnsiEscapeCodes) {
		string = stripAnsi(string);
	}

	if (string === '') {
		return 0;
	}

	let length = 0;

	for (const _ of segmenter.segment(string)) { // eslint-disable-line no-unused-vars
		length++;
	}

	return length;
}
