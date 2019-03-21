export default (err: any, req: any, res: any, next: any) => {
    res.status(500).send('Internal Server Error');
}