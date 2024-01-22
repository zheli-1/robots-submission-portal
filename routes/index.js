const express = require('express');
const { wrap } = require('async-middleware');
const { listS3Bucket } = require('../features/upload/repository');


const router = express.Router();
const mountRegisterRoutes = require('../features/register/routes');
const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const mountResetPasswordRoutes = require('../features/reset-password/routes');
const mountProfileRoutes = require('../features/profile/routes');
const mountUploadRoutes = require('../features/upload/routes');

function isAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.user && req.isAuthenticated()) {
    console.log('get authenticated!');
    return next();
  }
  return res.redirect('/login');
}

async function getTableFromS3(req, res, next){

  let tableContent;
  try{

    tableContent = await listS3Bucket(req, res);
    console.log('printing in index.js');
    console.log(tableContent);

  }catch (err)
  {
    res.locals.message = { errorMessage : "can't load team submissions from cloud" };
    // res.status(500).render('pages/dashboard');
  }

  //v1
  // console.log('render pages/dashboard');
  // res.locals.userInfo = req.session.user;
  // res.locals.tableContents = tableContent;
  // console.log( res.locals.tableContents);
  //
  // res.render('pages/dashboard');

  //v2
  res.locals.tableContents = tableContent;
  return next();
}

/* GET home page. */
// v1
// router.get('/', isAuthenticated, wrap(getTableFromS3));

//v2
router.get('/', isAuthenticated, wrap(getTableFromS3), (req, res) => {
  console.log('render pages/dashboard');
  res.locals.userInfo = req.session.user;
  console.log( res.locals.tableContents);
  res.render('pages/dashboard');
});

router.get('/icons', isAuthenticated, (req, res) => {
  res.render('pages/icons');
});

router.get('/maps', isAuthenticated, (req, res) => {
  res.render('pages/maps');
});

router.get('/tables', isAuthenticated, (req, res) => {
  res.render('pages/tables');
});

mountRegisterRoutes(router);
mountLoginRoutes(router);
mountLogoutRoutes(router, [isAuthenticated]);
mountResetPasswordRoutes(router);
mountProfileRoutes(router, [isAuthenticated]);
mountUploadRoutes(router, [isAuthenticated]);

module.exports = router;
