const debug = require('debug')('express:login');

const { FETCH_INFO_ERROR_MESSAGE } = require('../constants');
const { getTeamById } = require('../repository');
const { listS3Bucket } = require('../../upload/repository');

async function redirectToDashboard(req, res) {
  let userInfo;
  let tableContent;
  const { user } = req;
  try {
    //getUserById
    userInfo = await getTeamById(user && user.id);
    console.log(userInfo);
  } catch (getUserError) {
    const messages = {
      errors: {
        databaseError: FETCH_INFO_ERROR_MESSAGE,
      },
    };

    return res.status(500).render('pages/login', { messages });
  }

  debug('login:redirectToDashboard');
  try{

    tableContent = await listS3Bucket(req, res);
    console.log('printing in redirect-to-dashboard');
    console.log(tableContent);

  }catch (err)
  {
    req.session.user = { ...userInfo };
    res.locals.message = { errorMessage : "can't load team submissions from cloud" };
    return res.redirect('/');
    // res.status(500).render('pages/dashboard');
  }

  res.locals.tableContents = tableContent;
  req.session.user = { ...userInfo };
  res.locals.userInfo = req.session.user;
  res.render('pages/dashboard');
}

module.exports = redirectToDashboard;
