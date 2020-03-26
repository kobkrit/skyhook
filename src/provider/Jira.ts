import { Embed } from '../model/Embed'
import { BaseProvider } from '../provider/BaseProvider'

/**
 * https://developer.atlassian.com/server/jira/platform/webhooks/
 */
class Jira extends BaseProvider {
    constructor() {
        super()
        this.setEmbedColor(0x1e45a8)
    }

    public getName() {
        return 'Jira'
    }

    public getPath() {
        return 'jira'
    }

    public async parseData() {
        let isIssue: boolean

        console.log(JSON.stringify(this.body))

        if (this.body.webhookEvent.startsWith('jira:issue_')) {
            isIssue = true
        } else if (this.body.webhookEvent.startsWith('comment_')) {
            isIssue = false
        } else {
            return
        }

        // extract variable from Jira
        const issue = this.body.issue
        if (!(issue && issue.fields && issue.fields.assignee)) {
            issue.fields.assignee = {displayName: "nobody"};
        }
        const user = this.body.user
        const action = this.body.webhookEvent.split('_')[1]
        const matches = issue.self.match(/^(https?:\/\/[^\/?#]+)(?:[\/?#]|$)/i)
        const domain = matches && matches[1]

        let moveToDone = false

        //Check if it is to be done
        if (isIssue) {
            //If have changelog
            if (this.body.changelog &&
                this.body.changelog.items &&
                this.body.changelog.items[0]) {
                    if (this.body.changelog.items[0].toString == "Done") {
                        moveToDone = true
                    }
                }
        }

        // create the embed
        const embed = new Embed()
        embed.title = `${issue.key} - ${issue.fields.summary}`
        embed.url = `${domain}/browse/${issue.key}`
        if (isIssue) {
            if (action === 'created') {
                embed.description = `${user.displayName} ${action} issue: ${embed.title} (assigned to ${issue.fields.assignee.displayName})`
            } else if(moveToDone) {
                embed.description = `Hooray!!! ${user.displayName} CLOSED issue: ${embed.title} (assigned to ${issue.fields.assignee.displayName})`
            } else {
                //Other cases, do not send the notification, it is too much.
                return
            }
        } else {
            const comment = this.body.comment
            embed.description = `${comment.updateAuthor.displayName} ${action} comment: ${comment.body} on issue: ${embed.title} (assigned to ${issue.fields.assignee.displayName})`
        }
        this.addEmbed(embed)
    }
}

export { Jira }
