const axios = require('axios');
const uuid = require('uuid/v1');

const { createDate } = require('./convertStringToLocaleDate');
const env = require('../helper/environment');
const { genLocaleDate } = require('./convertStringToLocaleDate');


const generateReport = async (start, end, req) => {
    let result = await axios.get(`${env.baseUrl_nhom3}/api/recurrent-tasks/`);

    let hasDoer = result.data.filter(item => item.hasOwnProperty('doer') && item.doer.id == req.session.infoUser.user.userId);

    // console.log(111, hasDoer.length);

    if (hasDoer.length != 0) {
        startTime = createDate(start).getTime()
        endTime = createDate(end).getTime();

        hasDoer = hasDoer.filter(item => (startTime <= new Date(item.start).getTime()) && (new Date(item.due).getTime() <= endTime));
        hasDoer = [{
            id: uuid(),
            name: req.body.report_name,
            start: start,
            end: end,
            finished_task: hasDoer.filter(item => item.status == "finished").length,
            overdue_task: hasDoer.filter(item => item.status == "overdue").length,
            doing_task: hasDoer.filter(item => item.status == "doing").length,
            cancel_task: hasDoer.filter(item => item.status == "canceled").length,
            created_time: genLocaleDate(new Date()).toISOString(),
            share: req.body.share,
            creator_id: req.session.infoUser.user.userId,
            creator_name: req.session.infoUser.user.name,
            description: req.body.description
        }]
    }
    return hasDoer;
}


module.exports = {
    generateReport
}