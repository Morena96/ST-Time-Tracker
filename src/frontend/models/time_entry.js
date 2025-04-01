import { parseTime, getTimezoneOffsetInHours } from '../utils/timeUtils';

class TimeEntry {
    constructor(id, project_id, start_date, end_date, date, description, tags, kanban_board_id) {
        this.id = id;
        this.project_id = project_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.date = date;
        this.description = description;
        this.tags = tags;
        this.kanban_board_id = kanban_board_id;
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
        const start_date = parseTime(this.start_date, this.date);


        var end_date = null;
        
        if(this.end_date){
            end_date = parseTime(this.end_date, this.date);
        }

        
        return {
            id: this.id,
            project_id: this.project_id,
            start_date: start_date,
            end_date: end_date,
            description: this.description,
            tags: this.tags,
            time_zone: time_zone,
            kanban_board_id: this.kanban_board_id
        }
    }
}


export default TimeEntry;
