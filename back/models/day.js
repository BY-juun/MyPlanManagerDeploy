module.exports = (sequelize, DataTypes) => {
    const Day = sequelize.define('Day',{
        dayinfo: {
            type: DataTypes.INTEGER,
            allowNull: false, //필수
        },
    },{
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',//한글 + 이모티콘
    });

    Day.associate = (db) => {
        db.Day.belongsTo(db.User);
        db.Day.hasMany(db.Plan);
    };
    return Day;
}
