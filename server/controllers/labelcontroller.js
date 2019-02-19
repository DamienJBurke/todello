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
            title: el.title
        }));
        console.log(mydata)
        res.json(mydata);
    })
}

exports.deleteLabel = async (req,res) => {
    await Label.deleteLabel(req.body.id);
    await this.getLabels(req,res);
}