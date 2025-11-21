# Fix for Render Deployment Error

If you're getting the error:
```
Error: Cannot find module '/opt/render/project/src/dist/index.js'
```

## Solution: Use TypeScript Directly (Simpler Approach)

In Render dashboard, use these settings:

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

This will use `ts-node` to run TypeScript directly without needing to build first.

---

## Alternative Solution: Fix the Build Path

If you prefer to use the compiled JavaScript version:

### Build Command:
```
cd backend && npm install && npm run build
```

### Root Directory:
Leave empty (don't set it to `backend`)

### Start Command:
```
node backend/dist/index.js
```

But the first solution (using `npm start`) is simpler and recommended!

