const fs = require('fs');
const path = require('path');

module.exports = async function({ github, context, core, process }) {
    const scriptPath = path.join(context.payload.repository.full_name, '.github/scripts/commenter.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const script = eval(`(${scriptContent})`);
    await script({ github, context, core, process });
}