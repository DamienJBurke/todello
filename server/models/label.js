module.exports = (sequelize,type) => {
    const Label = sequelize.define('label', {
        id: {
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title: type.STRING,
    });

    Label.createLabel = (title) => {
        return Label.create({
            title,
        });
    };

    Label.deleteLabel = (labelId) => {
        return Label.destroy({
            where: {
                id: labelId
            }
        });
    };

    return Label;
}