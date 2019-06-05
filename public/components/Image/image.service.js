import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from '../../shared/mapping.utils';
import { StorageManagerInstance } from '../../shared/storage.utils';


export function uploadImage(data) {
    // console.log('uploadImage', data);
    return Ajax().post('/image-upload', {
        body: JSON.stringify({ obj: data }), // data: {file: file, url: url}
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}

export function tagImage(data) {
    // console.log(data);
    return Ajax().post('/image-tag', {
        body: JSON.stringify({ obj: data }), // data: {file: file, url: url}
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}

export function updateBranchImages(images) {
    // console.log(images);
    return Promise.all(images.map(image => {
        const { file, ...m } = image;
        const f = {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                folder: 'branch',
            }
        }
        return uploadImage({ ...f, ...m }).then(res => {
            // console.log(res);
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            return Promise.resolve(res.obj);
        });
    }));
}

export function updateContactImages(images) {
    // console.log(images);
    return Promise.all(images.map(image => {
        const { file, ...m } = image;
        const f = {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                folder: 'contact',
            }
        }
        return uploadImage({ ...f, ...m }).then(res => {
            // console.log(res);
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            return Promise.resolve(res.obj);
        });
    }));
}

export function updateMealImages(images) {
    // console.log(images);
    return Promise.all(images.map(image => {
        const { file, ...m } = image;
        const f = {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                folder: 'meal',
            }
        }
        return uploadImage({ ...f, ...m }).then(res => {
            // console.log(res);
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            return Promise.resolve(res.obj);
        });
    }));
}

export function tagImages(images) {
    // console.log(images);
    return Promise.all(images.map(image => {
        const { file, ...m } = image;
        const f = {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                folder: 'meal',
            }
        }
        return tagImage({ ...f, ...m }).then(res => {
            // console.log(res);
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            return Promise.resolve(res.obj);
        });
    }));
}