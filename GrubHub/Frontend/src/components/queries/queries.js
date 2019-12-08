import { gql } from 'apollo-boost';

const getBuyer = gql`
query GetBuyer($userId: String!){
    buyer (id: $userId)
    {
      buyerID
      buyerFirstName
      buyerLastName
      buyerEmail
      buyerPhone
      buyerAddress
    }
  }
  
`;

const getBooksQuery = gql`
    {
        books {
            name
            id
        }
    }
`;

export { getBuyer, getBooksQuery };