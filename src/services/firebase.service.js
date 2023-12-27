import { storage } from '../firebase/index';

import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import ImageResize from 'image-resize';

export default class UserService {
  static async uploadFile(userId, file) {
    const fileName = file.name;
    file = await this.resizeFile(file);

    const fileRef = ref(storage, `movieCovers/${userId}/${fileName}`);
    const uploadInfo = await uploadString(fileRef, file, 'data_url');

    return await getDownloadURL(uploadInfo.ref);
  }

  static async resizeFile(file) {
    const imageResize = new ImageResize({
      format: 'png',
      width: 300,
      height: 400,
      quality: 1
    });

    return imageResize.play(file);
  }
}