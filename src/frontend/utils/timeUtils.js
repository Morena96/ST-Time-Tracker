import { Duration } from '../models/Duration';


/**
 * Formats seconds into HH:MM:SS format
 * @param {number} seconds - Total number of seconds
 * @returns {string} Formatted time string in HH:MM:SS format
 */
export const formatTime = (seconds) => {
    return Duration.fromSeconds(seconds).toString();
};

export const formatDateToHHMM = (date) => {
    if (!date || !(date instanceof Date)) return '';
    try {
        const dateObj = new Date(date);
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date to HH:MM', error);
        return '';
    }
};

export const parseTime = (timeString, date) => {
    const parts = String(timeString).split(':');
    var hours = parts.length === 1 ? Number(parts[0]) : Number(parts[0]);
    var minutes = parts.length === 1 ? 0 : Number(parts[1]);
    var newDate = new Date(date);

    if (minutes > 59) {
        hours++;
        minutes = minutes % 60;
    }
    if (hours > 23) {
        newDate.setHours(23);
        newDate.setMinutes(59);
    }
    else {
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
    }
    return newDate;

};

/**
 * Converts HH:MM:SS format to seconds
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {number} Total number of seconds
 */
export const timeToSeconds = (timeString) => {
    const duration = parseDuration(timeString);
    return duration ? duration.inSeconds : 0;
};

/**
 * Parses a time string into a Duration object
 * @param {string} timeString - Time string in various formats (e.g., "1:30", "90", "1:30:00")
 * @returns {Duration|null} Duration object or null if invalid
 */
export const parseStringToDuration = (timeString) => {
    if (!timeString) return null;

    let parts = String(timeString).match(/.{1,2}(?=(.{2})*$)/g) || [];
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    if (parts.length === 1) {
        // If smaller than 3 digits then it's minutes
        if (parts[0].length <= 2) {
            parts = ['0', parts[0]];
        } else {
            // If more than 2 digits, last two are minutes, remaining are hours
            parts = [
                parts[0].substring(0, parts[0].length - 2),
                parts[0].substring(parts[0].length - 2),
            ];
        }
    }

    for (let i = parts.length - 1; i >= 0; i--) {
        const value = parseInt(parts[i]);
        if (isNaN(value)) return null;

        if (i === 2) {
            seconds += value;
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
        } else if (i === 1) {
            minutes += value;
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
        } else if (i === 0) {
            hours += value;
        }
    }

    // Create duration object
    const duration = new Duration(hours, minutes, seconds);

    // Apply limits
    if (duration.inSeconds >= 24 * 60 * 60) {
        return new Duration(23, 59, 59).inSeconds;
    }
    if (duration.inSeconds < 0) {
        return new Duration(0, 0, 0).inSeconds;
    }

    console.log('duration.inSeconds: ', duration.inSeconds);
    return duration.inSeconds;
};

/**
 * Formats a Duration object to a human-readable string
 * @param {Duration} duration - Duration object to format
 * @returns {string} Formatted string
 */
export const formatDuration = (duration) => {
    if (!duration) return '00:00:00';
    return duration.toString();
};

export const formatIntToDuration = (duration) => {
    if (!duration) return '00:00:00';
    const durationObj = new Duration(0, 0, duration);
    return durationObj.toString();
};



/**
 * Creates a Duration from a time string
 * @param {string} timeString - Time string in various formats
 * @returns {Duration} Duration object
 */
export const createDuration = (timeString) => {
    return parseDuration(timeString) || new Duration(0, 0, 0);
};

/**
 * Formats a Date object to a human-readable string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted string
 */
export const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
};

/**
 * Parses a date string to a Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date} Date object
 */
export const parseDate = (dateString) => {
    if (!dateString) return new Date();
    if (typeof dateString !== 'string') return new Date(dateString);

    // Handle ISO format strings
    const isoDate = dateString.trim();
    if (!/^\d{4}-\d{2}-\d{2}/.test(isoDate)) return new Date();

    // Parse ISO date string parts
    const [year, month, day] = isoDate.split('-').map(Number);

    // Month is 0-based in Date constructor
    const date = new Date(year, month - 1, day);

    // Validate the parsed date
    if (isNaN(date.getTime())) {
        return new Date();
    }

    return date;
};

/**
 * Gets the last unlocked date based on the current day of the week
 * @returns {Date} The last unlocked date
 */
export const getLastUnlockedDate = () => {
    const now = new Date();

    // Get current day of week (1-7, where 1 is Monday)
    const weekday = now.getDay() || 7; // Convert Sunday (0) to 7

    // Calculate initial last unlocked day (subtract current weekday + 6 days)
    let lastUnlockedDay = new Date(now);
    lastUnlockedDay.setDate(now.getDate() - (weekday + 6));

    // Set time to start of day
    lastUnlockedDay.setHours(0, 0, 0, 0);

    // If current day is Wednesday or later (weekday >= 3), add 7 days
    if (weekday >= 3) {
        lastUnlockedDay.setDate(lastUnlockedDay.getDate() + 7);
    }

    return lastUnlockedDay;
};

/**
 * Converts time string with colon to number format
 * @param {string} timeString - Time string in HH:MM format
 * @returns {number} Time as number in HHMM format
 */
export const timeStringToNumberString = (timeString) => {
    if (!timeString) return null;
    const numStr = String(timeString).replace(':', '');
    return numStr.padStart(4, '0');
};

/**
 * Converts duration string to number format
 * @param {string} duration - Duration string in HH:MM format
 * @returns {number} Duration as number in HHMM format
 */
export const durationToNumberString = (duration) => {
    const numStr = String(duration).replaceAll(':', '');
    return numStr.padStart(6, '0');
};

/**
 * Converts number format back to time string with colon
 * @param {number} timeNumber - Time as number in HHMM format 
 * @returns {string} Time string in HH:MM format
 */
export const numberToTimeString = (timeNumber) => {
    if (!timeNumber) return '';
    if (timeNumber.toString().length === 1) {
        return `${timeNumber}:00`;
    }
    const str = timeNumber.toString().padStart(4, '0');
    return `${str.slice(0, 2)}:${str.slice(2)}`;
};


/**
 * Gets yesterday's date while preserving time
 * @returns {Date} Yesterday's date with same time as current date
 */
export const getYesterday = (date) => {
    if (!date) return new Date();
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
};

/**
 * Converts timezone offset to hours as a double value
 * @param {number} timeZoneOffset - Timezone offset in minutes
 * @returns {number} Timezone offset in hours as a double
 */
export const getTimezoneOffsetInHours = () => {
    return -new Date().getTimezoneOffset() / 60;
};