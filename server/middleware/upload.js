const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Using an absolute path (relative to this file, not process.cwd()) so
// uploads always land in server/uploads no matter where `node` was
// launched from. The previous relative "uploads/" path silently wrote
// files to the wrong folder whenever the server wasn't started from
// inside /server, which is exactly the kind of "broken path" bug that's
// invisible in dev (because you usually do cd into server/) but bites
// in production/deploy setups.
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, uploadDir);
    },

    filename: function(req,file,cb){

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null,uniqueName);

    }

});

const upload = multer({
    storage
});

module.exports = upload;