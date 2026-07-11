const { execSync } = require('child_process');

try {
  // Get Git status
  const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
  const lines = statusOutput.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    console.log("No uncommitted files found.");
    process.exit(0);
  }

  for (const line of lines) {
    // line format is usually like " M path/to/file" or "?? path/to/file"
    let filePath = line.substring(3);

    // Handle renamed files "R  old -> new"
    if (filePath.includes(' -> ')) {
      filePath = filePath.split(' -> ')[1];
    }

    // Strip surrounding quotes if Git added them
    if (filePath.startsWith('"') && filePath.endsWith('"')) {
      filePath = filePath.substring(1, filePath.length - 1);
    }

    console.log(`\n📦 Staging: ${filePath}`);
    execSync(`git add "${filePath}"`, { stdio: 'inherit' });

    const safeMessage = `commit: update ${filePath}`.replace(/"/g, '\\"');
    console.log(`💾 Committing: ${safeMessage}`);
    execSync(`git commit -m "${safeMessage}"`, { stdio: 'inherit' });
  }

  console.log('\n✅ All changed files have been committed individually!');
  console.log('You can now push manually using: git push');

} catch (error) {
  console.error('\n❌ An error occurred:', error.message);
  process.exit(1);
}
