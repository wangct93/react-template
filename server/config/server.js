/**
 * Created by wangct on 2018/12/19.
 */

module.exports = {
  port:8080,
  assets:['dist','server/assets'],
  assetsPaths:['assets','/'],
  userPathExclude:[
    '/',
    '/book',
    '/chapter',
    '/dic',
    '/file',
    '/voice',
    '/user/login',
    '/user/create',
    '/user/logout',
    '/keyword',
    '/rank',
  ],
};
