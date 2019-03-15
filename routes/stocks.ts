import express from 'express';
const router = express.Router({});

router.get('/', (req: any, res: any) => {
    res.send('Hello Stocks');
});

export const helloFunc = (): string => { return "HELLO"; }
export const secondFunc = (): string => { return "HELLO"; }
export default router