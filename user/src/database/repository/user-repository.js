const mongoose = require('mongoose');
const UserModel = require('../models/User'); 

//Dealing with data base operations
class UserRepository {

    async CreateUser({ email, password, kycStatus, kycDocuments, salt }) {
        console.log("In user repository", UserModel);

        try {

            // Check if user exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return { message: 'User already exists' };
            }

            // Create new user
            const user = new UserModel({ email, password, kycStatus, kycDocuments, salt });
            await user.save();
            return user;

        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
    
    async FindUser({ email }){
        const existingCustomer = await UserModel.findOne({ email: email });
        return existingCustomer;
    }

    async verifyUsrKYC({ userId, kyc }) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.kyc = kyc;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error updating KYC information');
        }
    }

}

module.exports = UserRepository;
