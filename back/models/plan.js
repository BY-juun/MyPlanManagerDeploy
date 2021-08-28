module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define('Plan',{
        content: {
            type: DataTypes.STRING(50),
            allowNull: false, //필수
        },
        starttime: {
            type: DataTypes.DATE,
            allowNull: true, 
        },
        endtime: {
            type: DataTypes.DATE,
            allowNull: true, 
        },
        totaltime : {
            type: DataTypes.INTEGER,
            allowNull: true, 
        }
    },{
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',//한글 + 이모티콘
    });

    Plan.associate = (db) => {
        db.Plan.belongsTo(db.Day);
    };
    return Plan;
}
