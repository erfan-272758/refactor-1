const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        const fullname = req.body.fullname;
        const secretString = req.body.secretString;

        if (fullname == null || secretString == null) {
            return res.status(404).send('Please provide all requested data.');
        };

        // just to handle secret string not having dots or dashes
        if (secretString.includes('.') && secretString.includes('-')) {
            return res.status(422).send('Provided data is not valid! Secret String should not contain - and . in the same time.');
        } else {
            const exists = await User.findOne({ secretString: secretString });

            if (exists) {
                return res.status(409).send('User can not be created bacause a document with this secret string already exists.')
            } else {
                const user = await User.create({ fullname: fullname, secretString: secretString, otp: Math.floor(Math.random() * 90000) + 10000 });
                return res.status(201).json({ message: 'User created successfully.', user });
            }
        }
    } catch (err) {
        console.log(err);
    }
};


exports.login = async (req, res) => {
    const secretString = req.body.secretString;
    const otp = req.body.otp;

    User.findOne({ secretString: secretString })
        .then(user => {
            if (!user) {
                return res.status(404).send('Please provide valid credentials.');
            } else {
                if (user.otp == otp) {
                    const fullname = user.fullname;
                    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    return res.status(200).json({ message: `Dear ${fullname} you are logged in`, token });
                } else {
                    return res.status(404).send('Please provide valid credentials.');
                }
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: 'An error occured.' });
        })
};


exports.getName = async (req, res) => {
    const secretString = req.body.secretString;

    // just to handle secret string not having dots or dashes
    if (secretString.includes('.') && secretString.includes('-')) {
        return res.status(422).send('Provided data is not valid! Secret String should not contain - and . in the same time.');
    };
    User.findOne({ secretString: secretString })
        .then(user => {
            const userId = user.id;

            if (userId.toString() !== req.userId) {
                return res.status(401).send('Credentials not valid.');
            }

            if (!user) {
                return res.status(401).send('User not found.');
            } else {
                const fullname = user.fullname;
                return res.status(200).send(`You are authenticated and your name is ${fullname}`);
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send('Invalid input.');
        })

}