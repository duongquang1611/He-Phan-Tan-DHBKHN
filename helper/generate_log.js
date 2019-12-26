const uuid = require('uuid/v1');

const log_md = require('../models/log')


const generateLog = (req, _status) => {
  let createdTime = new Date();
  createdTime.setHours(createdTime.getHours() + 7);

  console.log(req.session.infoUser);
  console.log(req.session.infoUser.user._id);

  if (req.method != "GET") {
    let log = {
      id: uuid(),
      actionUserId: req.session.infoUser.user._id,
      type: convertMethod(req.method),
      reportId: uuid().toString(),
      status: convertStatus(_status),
      createdTime: createdTime.toISOString(),
      service: "Report_task_service"
    }
    console.log(log);

    log_md.addLogSerice(log).then(result => {
      res.statusCode = 200
    }).catch(err => {
      res.statusCode = 500
    })
  }
}


const convertMethod = method => {
  if (method == "POST") return "CREATE"
  if (method == "PUT") return "EDIT"
  if (method == "DELETE") return "DELETE"
}


const convertStatus = status => {
  if (status == 200 || status == "200") return "SUCCESS"
  if (status == 500 || status == "500") return "ERROR"
}



module.exports = {
  generateLog
}