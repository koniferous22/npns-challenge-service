import mongoose from 'mongoose';
import mongo from 'mongodb';
import Grid from 'gridfs-stream';
import { FileUpload } from 'graphql-upload';
import { DatabaseNotConnectedError } from '../../utils/exceptions';
import { Config } from '../../config';

export class GridFS {
  gridFs: ReturnType<typeof Grid>;
  constructor() {
    const CONNECTED_STATE = 1;
    if (mongoose.connection.readyState !== CONNECTED_STATE) {
      throw new DatabaseNotConnectedError(
        Config.getInstance().getConfig().mongoose.host
      );
    }
    this.gridFs = Grid(mongoose.connection.db, mongo);
  }

  async fileUpload(upload: Promise<FileUpload>) {
    const { createReadStream, filename, mimetype } = await upload;

    const stream = createReadStream();
    await new Promise((resolve, reject) => {
      const writeStream = this.gridFs.createWriteStream();
      writeStream.on('finish', resolve);
      writeStream.on('error', (error) => {
        reject(error);
        // TODO test this case whether some form of cleanup is needed
        // unlink(path, () => {
        //   reject(error);
        // });
      });
      stream.pipe(writeStream);
    });
    return {
      filename,
      mimetype
    };
  }
}
