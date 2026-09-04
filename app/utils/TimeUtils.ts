/**
 * Format seconds to MM:SS format
 */
export function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface TimelineMoment {
    half: 1 | 2;
    minute: number;
    additionalMinute: number;
    second: number;
}

/**
 * Build the timeline moment from the running match clock and current half.
 */
export function getTimelineMomentFromClock(timeInSeconds: number, currentHalf: 1 | 2): TimelineMoment {
    const HALF_SECONDS = 40 * 60;

    if (currentHalf === 1) {
        if (timeInSeconds <= HALF_SECONDS) {
            return {
                half: 1,
                minute: Math.floor(timeInSeconds / 60),
                additionalMinute: 0,
                second: timeInSeconds % 60,
            };
        }

        const extra = timeInSeconds - HALF_SECONDS;
        return {
            half: 1,
            minute: 40,
            additionalMinute: Math.floor(extra / 60),
            second: extra % 60,
        };
    }

    const secondHalfElapsed = Math.max(0, timeInSeconds - HALF_SECONDS);
    if (secondHalfElapsed <= HALF_SECONDS) {
        const minuteOffset = Math.floor(secondHalfElapsed / 60);
        return {
            half: 2,
            minute: 40 + minuteOffset,
            additionalMinute: 0,
            second: secondHalfElapsed % 60,
        };
    }

    const extra = secondHalfElapsed - HALF_SECONDS;
    return {
        half: 2,
        minute: 80,
        additionalMinute: Math.floor(extra / 60),
        second: extra % 60,
    };
}

/**
 * Format timeline as 40', 42' or 40' + 2.
 */
export function formatTimelineMoment(minute: number, additionalMinute?: number, second?: number, half?: 1 | 2): string {
    if (additionalMinute && additionalMinute > 0) {
        return `${minute}' + ${additionalMinute}`;
    }

    if (second && second > 0) {
        // End-of-half edge case: display added time as 40'+1 / 80'+1, not 41' / 81'.
        if (half === 1 && minute === 40) {
            return `40' + 1`;
        }
        if (half === 2 && minute === 80) {
            return `80' + 1`;
        }
    }

    const displayMinute = second && second > 0 ? minute + 1 : minute;
    return `${displayMinute}'`;
}

/**
 * Build a sortable key where second-half events are always after first-half events.
 */
export function getTimelineSortKey(moment: TimelineMoment): number {
    const halfOffset = moment.half === 1 ? 0 : 100000;
    const regularSeconds = moment.minute * 60;
    const additionalSeconds = (moment.additionalMinute || 0) * 60;
    return halfOffset + regularSeconds + additionalSeconds + moment.second;
}
