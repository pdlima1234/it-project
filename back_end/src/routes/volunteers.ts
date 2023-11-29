import express, { Request, Response, NextFunction } from 'express';
import VolunteerModel from '../models/volunteer';
import OrganisationModel from '../models/organisation';
import bcrypt from 'bcryptjs';
import generator from 'generate-password';
import * as emailValidator from 'email-validator';
import isLoggedIn from './login';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const volunteerRouter = express.Router();

// Login route to verify a user and get a token
volunteerRouter.post('/login', async (req: Request, res: Response) => {
    try {
        // check if the user exists, case insensitive
        const user = await VolunteerModel.findOne({
            Email: { $regex: new RegExp(req.body.Email, 'i') },
        }).exec();
        if (user) {
            //check if password matches
            const result = await bcrypt.compare(
                req.body.Password,
                user.Password
            );

            if (result) {
                // sign token and send it in response
                res.json(user.id);
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Signup route to create a new user
volunteerRouter.post(
    '/register',
    isLoggedIn,
    validateNonEmptyFields,
    validateEmail,
    async (req: Request, res: Response) => {
        // check if exists
        // if exists, add to organisation
        // if not exists, create then add
        try {
            const name = req.body.Name;
            const organisations = req.body.Organisations;
            const email = req.body.Email;
            const password = generator.generate({
                length: 10,
                numbers: true,
            });

            let userId;
            const existing = await VolunteerModel.findOne({
                Email: { $regex: new RegExp(email, 'i') },
            }).exec();

            if (!existing) {
                // hash the randomly generated password
                const hashed = await bcrypt.hash(password, 10);

                // create a new user
                const newUser = new VolunteerModel({
                    Name: name,
                    Email: email,
                    Password: hashed,
                    SurveysSubmitted: [],
                });
                // save new user
                const saved = await newUser.save();

                if (saved) {
                    // send new user as response
                    //res.json(newUser);
                    userId = newUser.id;
                } else {
                    res.status(400).json({ error: 'user failed to save' });
                }
            } else {
                userId = existing.id;
            }

            // add volunteer to selected orgs
            for (let i = 0; i < organisations.length; i++) {
                const id = organisations[i];
                const oldEntry = await OrganisationModel.findById(id).exec();

                // check if volunteer is already part of org
                oldEntry.Volunteers = !oldEntry.Volunteers.includes(userId)
                    ? oldEntry.Volunteers.concat([userId])
                    : oldEntry.Volunteers;

                // update the volunteer list
                const updatedEntry = await OrganisationModel.findByIdAndUpdate(
                    id,
                    oldEntry,
                    { new: true }
                );

                if (!updatedEntry) {
                    res.status(400).json({
                        error: 'updating organisation list failed',
                    });
                }
            }

            // try and email new user with username and password
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'weconnectteam34@gmail.com',
                    pass: 'gdjs kfvv njae kelr',
                },
            });

            const text =
                '<h2>You have been registered to WeConnect!</h2> \
            <p>Dear ' +
                name.split(' ')[0] +
                ",</p> \
            <p>This is an email to inform you of a successful registration to WeConnect. We're thrilled to have you on board!</p> \
            <p> <p> \
            <p>Email: " +
                email +
                '<p> \
            <p>Password: ' +
                password +
                '<p> \
            <p> <p> \
            <p>Please install our WeConnect app and sign in with the above login details. You may change your password through account settings -> reset password later on.</p> \
            <p>If you have any questions or need assistance, feel free to contact our support team @ weconnect@volunteeringvictoria.org.au</p> \
            <p> <p> \
            <p>Best regards,</p> \
            <p>WeConnect Team</p> \
            ';

            const mailOptions = {
                from: 'weconnectteam34@gmail.com',
                to: email,
                subject: 'WeConnect Registration',
                html: text,
            };

            if (!existing) {
                transporter.sendMail(mailOptions, function (error, success) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            error: 'error occured when trying to contact registered email',
                        });
                    } else {
                        console.log('email sent successfully');
                    }
                });
            }

            res.json('Successfully registered the new volunteer :)');
        } catch (error) {
            res.status(400).json({ error });
        }
    }
);

// Forgot password route
volunteerRouter.post('/resetpass', async (req: Request, res: Response) => {
    try {
        const user = req.body.Email;
        const existing = await VolunteerModel.findOne({
            Email: { $regex: new RegExp(user, 'i') },
        }).exec();

        if (!existing) {
            // hash the randomly generated password
            res.status(400).json({
                error: 'invalid email entered, this email is not associated with a user',
            });
        } else {
            let name = existing.Name;
            let password = 'pass2'; // ideally we'll change it to a random password later
            let userId = existing.id;

            // update new password and hash
            existing.Password = await bcrypt.hash(password, 10);

            // update the volunteer list
            const updatedEntry = await VolunteerModel.findByIdAndUpdate(
                userId,
                existing,
                { new: true }
            );

            if (!updatedEntry) {
                res.status(400).json({
                    error: 'resetting the password failed',
                });
            } else {
                // try and email new user with username and password
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'weconnectteam34@gmail.com',
                        pass: 'gdjs kfvv njae kelr',
                    },
                });

                const text =
                    '<h2>Successful password reset</h2> \
                    <p>Dear ' +
                    name.split(' ')[0] +
                    ',</p> \
                    <p>This is an email to inform you of a successful password reset to your WeConnect account.</p> \
                    <p> <p> \
                    <p>Email: ' +
                    user +
                    '<p> \
                    <p>Password: ' +
                    password +
                    '<p> \
                    <p> <p> \
                    <p>If you have any questions or need assistance, feel free to contact our support team @ weconnect@volunteeringvictoria.org.au</p> \
                    <p> <p> \
                    <p>Best regards,</p> \
                    <p>WeConnect Team</p> \
                    ';

                const mailOptions = {
                    from: 'weconnectteam34@gmail.com',
                    to: user,
                    subject: 'WeConnect Password Reset',
                    html: text,
                };

                transporter.sendMail(mailOptions, function (error, success) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            error: 'error occured when trying to contact registered email',
                        });
                    } else {
                        console.log('email sent successfully');
                    }
                });

                res.json('done');
            }
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Update password request
volunteerRouter.post('/changepass', async (req: Request, res: Response) => {
    try {
        const user = req.body.Email;
        const password = req.body.Password;
        const existing = await VolunteerModel.findOne({
            Email: { $regex: new RegExp(user, 'i') },
        }).exec();

        if (!existing) {
            // hash the randomly generated password
            res.status(400).json({
                error: 'invalid email entered, this email is not associated with a user',
            });
        } else {
            let name = existing.Name;
            let userId = existing.id;

            // change to new hashed password
            existing.Password = await bcrypt.hash(password, 10);

            // update the volunteer list
            const updatedEntry = await VolunteerModel.findByIdAndUpdate(
                userId,
                existing,
                { new: true }
            );

            if (!updatedEntry) {
                res.status(400).json({ error: 'changing the password failed' });
            } else {
                // try and email new user with username and password
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'weconnectteam34@gmail.com',
                        pass: 'gdjs kfvv njae kelr',
                    },
                });

                const text =
                    '<h2>Successful password change</h2> \
                    <p>Dear ' +
                    name.split(' ')[0] +
                    ',</p> \
                    <p>This is an email to inform you of a successful password change to your WeConnect account.</p> \
                    <p> <p> \
                    <p>If you have any questions or need assistance, feel free to contact our support team @ weconnect@volunteeringvictoria.org.au</p> \
                    <p> <p> \
                    <p>Best regards,</p> \
                    <p>WeConnect Team</p> \
                    ';

                const mailOptions = {
                    from: 'weconnectteam34@gmail.com',
                    to: user,
                    subject: 'WeConnect Password Update',
                    html: text,
                };

                transporter.sendMail(mailOptions, function (error, success) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            error: 'error occured when trying to contact registered email',
                        });
                    } else {
                        console.log('email sent successfully');
                    }
                });

                res.json('done');
            }
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Deletion route to delete an existing user from all aspects of the database
volunteerRouter.post(
    '/delete',
    isLoggedIn,
    async (req: Request, res: Response) => {
        try {
            const email = req.body.Email;

            let userId;
            const existing = await VolunteerModel.findOne({
                Email: { $regex: new RegExp(email, 'i') },
            }).exec();

            if (!existing) {
                res.status(400).json({ error: 'cannot find user' });
            } else {
                userId = existing.id;
            }

            if (userId) {
                const organisations = await OrganisationModel.find({});

                for (let i = 0; i < organisations.length; i++) {
                    const currOrganisation = organisations[i];
                    const volunteerList = currOrganisation.Volunteers;

                    if (volunteerList.includes(userId)) {
                        const newVolunteerList = organisations[
                            i
                        ].Volunteers.filter((x) => x != userId);
                        currOrganisation.Volunteers = newVolunteerList;

                        // update the volunteer list
                        await OrganisationModel.findByIdAndUpdate(
                            organisations[i]._id,
                            currOrganisation,
                            { new: true }
                        );
                    }
                }

                const del = await VolunteerModel.deleteOne({ _id: userId });
                if (del) {
                    res.status(200).json('successfully deleted');
                } else {
                    res.status(400).json('failed');
                }
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

volunteerRouter.get('/surveysToDo/:id', async (req: Request, res: Response) => {
    const volunteerId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(volunteerId))
        return res.status(400).json({ message: 'Is not valid object id' });
    try {
        const volunteer = await VolunteerModel.findById(volunteerId);
        res.status(200).json({ SurveysToDo: volunteer.SurveysToDo });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

async function validateNonEmptyFields(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body.Email || !req.body.Name) {
        res.status(500).json({
            error: 'some missing fields - ensure all required fields are filled',
        });
    } else {
        next();
    }
}

async function validateEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const valid = await emailValidator.validate(req.body.Email);

        if (!req.body.Email || !valid) {
            res.status(500).json({
                error: 'invalid email entered - ensure the email is of a valid format',
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export default volunteerRouter;
