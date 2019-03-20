require('../environment')();
import UserController from '../controllers/UsersController';
import IToken from '../interfaces/token.interface';

test('our first test', () => { 
    const controller = new UserController();
    const token: IToken = { 
        token: "hello",
        expiresIn: 20
    }
    const headers = controller.createHeadersWith(token);
    expect(headers).toMatchObject({ 
        'x-auth-token': token.token,
        'token-expiration': token.expiresIn
    })
});