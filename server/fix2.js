const fs = require('fs');
const path = require('path');

// 1. Fix Cart.model.ts
let p = path.join(__dirname, 'src/models/Cart.model.ts');
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/CartSchema\.pre<ICart>\('save', function \(next\) \{/g, "CartSchema.pre('save', function(this: any, next) {");
fs.writeFileSync(p, c);

// 2. Fix Address.model.ts
p = path.join(__dirname, 'src/models/Address.model.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/AddressSchema\.pre<IAddress>\('save', async function \(next\) \{/g, "AddressSchema.pre('save', async function(this: any, next) {");
fs.writeFileSync(p, c);

// 3. Fix Review.model.ts
p = path.join(__dirname, 'src/models/Review.model.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/this\.model\('Review'\)\.calcAverageRatings\(this\.food\);/g, "(this.constructor as any).calcAverageRatings(this.food);");
fs.writeFileSync(p, c);

// 4. Fix Order.model.ts
p = path.join(__dirname, 'src/models/Order.model.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/import \{ ICartItem \} from '\.\/Cart\.model';\r?\n/g, "");
fs.writeFileSync(p, c);

// 5. Fix User.model.ts
p = path.join(__dirname, 'src/models/User.model.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/transform\(doc, ret\) \{/g, "transform(_doc, ret) {");
c = c.replace(/export interface IUser extends Document \{/, "export interface IUser extends Document {\n  isActive: boolean;");
c = c.replace(/isVerified: \{/, "isActive: { type: Boolean, default: true },\n    isVerified: {");
fs.writeFileSync(p, c);

// 6. Fix auth.middleware.ts
p = path.join(__dirname, 'src/middleware/auth.middleware.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/\(req: Request, res: Response, next: NextFunction\)/g, "(req: Request, _res: Response, next: NextFunction)");
fs.writeFileSync(p, c);

// 7. Fix cart.service.ts
p = path.join(__dirname, 'src/services/cart.service.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/isAvailable/g, "availability");
c = c.replace(/!food\.availability/g, "!food.availability"); // just to be sure it replaced correctly
fs.writeFileSync(p, c);

// 8. Fix favorite.service.ts
p = path.join(__dirname, 'src/services/favorite.service.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/isAvailable/g, "availability");
c = c.replace(/import \{ Types \} from 'mongoose';\r?\n/g, "");
fs.writeFileSync(p, c);

// 9. Fix notification.service.ts
p = path.join(__dirname, 'src/services/notification.service.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/notification\.isRead = true;/g, "notification.read = true;");
c = c.replace(/if \(!notification\.readAt\) \{\s+notification\.readAt = new Date\(\);\s+\}/g, "");
c = c.replace(/isRead: false/g, "read: false");
c = c.replace(/isRead: true, readAt: new Date\(\)/g, "read: true");
fs.writeFileSync(p, c);

// 10. Fix profile.service.ts
p = path.join(__dirname, 'src/services/profile.service.ts');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/Address\.create\(\{ \.\.\.data, customer: userId \}\);/g, "Address.create({ ...data, label: data.label as any, customer: userId });");
fs.writeFileSync(p, c);

// 11. Fix routes
const routesDir = path.join(__dirname, 'src/routes');
const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));
routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import \{ requireAuth \} from '\.\.\/middleware\/auth\.middleware';/g, "import { authenticate } from '../middleware/auth.middleware';");
  content = content.replace(/router\.use\(requireAuth\);/g, "router.use(authenticate);");
  fs.writeFileSync(filePath, content);
});

console.log('Fixed all files');
