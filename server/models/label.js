module.exports = (sequelize, type) => {
  const Label = sequelize.define("label", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: type.STRING,
    onSchedule: type.BOOLEAN,
    scheduleStart: type.TIME,
    scheduleEnd: type.TIME
  });

  Label.createLabel = title => {
    return Label.create({
      title
    });
  };

  Label.deleteLabel = labelId => {
    return Label.destroy({
      where: {
        id: labelId
      }
    });
  };

  Label.setSchedule = (labelId, startTime, endTime) => {
    return Label.update(
      {
        onSchedule: 1,
        scheduleStart: startTime,
        scheduleEnd: endTime
      },
      {
        where: {
          id: labelId
        }
      }
    );
  };

  Label.unsetSchedule = (labelId) => {
      return Label.update(
          {
              onSchedule:0
          },
          {
              where: {
                  id:labelId
              }
          }
      )
  }

  return Label;
};
