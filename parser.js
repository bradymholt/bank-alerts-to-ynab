const parsers = [
  // Citibank
  // Example:
  //   Account #: XXXX3184 $2.04 at CORNER STORE 2642        HOUSTON      US\non 08/29/2018, 11:40 AM ET exceeds the $0.00 transaction amount you've\nspecified.\n
  { bank: 'Citibank', regex: /\$(\d+.\d+) at ([\s\S]*)on[\s\S]*(\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5 },
  
  // Chase Credit
  // Example:
  //   This is an Alert to help you manage your credit card account ending in 0000.\n\nAs you requested, we are notifying you of any charges over the amount of\n($USD) 0.00, as specified in your Alert settings.\nA charge of ($USD) 7.84 at Subway Restaurant has been authorized on\n08/29/2018 4:04:23 PM EDT.\n\n  
  { bank: 'Chase Credit', regex: /charge of.*(\d+.\d+) at ([\s\S]*) has been authorized on[\s\S]*(\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5 },
  
  // Chase Debit
  // Example:
  //   This is an Alert to help manage your account ending in 9624.\n\nA $0.75 debit card transaction to SUBWAY RESTAURANT    on 08/29/2018 4:05:01 PM EDT exceeded your $0.00 set Alert limit.
  { bank: 'Chase Debit', regex: /.*(\d+.\d+) debit card transaction to ([\s\S]*) on (\d{2})\/(\d{2})\/(\d{4})/, amount_group: 1, payee_group: 2, month_group: 3, day_group: 4, year_group: 5 },
];

function parse(msg){
  let result = null;
  // Try each parser until we're able to parse the message
  for(let parser of parsers){
    const {bank, regex, amount_group, payee_group, month_group, day_group, year_group} = parser;
    
    const matches = msg.match(regex);
    if (matches == null){
      return null;
    }

    console.log(`Parsed as ${bank} message`);
    const amount = matches[amount_group];
    const payee = matches[payee_group];
    const date = `${matches[year_group]}-${matches[month_group].padStart(2, "0")}-${matches[day_group].padStart(2, "0")}`;
    
    result = { date, payee, amount }; 
    break;
    
  }
  return result;
}

module.exports.parse = parse;