module.exports = async function({ github, context, core, process }) {
    const scriptPath = `.github/scripts/my-script.js`;
    const script = require(`../${scriptPath}`);
    await script({ github, context, core, process });
}