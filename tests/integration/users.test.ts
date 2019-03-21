require('../../environment')();
import AppController from '../../controllers/AppController';
import UsersController from '../../controllers/UsersController';
import request from 'supertest';

let server: any;

describe('api/users', () => { 
    
    beforeEach(() => { 
        const controller = new AppController([ 
            new UsersController()
        ]);
        server = controller.server;
    });

    afterEach(() => { server.close() });

    describe('GET /', () => { 
        it('should create user', async () => { 
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
        });
    });
   
});