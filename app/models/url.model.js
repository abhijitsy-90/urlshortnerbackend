module.exports = (sequelize, DataTypes) => {
    const Url = sequelize.define('Url', {
        originalurl: {
            type: DataTypes.TEXT,

        },
        shorturl: {
            type: DataTypes.STRING,

        },
        userid: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
       
        },
        shortid:{
            type: DataTypes.STRING
        }

    }, {
        tableName: 'urls',
    });

    Url.associate = (models) => {
        Url.belongsTo(models.User, { foreignKey: 'userid', as: 'user' });
    };

    return Url;
};
