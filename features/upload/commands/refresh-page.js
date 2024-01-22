const debug = require('debug')('express:refresh-page');
const {listS3Bucket} = require('../repository');
const aws= require('aws-sdk');
const {
  REGION
} = require('../constants');

async function refreshPage(req, res) {
  let tableContent;
  try {
    tableContent = await listS3Bucket(req, res);
    console.log('upload refresh page');
    console.log(tableContent);
  }catch (err)
  {
    res.locals.message = { errorMessage : "can't load team submissions from cloud" };
    res.redirect('/');
  }
  res.locals.userInfo = req.session.user;
  res.locals.tableContents = tableContent;
  res.render('pages/dashboard');
}

module.exports = refreshPage;
