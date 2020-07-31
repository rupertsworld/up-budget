import 'babel-polyfill';
import { LitElement, html, css } from 'lit-element';

const base = 'https://api.up.com.au/api/v1';
const apikey = process.env.APIKEY;
const headers = { 'Authorization': apikey };


class App extends LitElement {
	static get properties() {
		return {
			accounts: { type: Object },
			transactions: { type: Object }
		};
	}

	constructor() {
		super();
		
		this.accounts = [];
		this.transactions = [];

		this.load();
	}

	async load() {
		await this.load_accounts();
		await this.load_transactions();
	}

	async load_accounts() {
		const req = await fetch(`${base}/accounts`, { headers });
		this.accounts = (await req.json()).data;
	}

	async load_transactions() {
		const req = await fetch(`${base}/transactions?page[size]=20`, { headers });
		this.transactions = (await req.json()).data;
	}

	render() {
		return html`
			<h1>UP BREAKDOWN</h1>
			<div class="container">
			<section>
			<h2>Accounts</h2>
			<table>
				<tr><th>ACCOUNT</th><th>BALANCE</th></tr>
	${ this.accounts.map(acc => html`<tr><td>${acc.attributes.displayName}</td><td>${acc.attributes.balance.value}</td></tr>`)}
			</table>
			</section>
			<section>
			<h2>Transactions</h2>
			<table>
				<tr><th>AMOUNT</th><th>NAME</th></tr>
	${ this.transactions.map(tr => html`<tr><td>${tr.attributes.amount.value}</td><td>${tr.attributes.description}</td></tr>`)}
			</table>
			</section>
			</div>
		`;
	}

	static get styles() {
		return css`
			:host {
				width: 800px;
				margin: 0 auto;
				padding-top: 30px;
			}
			.container {
				display: flex;
				justify-content: space-around;
			}
			section {
				border: 3px solid yellow;
				padding: 20px;
			}
			h1, h2 {
				text-align: center;
				color: pink;
			}
		`;
	}
}
customElements.define('my-app', App);