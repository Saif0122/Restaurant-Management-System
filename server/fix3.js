const fs = require('fs');
const path = require('path');

// 1. Fix Cart.model.ts
let p = path.join(__dirname, 'src/models/Cart.model.ts');
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\(sum, item\)/g, "(sum: number, item: any)");
c = c.replace(/function\(this: any, next\)/g, "function(this: any, next: any)");
fs.writeFileSync(p, c);

// 2. Fix Address.model.ts
p = path.join(__dirname, 'src/models/Address.model.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/async function\(this: any, next\)/g, "async function(this: any)");
c = c.replace(/next\(\);\s+\}\);/g, "});");
fs.writeFileSync(p, c);

// 3. Fix auth.controller.ts
p = path.join(__dirname, 'src/controllers/auth.controller.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/generateTokens\(user\._id\)/g, "generateTokens(user._id.toString())");
c = c.replace(/generateTokens\(user\._id,\s*user\.role\)/g, "generateTokens(user._id.toString(), user.role)"); // If there are 2 args
fs.writeFileSync(p, c);

console.log('Fixed final TS errors');
