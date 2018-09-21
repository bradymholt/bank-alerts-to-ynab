# Bank Alerts to YNAB

This project routes spending alert emails from your bank to YNAB so your transactions appear in YNAB seconds after they occur.

## Supported Banks
- Chase
- Bank of America (Credit)
- Citibank
- Wells Fargo (Credit)
- Discover
- PayPal

## 2 minute setup

Setup is free, easy, and should take less than 2 minutes.  You will be cloning a Glitch project to act as a webhook server, creating a free CloudMailin account which will give you an email address that will route to your webbook, and then telling your bank to send spending alerts to your CloudMailin email address.

### Setup Demo Video

[![demo-video](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2Fdownload.png?1535749553134)](https://youtu.be/PDiMCY-NngQ)


### Glitch
1. Click "Remix This" button on the right side of [this page](https://glitch.com/edit/#!/bank-alerts-to-ynab).  This will clone this Glitch project so you are working with your own project.
1. Edit the .env of this project and specify a [YNAB API Access Token](https://api.youneedabudget.com/#personal-access-tokens).  It should look something like this:

        YNAB_ACCESS_TOKEN=e46942a2-86a6-FAKE-4931-b9a3-6c1d1c5c4b16

    As long as you leave secrets in the `.env` file, [they should be safe](https://support.glitch.com/t/how-do-i-set-environment-variables/3921/2).
1. Note your new project name which will be used next.  Your project name is shown on the top left and if the name was "awesome-app" it would look like this: ![glitch-app-name](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-14-59.png?1535631307831)

### CloudMailin
1. Go to [https://www.cloudmailin.com](https://www.cloudmailin.com) and create an account
1. Specify your POST target as `https://awesome-app.glitch.me/webhook` (given your project name is "awesome-app") and POST Format as "JSON Format".
![cloudmailin-setup](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-11-58.png?1535631130040)
1. Note the new @cloudmailin.net address assigned to you (it will look something like: 
99198c6b4ba23c34c1f7@cloudmailin.net)

### Bank
1. Go to your bank's website and setup spending alerts to be sent to your @cloudmailin.net address.  If your bank does not allow you to setup a secondary alert email address you can setup a forwarding rule on your email service.  The _Alert Setup_ section below  has information and screenshots for specific banks.

Now, spend something 💵 and watch the transaction show up in YNAB within seconds. 🎉


### Alert Setup

In general, you need to setup an email alert notifcation to be sent to your unique CloudMailin email address when any activity happens on your account.  Most of the supported banks let you configure a secondary email for these alerts but in the case where they don't you can setup a forwarding rule from your email service.  When given the option for text or HTML format, chosing text will be more reliable.

#### Chase

##### Checking

On the Profile & settings page:

![chase-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2011-09-37.png?1535645420754
)

##### Credit

On the Profile & settings page:

![chase-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2011-11-20.png?1535645496352)

#### Citibank

On the Settings > Account Alerts page:

![citibank-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2Fimage.png?1535625926570)

#### Bank of America

##### Credit

On the Accounts > Alerts page:

![bank-of-america-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2009-48-38.png?1535640545376)

#### Wells Fargo

##### Credit

On the Account Summary > Alerts page:

![wells-fargo-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2011-04-08.png?1535645082291)

#### Discover

Discover does not allow you to specify a secondary email address for alerts so you will need to setup a rule to forward emails received from `discover@service.discover.com` to your CloudMailin email address.

##### Credit


On Manage > Account Alerts page:

![discover-alert](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2013-22-36.png?1535653430107)

#### PayPal

PayPal always sends email alerts when any activity occurs on the account and you cannot specify a secondary email address for these.  You will need to setup a rule to forward emails received from `service@paypal.com` to your CloudMailin email address.

## Going Further

### Routing to Specific YNAB Accounts

With the 2 minute setup above, transactions will be routed to the first account on your budget, to keep things simple initially.  To route to a specific YNAB account:
1. Determine the target YNAB account ID by either enumerating your accounts through `GET /budgets/:id/accounts` on the [YNAB API](http://api.youneedabudget.com/) or by navigating to a specific account in YNAB from your desktop browser and 
grabbing the account ID from the URL (format is: https://app.youneedabudget.com/<budget_id>/accounts/<account_id>).
1.  Append your YNAB account ID to the CloudMailin POST target URL.  For example, if your Glitch app name is "awesome-app" and your YNAB account ID is 66187f1-FAKE-8d05 your CloudMailin Incoming Address setting should look like this: ![cloudmailin-incoming-address-setting](https://cdn.glitch.com/11b0ff9a-c375-4ecb-93d2-c4c09b10d589%2FImage%202018-08-30%2007-10-07.png?1535631021130)
1. If you want to setup multiple banks associated to separate YNAB accounts, you can create additional email addresses in CloudMailin and use a different POST target for each.
