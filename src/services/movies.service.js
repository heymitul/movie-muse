import mAxios from './mAxios';

export default class MoviesService {
  static async list(paginationInfo = {}) {
    const response = await mAxios.post('/movies/all', paginationInfo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  static async create(movieInfo) {
    const response = await mAxios.post('/movies', { ...movieInfo });
    return response.data;
  }

  static async update(movieId, movieInfo) {
    const response = await mAxios.put(`/movies/${movieId}`, { ...movieInfo });
    return response.data;
  }
}