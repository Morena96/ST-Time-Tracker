class TimeEntry {
    constructor(id, project_id, start_date, end_date, description, tags) {
        this.id = id;
        this.project_id = project_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.description = description;
        this.tags = tags;
    }

    copyWith({ project_id, start_date, end_date, description, tags }) {
        return new TimeEntry(this.id, project_id, start_date, end_date, description, tags);
    }
}

export default TimeEntry;
