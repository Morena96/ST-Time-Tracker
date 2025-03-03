class Tag {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static get tags() {
        return [
            new Tag(1, '1:1'),
            new Tag(2, 'AM'),
            new Tag(3, 'Audit'),
            new Tag(4, 'Bench'),
            new Tag(5, 'Bug'),
            new Tag(6, 'Changes'),
            new Tag(7, 'Client Call'),
            new Tag(38, 'Communication'),
            new Tag(8, 'Configuration'),
            new Tag(9, 'Development'),
            new Tag(10, 'Difficulty 1'),
            new Tag(11, 'Difficulty 2'), 
            new Tag(12, 'Difficulty 3'),
            new Tag(13, 'Difficulty 4'),
            new Tag(14, 'Difficulty 5'),
            new Tag(39, 'Documentation'),
            new Tag(15, 'Internal Call'),
            new Tag(16, 'Invoice'),
            new Tag(17, 'Maintenance'),
            new Tag(18, 'Meeting'),
            new Tag(19, 'Monthly'),
            new Tag(20, 'New'),
            new Tag(21, 'Offboarding'),
            new Tag(22, 'Onboarding'),
            new Tag(23, 'Optimization'),
            new Tag(24, 'Organization'),
            new Tag(25, 'Product Doc'),
            new Tag(26, 'Project Management'),
            new Tag(27, 'Project Staffing'),
            new Tag(28, 'Project Technical Research'),
            new Tag(29, 'QA Analysis'),
            new Tag(30, 'Recruiting'),
            new Tag(31, 'Report'),
            new Tag(32, 'Research'),
            new Tag(33, 'Review'),
            new Tag(34, 'Sick Leave'),
            new Tag(40, 'Surveys'),
            new Tag(35, 'Team Planning'),
            new Tag(36, 'Testing'),
            new Tag(37, 'Vacation')
        ];
    }
}
   

export default Tag;