const { exec } = require('child_process');

// Serve the build folder with SPA mode
exec('serve -s "C:/Users/LTAdmin/Desktop/LT24_Cocopah_mid_client/app/build" --single -l 3000', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});