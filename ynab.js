const ynab = require("ynab");

module.exports = class {
  constructor(access_token, budget_id){
    this.access_token = access_token;
    this.budget_id = budget_id;
    this.ynabAPI = new ynab.API(access_token);
  }
  
  async create_transaction(account_id, date, amount, payee, memo) {  
    
    const milliunits_amount = amount.replace(/(\.|\,)/g,'').toString() + "0";
    if (!account_id){
      const default_account = await this.get_first_account();      
      console.log(`Defaulting to '${default_account.name}' account`);
      account_id = default_account.id;
    }
    
    const transaction = {
      account_id: account_id,
      category_id: null,
      payee_name: payee,
      cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
      approved: true,
      date: (date || ynab.utils.getCurrentDateInISOFormat()),
      amount: milliunits_amount,
      memo: memo
    };
  
    await this.ynabAPI.transactions.createTransaction(this.budget_id, { transaction });
  }
  
  async get_first_account(budget_id) {
    if (!this.first_account) {
      const response = await this.ynabAPI.accounts.getAccounts(this.budget_id);
      this.first_account = response.data.accounts[0];
    }    
    
    return this.first_account;
  }
};