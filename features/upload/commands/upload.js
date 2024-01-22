const debug = require('debug')('express:upload');
const multer = require('multer');
const storage = multer.memoryStorage();


function upload (req, file, next)  {

  return multer({
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 5 },
    });

}
