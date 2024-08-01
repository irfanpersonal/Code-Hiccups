import fs from 'node:fs';

const deleteImage = async(path: string) => {
    await fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

export default deleteImage;