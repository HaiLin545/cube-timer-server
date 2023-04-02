import express from "express";
import { getUserByOpenid, addUser, updateAvatar, updateName, syncUp, syncDown } from "./db.js";
import { getOpenid } from "./request.js";
import multer from 'multer';
import fs from 'fs';
import path from "path";
import { log } from "./log.js"
import https from "https";


const port = 5454;
const app = express();
const upload = multer({ dest: './avatars' })

var options = {
    key: fs.readFileSync('./https/key.key'),
    cert: fs.readFileSync('./https/pem.pem')
};

var httpsServer = https.createServer(options, app);

app.use('/avatar', express.static('avatars'));

httpsServer.listen(port, () => {
    log("Server running on port", port);
})

app.get('/login', async (req, res) => {
    log("login");
    const { openid } = req.query;
    const users = await getUserByOpenid(openid);
    if (users.length == 0) {
        addUser(openid).then((value => {
            res.send(value);
        })).catch(err => {
            res.send(err);
        });
    } else if (users.length == 1) {
        res.send(users[0]);
    } else {
        res.statusCode = 500;
        res.send('server is broken');
    }
});

app.get('/getopenid', async (req, res) => {
    log('get open id');
    const { js_code } = req.query;
    getOpenid(js_code).then(wxres => {
        const result = { openid: wxres.data.openid };
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
})

app.post('/updateAvatar', upload.single('avatar'), (async (req, res) => {
    log("update avatar");
    try {
        const tgtName = path.join(req.file.destination, req.body.openid + path.extname(req.file.originalname));
        fs.renameSync(req.file.path, tgtName);
        const result = await updateAvatar(req.body.openid, path.basename(tgtName));
        log(result);
        res.send(result);
    } catch (err) {
        res.statusCode = 500;
        res.send(err);
    }

}));
app.use(express.json());

app.post('/updateName', (async (req, res) => {
    log("update name");
    try {
        const result = await updateName(req.body.openid, req.body.nickName);
        res.send(result);
    } catch (err) {
        res.statusCode = 500;
        res.send(err);
    }

}));

app.post("/sync/up", (async (req, res) => {
    log("sync up");
    try {
        const result = await syncUp(req.body);
        res.send(result);
    } catch (err) {
        res.statusCode = 500;
        res.send(err);
    }
}))

app.get("/sync/down", (async (req, res) => {
    log("sync down", req.query);
    try {
        const result = await syncDown(req.query.openid);
        res.send(result);
    } catch (err) {
        res.statusCode = 500;
        res.send(err);
    }
}))