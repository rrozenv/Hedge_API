export default (err: any, req: any, res: any, next: any) => {
    console.log(err);
    res.status(500).send('Something failed.');
}