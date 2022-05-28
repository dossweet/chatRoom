const os = require('os') // os是node的原生库，不需要手动导入
const platform = os.platform()

console.log(platform)