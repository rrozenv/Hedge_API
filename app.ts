import express from 'express';
import config from 'config';
import debug from 'debug';
import { helloFunc, secondFunc } from './routes/stocks';
import stocks from './routes/stocks';

const log = debug('startup');
const app = express();

app.use(express.json({}));
app.use('/api/stocks', stocks);

if (app.get('env') === 'development') { 
  log('Debugger On...')
} else { 
  log('Debugger Off...')
}

console.log(config.get('name'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));