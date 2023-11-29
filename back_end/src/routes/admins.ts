import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import AdminModel from '../models/admin';
import OrganisationModel from '../models/organisation';
import jwt from 'jsonwebtoken';
import isLoggedIn from './login';
import bcrypt from 'bcryptjs';

const adminRouter = express.Router();

adminRouter.get('/', async (req: Request, res: Response) => {
    res.send('hey');
});

// Get all admins for funsises
adminRouter.post(
    '/validate',
    isLoggedIn,
    async (req: Request, res: Response) => {
        try {
            const admin = await AdminModel.findOne({
                Email: { $regex: new RegExp(res.locals.user.Email, 'i') },
            }).exec();

            // check if admin has right to view page
            if (
                !mongoose.Types.ObjectId.isValid(req.body.id) ||
                !admin.Organisations.includes(req.body.id)
            ) {
                res.json(false);
            } else {
                res.json(true);
            }
        } catch (err: any) {
            res.status(500).json(false);
        }
    }
);

// Get all organisations associated with an admin
adminRouter.get(
    '/organisations',
    isLoggedIn,
    async (req: Request, res: Response) => {
        const Ids = [];
        const Names = [];
        const Logos = [];

        try {
            const admin = await AdminModel.findOne({
                Email: { $regex: new RegExp(res.locals.user.Email, 'i') },
            }).exec();

            // validate phase of getting organisations, only send off existing organisations
            for (const organisationId of admin.Organisations) {
                // no error reporting, as we don't want to stop the search after one erroneous organisation
                if (mongoose.Types.ObjectId.isValid(organisationId)) {
                    const organisation =
                        await OrganisationModel.findById(organisationId);
                    if (organisation) {
                        Ids.push(organisationId);
                        Names.push(organisation.Name);
                        Logos.push(organisation.Logo);
                    }
                }
            }

            res.json({ ids: Ids, names: Names, logos: Logos });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Login route to verify a user and get a token
adminRouter.post('/login', async (req: Request, res: Response) => {
    try {
        // check if the user exists, case insensitive
        const user = await AdminModel.findOne({
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
                const token = await jwt.sign(
                    { Email: user.Email },
                    process.env.SECRET
                );
                res.json({ authorization: 'Bearer ' + token });
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default adminRouter;
