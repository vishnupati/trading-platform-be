const UserService = require('../services/user-service');
const  UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    
    const service = new UserService();

    app.post('/api/register', async (req, res, next) => {
        const { email, password, kycStatus, kycDocuments } = req.body;
        console.log(req.body);
        const { data } = await service.register({ email, password, kycStatus, kycDocuments}); 
        res.json(data);

    });

    app.post('/api/login',  async (req, res, next) => {
        
        const { email, password } = req.body;

        const { data } = await service.SignIn({ email, password});

        res.json(data);

    });

    app.post('/api/kyc-verify', UserAuth, async (req, res, next) => {
         const { kyc } = req.body;
         const userId = req.user._id;

        const { data } = await service.KYCVerify({userId, kyc});

        res.json(data);

    });
}
