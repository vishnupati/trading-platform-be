const { UserRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class UserService {

    constructor() {
        this.repository = new UserRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;
        
        const existingUser = await this.repository.FindUser({ email});

        if(existingUser){  
            const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if(validPassword){
                const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id});
                return FormateData({id: existingUser._id, token, success: true});
            }
        }

        return FormateData({message: 'Invalid user credentials', success: false});
    }

    async register(userInputs) {
        
        const { email, password,kycStatus, kycDocuments } = userInputs;
        
        let salt = await GenerateSalt();
        
        let userPassword = await GeneratePassword(password, salt);
        
        const existingUser = await this.repository.CreateUser({ email, password: userPassword, kycStatus, kycDocuments, salt});
        
        const token = await GenerateSignature({ email: email, _id: existingUser._id});
        return FormateData({id: existingUser._id, token, success: true });

    }
    async KYCVerify(userInputs) {
        
        const {userId, kyc } = userInputs;
        
        const existingUser = await this.repository.verifyUsrKYC({userId, kyc});
        
        return FormateData({id: existingUser._id, message: 'KYC document uploaded successfully' });

    }

}

module.exports = UserService;
