const express = require('express');
const bodyParser = require('body-parser');
const ynab = new (require("./ynab"))(process.env.YNAB_ACCESS_TOKEN, "last-used");
const parser = require("./parser");

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => res.send(`\
<!doctype html><body>
  <h1>Bank Alerts to YNAB</h1>
  <p>This application provides a webhook to route spending alert emails from a bank to <a href="https://www.youneedabudget.com">YNAB</a> so transactions appear in YNAB seconds after they occur.</p>
  <a href=\"https://glitch.com/edit/#!/shiny-secure\">README</a>
</body>
`));

app.post("/webhook/:account_id?", async (request, response) => {
  console.log("Webhook received");
  
  const account_id = request.params.account_id;
  const body_plain = request.body.plain;
  
  try {
    console.log(body_plain);
    const parsed = parser.parse(body_plain);
    
    if (parsed == null){
      // Send 501 Not Implemented when message cannot be parsed
      console.log("Could not be parsed");
      response.sendStatus(501);
      return;
    }

    const { date, amount, payee } = parsed;
    console.log(`Creating YNAB transaction: ${date};${amount};${payee}`);
    await ynab.create_transaction(account_id, date, amount, payee);
    
    response.sendStatus(201);  
  }
  catch (e) {      
    console.error(e);
    response.sendStatus(500);  
  }  
});


const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});