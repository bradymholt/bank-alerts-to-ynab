# Spending for YNAB

This project allows spending to be imported into YNAB within seconds of it happening.

## 3 minute setup

Setup is easy and should take less than 3 minutes.  You will be cloning a Glitch project to act as a webhook server, creating a CloudMailin account which will give you an email address that will route to your webbook, and then telling your bank to send spending alerts to your CloudMailin email address.

### Glitch
1. Click "Remix This" button on the right side of this page
1. Edit the .env of this project and specify a [YNAB API Access Token](https://api.youneedabudget.com/#personal-access-tokens) and a YNAB account ID (as long as you leave secrets in the `.env` file, they should be safe).  It should look something like this:

        YNAB_ACCESS_TOKEN=e46942a2-86a6-FAKE-4931-b9a3-6c1d1c5c4b16

1. Note your new project name which will be used next.  Your project name is shown on the top left and if the name was "awesome-app" it would look like this: ![glitch-app-name](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-14-59.png?1535631307831)

### CloudMailin
1. Go to [https://www.cloudmailin.com](https://www.cloudmailin.com) and create an account
1.  Specify https://[app-name].glitch.me/webbook as the POST target and JSON as the format.  If your Glitch app name is "awesome-app", it should look like this:
![cloudmailin-setup](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-11-58.png?1535631130040)
1. Note the new @cloudmailin.net address assigned to you (it will look something like: 
99198c6b4ba23c34c1f7@cloudmailin.net)

### Bank
1. Go to your bank's website and setup spending alerts to be sent to your @cloudmailin.net address.  The "Alert Setup" section below  has information and screenshots for specific banks.

Now, spend something and watch the transaction show up in YNAB within seconds.

## Supported Banks
- Chase (Credit and Debit)
- Citibank
- Discover

### Alert Setup

#### Chase

On the Profile & settings page:

![chase-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2005-39-05.png?1535625594616)

### Citibank

On the Settings > Account Alerts page:

![citibank-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2Fimage.png?1535625926570)

## Going Further

### Routing to Specific YNAB Accounts

With the 3 minute setup above, transactions will be routed to the first account on your budget, to keep things simple initially.  To route to a specific YNAB account:
1. Determine the target YNAB account ID by either enumerating your accounts through `GET /budgets/:id/accounts` on the [YNAB API](http://api.youneedabudget.com/) or by navigating to a specific account in YNAB from your desktop browser and 
grabbing the account ID from the URL (format is: https://app.youneedabudget.com/<budget_id>/accounts/<account_id>).
1.  Append your YNAB account ID to the CloudMailin POST target URL.  For example, if your Glitch app name is "awesome-app" and your YNAB account ID is 66187f1-FAKE-8d05 your CloudMailin Incoming Address setting should look like this: ![cloudmailin-incoming-address-setting](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-10-07.png?1535631021130)
1. If you want to setup multiple banks associated to separate YNAB accounts, you can create additional email addresses in CloudMailin and use a different POST target for each.


