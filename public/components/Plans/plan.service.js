import { map } from 'lodash';
import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

export function sendCustomOrder (data, cb) {
    console.log('sendCustomOrder');
    return new Promise((resolve, reject) => {
        Ajax().post('/plans/custom-order', {
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then(res => {
            if (!res || !res.success) {
                if (cb && typeof cb === 'function') {
                   cb(false)
                }
                reject(res);
            }
            if (cb && typeof cb === 'function') {
                cb(true)
            }
            resolve(res.obj);
        }).catch(err => {
            reject(err);
        });
    });
}

