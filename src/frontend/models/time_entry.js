import { parseTime, getTimezoneOffsetInHours } from '../utils/timeUtils';

class TimeEntry {
    constructor(id, project_id, start_date, end_date, date, description, tags) {
        this.id = id;
        this.project_id = project_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.date = date;
        this.description = description;
        this.tags = tags;
    }

    // copyWith({ project_id, start_date, end_date, date, description, tags, time_zone }) {
    //     return new TimeEntry({
    //         id: this.id,
    //         project_id,
    //         start_date,
    //         end_date,
    //         date,
    //         description,
    //         tags,
    //         time_zone
    //     });
    // }

    toJson() {
        const time_zone = getTimezoneOffsetInHours();
        console.log('time_zone', time_zone);
        const start_date = parseTime(this.start_date, this.date);
        const end_date = parseTime(this.end_date, this.date);

        
        return {
            id: this.id,
            project_id: this.project_id,
            start_date: start_date,
            end_date: end_date,
            date: this.date,
            description: this.description,
            tags: this.tags,
            time_zone: time_zone
        }
    }
}


export default TimeEntry;
