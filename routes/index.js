require("body-parser")

const express = require('express')
const router = express.Router()
const uuid = require('uuid/v1');
const axios = require('axios');
const moment = require('moment')

const reportTask = require('../models/report_task')
const { generateLog } = require('../helper/generate_log')
const checkRole = require('../helper/checkRole');
const env = require('../helper/environment')

const log = require('../models/log');
router.get('/create_report/:id', (req, res, next) => {
  generateLog(req)
  let id = req.params.id
  let link = `${env.baseUrl_nhom3}/api/recurrent-tasks/${id}`
  axios.get(link)
    .then(respond => {
      if (!respond.data.finish) {
        respond.data.finish = 'Không xác định'
      }
      if (respond.data.coDepartments.length == 0) {
        respond.data.coDepartments = [{ name: 'Không xác định' }]
      }
      if (!respond.data.doer) {
        respond.data.doer = "Không xác định"
      }
      if (!respond.data.coDoers) respond.data.doer = [{ name: 'Không xác định' }]
      respond.data.id = id
      res.render('report.ejs', respond.data)
    }).catch(error => {
      res.json({ status_code: 500 })
    })
})

router.post('/create_report/:id/', (req, res, next) => {
  let params = req.body;

  params.created_time = new Date();
  params.updated_time = new Date();
  params.created_time.setHours(params.created_time.getHours() + 7);
  params.updated_time.setHours(params.updated_time.getHours() + 7);
  params.id = uuid();
  params.user_id = uuid();
  params.department_id = uuid();
  params.name = "Báo cáo ngày " + moment().format('DD/MM/YYYY HH:mm:ss');

  keyParams = Object.keys(params)

  let obj = {};
  for (i = 0; i < keyParams.length; i++) {
    if (keyParams[i] != "id" && keyParams[i] != "user_id" && keyParams[i] != "department_id" && keyParams[i] != "task_id") {
      toang = keyParams[i].replace(/ /g, '_')
      obj[toang] = params[keyParams[i]];
    }
  }

  params.content = JSON.stringify(obj)
  params.status = 1
  reportTask.addReportTask(params)
    .then(result => {
      status = 200;
      generateLog(req, status)
      res.json({
        "status_code": status,
        "id": params.id
      })
    }).catch(() => {
      status = 500
      generateLog(req, status)
      res.json({ "status_code": status })
    })
})


router.get('/logs', (req, res, next) => {
  log.getLogService(req.query)
    .then(result => {
      let rs2 = result.map(item => {
        return {
          id: item.id,
          actionUserId: item.actionuserid,
          type: item.type,
          reportId: item.reportid,
          status: item.status,
          createdTime: item.createdtime,
          service: item.service
        }
      })
      res.json(rs2);

    }).catch(err => {
      res.json({ "status_code": "500" })
    })
})

// get all reports
router.get('/', [checkRole.hasUserId], function (req, res, next) {
  generateLog(req)

  reportTask.getAllReportTask()
    .then(report => {
      // for (i = 0; i < report.rows.length; i++) {
      //   report.rows[i].content = JSON.parse(report.rows[i].content)
      // }
      res.json(report.rows)
    }).catch(() => {
      res.json({ "status_code": "500" })
    })
})

// create a report
router.post('/', (req, res, next) => {
  let params = req.body
  params.created_time = new Date();
  params.updated_time = new Date();
  params.created_time.setHours(params.created_time.getHours() + 7);
  params.updated_time.setHours(params.updated_time.getHours() + 7);
  params.id = uuid()

  reportTask.addReportTask(params)
    .then(result => {
      status = 200;

      generateLog(req, status)
      res.json({ "status_code": 200 })
    }).catch(() => {
      status = 500
      generateLog(req, status)
      res.json({ "status_code": 500 })
    })
})

// get a report
router.get('/:id', function (req, res, next) {
  if (req.params.id.trim() != "favicon.ico") {

    let id = req.params.id

    reportTask.getReportTaskById(id)
      .then(report => {
        // report.rows[0].content = JSON.parse(report.rows[0].content)
        res.json(report.rows)
      }).catch(() => {
        res.json({ "status_code": "500" })
      })
  }
})


// update a report
router.put('/:id/', (req, res, next) => {
  let params = req.body
  let id = req.params.id
  params.updated_time = new Date()
  params.id = id
  params.content = JSON.stringify(params.content)

  reportTask.updateReportTask(params)
    .then(result => {
      status = 200
      generateLog(req, status)
      res.json({ "status_code": 200 })
    }).catch(() => {
      status = 500
      generateLog(req, status)
      res.json({ "status_code": 500 })
    })

})


// delete a report
router.delete('/:id', (req, res, next) => {
  let id = req.params.id
  reportTask.deleteReportTask(id)
    .then(result => {
      status = 200
      generateLog(req, status)
      res.json({ "status_code": 200 })
    }).catch(() => {
      status = 500
      generateLog(req, status)
      res.json({ "status_code": 500 })
    })
})



// get report by project id
router.get('/projects/:id', (req, res, next) => {
  generateLog(req)
  let id = req.params.id

  reportTask.getReportByTypeId(id, "project_id")
    .then(result => {
      res.json(result.rows)
    }).catch(err => {
      res.json("status_code: 500")
    })
})



// get report by deparment id
router.get('/departments/:id', (req, res, next) => {
  generateLog(req)
  let id = req.params.id

  reportTask.getReportByTypeId(id, "department_id")
    .then(result => {
      res.json(result.rows)
    }).catch(err => {
      res.json("status_code: 500")
    })
})


// get report by task id
router.get('/tasks/:id', (req, res, next) => {
  generateLog(req)
  let id = req.params.id

  reportTask.getReportByTypeId(id, "task_id")
    .then(result => {
      res.json(result.rows)
    }).catch(err => {
      res.json("status_code: 500")
    })
})


module.exports = router
