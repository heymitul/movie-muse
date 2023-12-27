import mAxios from './mAxios';

export default class UsersService {
  static async createUser(userInfo) {
    console.log('Registering user.');
    const response = await mAxios.post('/users', { ...userInfo }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }
}