const fs = require('fs')
var Modules = {}

fs.readdirSync("modules").forEach(path=>{
    console.log(path)
})
