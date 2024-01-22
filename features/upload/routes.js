const { wrap } = require('async-middleware');
const loadPage = require('./commands/load-page');
const refreshPage = require('./commands/refresh-page');
const multer = require('multer');
const storage = multer.memoryStorage();

const uploadFile = multer({
  dest: 'uploads/',
  storage: storage
  // limits: { fileSize: 1024 * 1024 * 5 }
});

const  aws = require('aws-sdk');
const {
  REGION
} = require('./constants');

module.exports = router => {
  router.post('/upload', uploadFile.single('file'), async (req, res, next) => {
    // console.log(req);
    const file = req.file;

    console.log(file);
    // console.log(req.user.name);
    const fileName = req.user.name;

    aws.config.update({
      accessKeyId:  "AKIAUJTCN6PSWMOOCOZN",
      secretAccessKey: "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",
      region: REGION,
    });
    const s3 = new aws.S3();
    const params = {
      Bucket: "battlecodebucket",
      Key: "submissions/" + fileName + ".zip", //upload to s3 submissions folder
      Body: file.buffer
    }
    console.log(file.buffer);

    try {

      await s3.upload(params).promise();
      res.status(200);
      return next();
    } catch (error) {
      console.log(error);
      res.status(500).send('Error uploading file to S3');
    }
  }, wrap(refreshPage));

  router.get('/upload', wrap(loadPage));
  return router;
};
