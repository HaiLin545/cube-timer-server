import mg from 'mongoose';
mg.connect("mongodb://127.0.0.1/timer");

const db = mg.connection;



db.on('error', (err) => {
    console.log(err);
})
db.once('open', () => {
    console.log("connectd to mongodb.");
    // isExistUser(User, '123');
})

const userScheme = new mg.Schema({
    openid: String,
    nickName: String,
    avatar: String,
    records: Object,
    groups: Array,
    currentGroup: String
})
const User = mg.model('user', userScheme, 'user');

export async function getUserByOpenid(openid) {
    const users = await User.find({ openid });
    return users;
}

export async function addUser(openid) {
    const userInfo = {
        openid: openid,
        nickName: '魔友',
        avatar: "default.png",
        records: {
            normal: []
        },
        groups: ['normal'],
        currentGroup: 'normal',
    }
    const newUser = new User(userInfo);
    return new Promise((resolve, reject) => {
        newUser.save().then((res) => {
            resolve(userInfo);
        }).catch(err => { reject(err) });

    })
}

export async function updateAvatar(openid, avatar) {
    const res = await User.findOneAndUpdate({ openid }, { avatar });
    return avatar;
}


export async function updateName(openid, nickName) {
    const res = await User.findOneAndUpdate({ openid }, { nickName });
    return nickName;
}


export async function syncUp(data) {
    const { records, groups, currentGroup, openid } = data;
    const res = await User.findOneAndUpdate({ openid }, { records, groups, currentGroup })
    return res;
}

export async function syncDown(openid) {
    const res = await User.findOne({ openid });
    return res;
}