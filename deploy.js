const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = 'KzKHZyM10H9JcBnNNbmereaH';
const PROJECT_NAME = 'agentgecko';

async function createDeployment() {
  console.log('🦎 Deploying AgentGecko...\n');
  
  const files = [];
  const outDir = path.join(__dirname, 'out');
  
  if (!fs.existsSync(outDir)) {
    console.error('❌ No "out" directory found. Run "next build" first.');
    process.exit(1);
  }
  
  function readDirRecursive(dir, baseDir = '') {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(baseDir, item).replace(/\\/g, '/');
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        readDirRecursive(fullPath, relativePath);
      } else {
        files.push({
          file: relativePath,
          data: fs.readFileSync(fullPath, 'base64')
        });
      }
    });
  }
  
  readDirRecursive(outDir);
  console.log(`Found ${files.length} files to deploy\n`);
  
  const deploymentData = JSON.stringify({
    name: PROJECT_NAME,
    files: files.map(f => ({
      file: f.file,
      data: f.data,
      encoding: 'base64'
    })),
    projectSettings: {
      framework: null
    },
    target: 'production'
  });
  
  const options = {
    hostname: 'api.vercel.com',
    path: '/v13/deployments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(deploymentData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log('✅ Deployment created successfully!');
          console.log(`🌐 URL: https://${result.url}`);
          resolve(result);
        } else {
          console.error('❌ Deployment failed');
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${data.slice(0, 500)}`);
          reject(new Error(data));
        }
      });
    });
    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });
    req.write(deploymentData);
    req.end();
  });
}

createDeployment().catch(console.error);
