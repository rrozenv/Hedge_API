const config = require('config');
var apn = require('apn');

// Dependencies
import express from 'express';
import debug from 'debug';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
// Models
import { UserModel, UserType } from '../models/user.model'
// Interfaces
import IController from '../interfaces/controller.interface';
import APIError from '../util/Error';
// Path
import Path from '../util/Path';
// APN


// MARK: - PortfoliosController
class PushNotificationsController implements IController {

    // MARK: - Properties
    public router = express.Router({});
    private apnProvider: any;
    private bundleId: string;
    private log: debug.Debugger;

    // MARK: - Constructor
    constructor() {
        this.log = debug('controller:notifications');
        var options = {
            token: {
                key: "apns.p8",
                keyId: config.get('apnKeyId'),
                teamId: config.get('appleTeamId')
            },
            production: false
        };
        this.apnProvider = new apn.Provider(options);
        this.bundleId = config.get('iosAppBundleId');
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // GET
        this.router.post(`${Path.notifications}`, this.sendPushNotificationAll);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get Positions for Hedge Fund
    private sendPushNotificationAll = async (req: any, res: any) => {
        await this.sendNotificationAllUsers(req.body.title, req.body.body);
        res.send('Success');
    }

    sendNotificationAllUsers = async (title?: string, body?: string) => {
        const users = await UserModel
            .find({
                apnToken: { $ne: null },
                notificationsEnabled: true
            });

        console.log(users);

        await Promise.all(
            users.map(async (user) => {
                let note = new apn.Notification();
                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.badge = 1;
                note.sound = "ping.aiff";
                note.alert = title;
                note.payload = { 'messageFrom': 'Hegde' };
                note.topic = this.bundleId;
                const result = await this.apnProvider.send(note, user.apnToken);
                console.log(`Notif result: ${result}`);
                return note
            })
        );
    }

}


export { PushNotificationsController }