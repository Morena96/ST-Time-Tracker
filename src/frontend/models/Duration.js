/**
 * A class that represents a duration of time
 */
export class Duration {
  constructor(hours = 0, minutes = 0, seconds = 0) {
    this._hours = hours;
    this._minutes = minutes;
    this._seconds = seconds;
    this._normalize();
  }

  /**
   * Creates a Duration from seconds
   * @param {number} seconds - Total number of seconds
   * @returns {Duration} New Duration instance
   */
  static fromSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return new Duration(hours, minutes, remainingSeconds);
  }

  /**
   * Creates a Duration from minutes
   * @param {number} minutes - Total number of minutes
   * @returns {Duration} New Duration instance
   */
  static fromMinutes(minutes) {
    return Duration.fromSeconds(minutes * 60);
  }

  /**
   * Creates a Duration from hours
   * @param {number} hours - Total number of hours
   * @returns {Duration} New Duration instance
   */
  static fromHours(hours) {
    return Duration.fromSeconds(hours * 3600);
  }

  /**
   * Normalizes the duration by converting excess seconds to minutes and excess minutes to hours
   * @private
   */
  _normalize() {
    let totalSeconds = this._hours * 3600 + this._minutes * 60 + this._seconds;
    
    this._hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    
    this._minutes = Math.floor(totalSeconds / 60);
    this._seconds = totalSeconds % 60;
  }

  /**
   * Gets the total number of seconds
   * @returns {number} Total seconds
   */
  get inSeconds() {
    return this._hours * 3600 + this._minutes * 60 + this._seconds;
  }

  /**
   * Gets the total number of minutes
   * @returns {number} Total minutes
   */
  get inMinutes() {
    return this._hours * 60 + this._minutes;
  }

  /**
   * Gets the total number of hours
   * @returns {number} Total hours
   */
  get inHours() {
    return this._hours;
  }

  /**
   * Adds another Duration to this one
   * @param {Duration} other - Duration to add
   * @returns {Duration} New Duration instance
   */
  add(other) {
    return Duration.fromSeconds(this.inSeconds + other.inSeconds);
  }

  /**
   * Subtracts another Duration from this one
   * @param {Duration} other - Duration to subtract
   * @returns {Duration} New Duration instance
   */
  subtract(other) {
    return Duration.fromSeconds(this.inSeconds - other.inSeconds);
  }

  /**
   * Multiplies this Duration by a factor
   * @param {number} factor - Number to multiply by
   * @returns {Duration} New Duration instance
   */
  multiply(factor) {
    return Duration.fromSeconds(this.inSeconds * factor);
  }

  /**
   * Divides this Duration by a factor
   * @param {number} factor - Number to divide by
   * @returns {Duration} New Duration instance
   */
  divide(factor) {
    return Duration.fromSeconds(this.inSeconds / factor);
  }

  /**
   * Returns a string representation of the duration in HH:MM:SS format
   * @returns {string} Formatted duration string
   */
  toString() {
    return `${this._hours.toString().padStart(2, '0')}:${this._minutes.toString().padStart(2, '0')}:${this._seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Returns a plain object representation of the duration
   * @returns {Object} Duration object
   */
  toObject() {
    return {
      hours: this._hours,
      minutes: this._minutes,
      seconds: this._seconds,
      totalSeconds: this.inSeconds
    };
  }
} 

export default Duration;