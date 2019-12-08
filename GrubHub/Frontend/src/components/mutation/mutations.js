
import { gql } from 'apollo-boost';

const loginBuyerMutation = gql`
    mutation LoginBuyer($email: String!, $password: String!){
        login(email: $email, password: $password){
            status
            msg
        }
    }
`;
const updateBuyerMutation = gql`
    mutation UpdateBuyer($firstName: String!, $lastName: String!, $phone: String!, $email: String!, $ID: Int!,$address: String!){
        update(firstName: $firstName, lastName: $lastName, phone: $phone, email: $email,ID: $ID,address:$address){
            status
            msg
        }
    }
`;
const signupBuyerMutation = gql`
    mutation SignupBuyer($firstName: String!, $lastName: String!, $email: String!, $password: String!,$address: String!){
        signup(firstName: $firstName, lastName: $lastName, password: $password, email: $email,address:$address){
            status
            msg
        }
    }
`;
export {loginBuyerMutation,updateBuyerMutation,signupBuyerMutation};