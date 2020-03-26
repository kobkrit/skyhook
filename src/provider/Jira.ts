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

        try {
            console.log(JSON.stringify(this.body))
        } catch (e) {
            console.log(e)
        }

        if (this.body.webhookEvent.startsWith('jira:issue_')) {
            isIssue = true
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
        let comment = null

        //Only issue update for now.
        if (isIssue) {
            // create the embed
            const embed = new Embed()
            embed.url = `${domain}/browse/${issue.key}`

            // Check if having changelog
            if (this.body.changelog &&
                this.body.changelog.items &&
                this.body.changelog.items[0]) {
                    if (this.body.changelog.items[0].toString === 'Done') {
                        moveToDone = true
                    }
            // Check if having comment
            } else if (this.body.comment) {
                    comment = this.body.comment
            }

            if (action === 'created') {
                embed.title = `😘 New Issue! ${issue.key} - ${issue.fields.summary}`
                embed.description = `${user.displayName} ${action} issue: ${issue.key} - ${issue.fields.summary} (assigned to ${issue.fields.assignee.displayName})`
            } else if (moveToDone) {
                embed.title = `😆 Issue DONE! ${issue.key} - ${issue.fields.summary}`
                embed.description = `Hooray!!! ${user.displayName} CLOSED issue: ${issue.key} - ${issue.fields.summary} (assigned to ${issue.fields.assignee.displayName})`
            } else if (comment) {
                embed.title = `🤔 New Comment! ${issue.key} - ${issue.fields.summary}`
                embed.description = `${comment.updateAuthor.displayName} comment: \n\n \"${comment.body.trim()}\" \n\n on issue: ${issue.key} - ${issue.fields.summary} (assigned to ${issue.fields.assignee.displayName})`
            } else {
                //Other cases, do not send the notification, it is too much.
                return
            }
            this.addEmbed(embed)
        } else {
            return
        }
    }
}

export { Jira }
