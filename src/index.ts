import express, { Express, Request, Response, Router } from 'express';
import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import wallet from './../wallet.json';

const app: Express = express();
const route: Router = Router();
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    logging: false,
});

app.use(express.json());

route.post('/:data', (req: Request, res: Response) => {
    const data = req.params.data;
    var tx: Transaction;
    
    arweave.createTransaction({ data: data }, wallet)
    .then((transaction) => {
        tx = transaction;
        return arweave.transactions.sign(transaction, wallet);
    })
    .then(() => {
        arweave.transactions.post(tx);
        res.send(tx.id);
    })
    .catch((error) => {
        console.log(error.message);
        res.status(500).send(error.message);
    });
});

route.get('/:txid', (req: Request, res: Response) => {
    const txid = req.params.txid;
    arweave.transactions.get(txid)
    .then((transaction) => {
        res.send(transaction);
    })
    .catch((error) => {
        console.log(error.message);
        res.status(500).send(error.message);
    });
});

app.use(route);


app.listen(3000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
