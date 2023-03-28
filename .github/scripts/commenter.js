module.exports = async ({github, context, process}) => {
    const {data: comments} = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    });

    const botComment = comments.find(comment => {
        return comment.user.type === 'Bot' && comment.body.includes('Terraform Format and Style');
    });

    const output = buildComment(process);

    if (botComment) {
        github.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: botComment.id,
            body: output
        })
    } else {
        github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
        })
    }
}

function buildComment(process) {
    const resultEmoji = (process.env.PLAN_OUTCOME === "success" ? "✅" : "❌");

    return `
#### Terraform Format and Style 🖌${process.env.FMT}
#### Terraform Initialization ⚙️${process.env.INIT}
#### Terraform Validation 🤖${process.env.VALIDATE_OUTCOME}
<details><summary>Validation Output</summary>

\`\`\`\n
${process.env.VALIDATE}
\`\`\`

</details>

#### Terraform Plan ${resultEmoji} ${process.env.PLAN_OUTCOME}

<details><summary>Show Plan</summary>

\`\`\`\n
${process.env.PLAN}
\`\`\`

</details>
        
*Pusher: @${process.env.ACTOR}, Action: ${process.env.EVENT_NAME}`
}