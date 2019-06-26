"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('../../environment')();
const supertest_1 = __importDefault(require("supertest"));
let server;
describe('api/users', () => {
    beforeEach(() => {
        // const controller = new AppController([
        //     new UsersController()
        // ]);
        // server = controller.server;
    });
    afterEach(() => { server.close(); });
    describe('GET /', () => {
        it('should create user', async () => {
            const res = await supertest_1.default(server).get('/api/users');
            expect(res.status).toBe(200);
        });
    });
});
