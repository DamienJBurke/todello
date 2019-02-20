const {
    Label
} = require('../sequelize');

exports.createLabel = async (req, res) => {
    await Label.createLabel(req.body.title);
    await this.getLabels(req,res);
};


exports.getLabels = async (req,res) => {
    Label.findAll().then((labels) => {
        const mydata = labels.map(el => ({
            id: el.id,
            title: el.title,
            onSchedule: el.onSchedule,
            scheduleStart: el.scheduleStart,
            scheduleEnd:el.scheduleEnd
        }));
        console.log(mydata)
        res.json(mydata);
    })
}

exports.deleteLabel = async (req,res) => {
    await Label.deleteLabel(req.body.id);
    await this.getLabels(req,res);
}

exports.setSchedule = async (req,res) => {
    await Label.setSchedule(req.body.id,req.body.startTime,req.body.endTime)
    await this.getLabels(req,res)
}

exports.unsetSchedule = async (req,res) => {
    await Label.unsetSchedule(req.body.id)
    await this.getLabels(req,res)
}