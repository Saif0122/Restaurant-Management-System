const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/controllers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/req\.user!\.id/g, 'req.user!._id.toString()');
  // Also fix the ApiResponse constructor params
  // It currently is new ApiResponse(200, data, 'message')
  // We need to change it to new ApiResponse(200, 'message', data)
  content = content.replace(/new ApiResponse\((\d+),\s*([^,]+),\s*('[^']+')\)/g, "new ApiResponse($1, $3, $2)");
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed controllers');
