const aws = require('aws-sdk');

const {
  REGION
} = require('./constants');

async function listS3Bucket(req, res) {

  aws.config.update({
    accessKeyId: "", //put your aws key Id here
    secretAccessKey: "", //put your aws key here
    region: REGION,
  });
  const s3 = new aws.S3();
  const params = {
    Bucket: "", //s3 bucket name
  };

  const s3Response = await s3.listObjectsV2(params).promise();

  console.log('print contents');
  console.log(s3Response.Contents);
  const contents = s3Response.Contents;

  for (var i = 0; i < contents.length; i++)
  {
    if(contents[i].Key.split("/")[0] === "matches" && contents[i].Key.split("/")[1] !== "")
    {
      const urlParams = {
        Bucket:  "", //s3 bucket name
        Key: contents[i].Key,
        Expires: 3600
      }
      let replayUrl;
      try{
        replayUrl = s3.getSignedUrl('getObject', urlParams);
      }catch (e)
      {
        console.log("getSignedUrl failed");
        console.log(e);
      }
      // console.log(replayUrl);
      contents[i].replayUrl = replayUrl;
    }
  }

  return contents;

}
module.exports = {listS3Bucket};
