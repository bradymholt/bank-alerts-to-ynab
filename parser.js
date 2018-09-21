const parsers = [
  // Citibank
  // Example:
  //   Account #: XXXX3184 $2.04 at CORNER STORE 1234        HOUSTON      US\non 08/29/2018, 11:40 AM ET exceeds the $0.00 transaction amount you've\nspecified.\n
  { bank: 'Citibank', regex: /\$(\d+.\d+) at ([\s\S]*)on[\s\S]*(\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // Chase Credit
  // Example:
  //   This is an Alert to help you manage your credit card account ending in 0000.\n\nAs you requested, we are notifying you of any charges over the amount of\n($USD) 0.00, as specified in your Alert settings.\nA charge of ($USD) 7.84 at Subway Restaurant has been authorized on\n08/29/2018 4:04:23 PM EDT.\n\n  
  { bank: 'Chase Credit', regex: /charge of.*(\d+.\d+) at ([\s\S]*) has been authorized on[\s\S]*(\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // Chase Debit
  // Example:
  //   This is an Alert to help manage your account ending in 1234.\n\nA $0.75 debit card transaction to SUBWAY RESTAURANT    on 08/29/2018 4:05:01 PM EDT exceeded your $0.00 set Alert limit.
  { bank: 'Chase Debit', regex: /.*(\d+.\d+) debit card transaction to ([\s\S]*) on (\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // Bank Of America
  // Example:
  //   Hi, JOHN, a credit card transaction was made above your chosen alert limit\n\nAmount: $29.53\nCredit card: Bank of America Credit Visa ending in - 3273\nWhere: at SUPERS #240                 SHERWOOD     WI\nType: RETAIL
  { bank: 'Bank Of America', regex: /Amount: \$(\d+.\d+)[\s\S]*Where: ([\s\S]*)\nType:[\s\S]*Transaction date: (\w+) (\d+), (\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // Wells Fargo
  // Example:
  //   *Credit card* XXXX-XXXX-XXXX-1111\n\nPurchase amount* 24.23 USD\n\n*Purchase location* at TRUE VALUE #0023 in DESTIN USA\n\n*Date* 08/30/2018
  { bank: 'Wells Fargo', regex: /Purchase amount\* (\d+.\d+)[\s\S]*Purchase location\* ([\s\S]*)Date\* (\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // Discover
  // Example:
  //   your Discover card purchase or cash advance exceeds the\n\namount you have set\n\nMerchant: SUBWAY RESTAURANT E\n\nAmount: $2.93\n\nDate: August 30, 2018\n\n\n\nWasn\'t you? Call us immediately at\n\n1-800-DISCOVER   
  { bank: 'Discover', regex: /Merchant: (.*)[\s\S]*Amount: \$(\d.\d+)[\s\S]*Date: (\w+) (\d+), (\d{4})/, amount_group: 2, payee_group: 1, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // PayPal
  // Example:
  //   You sent $150.00 USD to John Doe\n\nTransaction Details\n\nTransaction ID: 111111111 August 11, 2018
  { bank: 'PayPal', regex: /You sent \$?(\d+.\d+)[\s\S]*to ([\s\w]*)Transaction Details[\s\S]*Transaction ID: [\s\S]* (\w+) (\d{2}), (\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: false },
  
  // PayPal
  // Example:
  //   You sent $150.00 USD to John Doe\n\nTransaction Details\n\nTransaction ID: 111111111 August 11, 2018
  { bank: 'PayPal Payment', regex: /You sent a payment for \$?(\d+.\d+)[\s\S]*to (\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3})[\s\S]*Sent on:(\w+) (\d+), (\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5, inverse_amount: true }
];

function parse(msg){
  let result = null;
  // Try each parser until we're able to parse the message
  for(let parser of parsers){
    const {bank, regex, amount_group, payee_group, month_group, day_group, year_group, inverse_amount} = parser;
    
    const matches = msg.match(regex);
    if (matches != null){
      console.log(`Parsed as ${bank} message`);
      let amount = matches[amount_group];
      if (inverse_amount){
        amount = (amount * -1).toString();
      }
      const payee = matches[payee_group];
      const year = matches[year_group];      
      const day = matches[day_group];

      let month = matches[month_group];
      if (month.match(/[A-Za-z]/)) {
        // Translate month name to month number (i.e. 'June' -> '6')
        month = (new Date(`${month}-1-01`).getMonth()+1).toString();      
      }

      // Format date as ISO (2018-08-27)
      const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      result = { date, payee, amount }; 
      break;
    }
  }
  return result;
}

module.exports.parse = parse;