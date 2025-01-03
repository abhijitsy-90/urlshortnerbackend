module.exports = (sequelize, DataTypes) => {
    const Analytics = sequelize.define('Analytics', {
        shortUrlId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'urls',
                key: 'id',
            },
           
        },
        clickCount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        userIp: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [], 
        },
        timestamp: {
            type: DataTypes.ARRAY(DataTypes.DATE), 
            defaultValue: [], 
        },
    }, {
        tableName: 'analytics',
        timestamps: false,
    });

    Analytics.associate = (models) => {
        Analytics.belongsTo(models.Url, { foreignKey: 'shortUrlId', as: 'url' });
    };

    return Analytics;
};
