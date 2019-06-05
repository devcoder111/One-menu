import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

import * as Meal from './meal.service';

//
// POST
//


export function postMenuBranch (menuBranch) {

    return Ajax().post('/menu-branch', {
        body: JSON.stringify(menuBranch),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then(res => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let id = res.obj[0];

        return Promise.resolve(id);
    });
}

// export function updateMenuBranches (menuID, branches) {
//   console.log('updateMenuBranches', menuID, branches)
//     return branches ? Ajax().delete('/menu-branch-id', {
//       body: JSON.stringify({id: menuID}),
//       headers: {
//         "content-type": "application/json",
//         "cache-control": "no-cache",
//         "x-access-token": StorageManagerInstance.read('token')
//       }
//     }).then(res => {
//       console.log('updateMenuBranches res', res)
//       if (!res || !res.success) {
//         return Promise.reject(res);
//       }
//
//       // console.log('updateMenuBranches res', res)
//       if (branches) {
//         branches.forEach(branch => {
//           const data = {
//             obj: {
//                 MenuID: menuID,
//                 BranchID: branch.BranchID,
//             },
//           }
//           postMenuBranch(data);
//         })
//       }
//
//       return Promise.resolve(true);
//     }) : Promise.resolve();
// }

export function updateMenuBranches (menuId, branches) {
  // console.log('updateMenuBranches', branches)
  if (!branches || branches.length <= 0) {
    return Promise.resolve();
  }

  // Compare menu categories in the object to the categories in the DB
  let ids = branches.map(c => c.BranchID)

  return Ajax().put('/menu-branches', {
    body: JSON.stringify({
      id: menuId,
      branchesIds: ids,
    }),
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "x-access-token": StorageManagerInstance.read('token')
    }
  });

  return Promise.resolve();
}

export function removeMenuBranch (menuBranch) {
    return Ajax().delete('/menu-branch', {
        body: JSON.stringify(menuBranch),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}
