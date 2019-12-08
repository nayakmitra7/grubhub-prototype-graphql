
import { gql } from 'apollo-boost';

const loginBuyerMutation = gql`
    mutation LoginBuyer($email: String!, $password: String!){
        login(email: $email, password: $password){
            status
            msg
        }
    }
`;
const loginOwnerMutation = gql`
    mutation LoginOwner($email: String!, $password: String!){
        loginOwner(email: $email, password: $password){
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

const updateRestaurantMutation = gql`
    mutation UpdateRestaurant($restaurantName: String!, $restaurantCuisine: String!, $restaurantAddress: String!, $restaurantZipCode: Int!, $restaurantId: Int!){
        updateRestaurant(restaurantName: $restaurantName, restaurantCuisine: $restaurantCuisine, restaurantAddress: $restaurantAddress, restaurantZipCode: $restaurantZipCode,restaurantId: $restaurantId){
            status
            msg
        }
    }
`;
const updateOwnerMutation = gql`
    mutation UpdateOwner($firstName: String!, $lastName: String!, $phone: String!, $email: String!, $ownerId: Int!){
        updateOwner(firstName: $firstName, lastName: $lastName, phone: $phone, email: $email,ownerId: $ownerId){
            status
            msg
        }
    }
`;
const addSectionMutation = gql`
    mutation AddSection($sectionName: String!, $sectionDesc: String!, $restaurantId: Int!){
        addSection(sectionName: $sectionName, sectionDesc: $sectionDesc, restaurantId: $restaurantId){
            status
            msg
        }
    }
`;
const addItemMutation = gql`
    mutation AddItem($ItemName: String!, $ItemDesc: String!, $ItemPrice: Float!, $SectionId: Int!, $restaurantId: Int!){
        addItem(ItemName: $ItemName, ItemDesc: $ItemDesc, ItemPrice: $ItemPrice,SectionId: $SectionId,restaurantId: $restaurantId){
            status
            msg
        }
    }
`;

export {addItemMutation,addSectionMutation,loginBuyerMutation,updateBuyerMutation,signupBuyerMutation,loginOwnerMutation,updateRestaurantMutation,updateOwnerMutation};