const q = require("q")
const { Pool, Client } = require('pg')
const { config } = require('../helper/config');
const pool = new Pool(config)
const client = new Client(config)
client.connect()

const uuid = require('uuid/v1');


const getAllReportTask = () => {
    let defer = q.defer()
    client.query('SELECT * FROM report.report_task', (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res)
        }
    })

    return defer.promise
}


const getReportTaskById = id => {
    let defer = q.defer()
    let sql = `SELECT * FROM report.report_task WHERE id = '${id}'`


    client.query(sql, (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res)
        }
    })
    return defer.promise
}


const updateReportTask = (report) => {
    let defer = q.defer()
    let sql = `UPDATE report.report_task SET name = '${report.name}', user_id = '${report.user_id}', content = '${report.content}', department_id = '${report.department_id}', task_id = '${report.task_id}', updated_time = '${report.updated_time.toISOString()}' WHERE id = '${report.id}'`
    client.query(sql, (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res)
        }
    })

    return defer.promise
}


const deleteReportTask = id => {
    let defer = q.defer()
    let sql = `DELETE FROM report.report_task WHERE id = '${id}'`


    client.query(sql, (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res)
        }
    })
    return defer.promise
}


const addReportTask = report => {
    let defer = q.defer()
    let sql = `INSERT INTO report.report_task(id, name, user_id, content, created_time, department_id, task_id, updated_time) VALUES ('${report.id}','${report.name}', '${report.user_id}', '${report.content}',' ${report.created_time.toISOString()}', '${report.department_id}', '${report.task_id}', '${report.updated_time.toISOString()}')`


    client.query(sql, (err, res) => {
        if (err) defer.reject(err)
        else {
            defer.resolve(res);
        }
    })
    return defer.promise
}


const getReportByTypeId = (id, type) => {
    let defer = q.defer();
    let sql = `SELECT * from report.report_task WHERE ${type} = '${id}'`;
    client.query(sql, (err, res) => {
        if (err) { defer.reject(err); }
        else {
            defer.resolve(res);
        }
    })
    return defer.promise;
}

const addReportStatisticTask = report => {
    let defer = q.defer()
    let { id, name: na, start: st, end, finished_task: fi, overdue_task: ov, doing_task: di, cancel_task: ca, created_time: crt, share: sh, creator_id: cri, creator_name: crn, description: de } = report;
    let sql = `INSERT INTO report.report(id, name, start_time, end_time, finished_task, overdue_task, doing_task, cancel_task, created_time, share, creator_id, creator_name, description)`
        + ` VALUES ('${id}','${na}', '${st}', '${end}','${fi}', '${ov}', '${di}', '${ca}', '${crt}', '${sh.toString()}','${cri}','${crn}','${de}')`;

    client.query(sql, (err, res) => {
        if (err) { defer.reject(err) }
        else {
            defer.resolve(res);
        }
    })
    return defer.promise
}


// thong ke
const getAllStatisticReportTask = () => {
    let defer = q.defer()
    client.query('SELECT * FROM report.report', (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res.rows)
        }
    })

    return defer.promise
}

const getStatisticReportByTypeId = (id, type) => {
    let defer = q.defer();
    let sql = `SELECT * from report.report WHERE ${type} = '${id}'`;
    console.log(sql);

    client.query(sql, (err, res) => {
        if (err) { defer.reject(err); }
        else {
            defer.resolve(res.rows[0]);
        }
    })
    return defer.promise;
}


const deleteStatisticReportTask = id => {
    let defer = q.defer()
    let sql = `DELETE FROM report.report WHERE id = '${id}'`


    client.query(sql, (err, res) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(res)
        }
    })
    return defer.promise
}

module.exports = {
    getAllReportTask,
    addReportTask,
    getReportTaskById,
    updateReportTask,
    deleteReportTask,
    getReportByTypeId,
    addReportStatisticTask,
    getAllStatisticReportTask,
    getStatisticReportByTypeId,
    deleteStatisticReportTask
}
