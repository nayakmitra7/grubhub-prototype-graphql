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
const searchRestaurantQuery = gql`
query SearchRestaurant($item: String!){
    restaurant (item: $item)
    {
      restaurantId
      restaurantName
      restaurantCuisine
      restaurantAddress
    }
  }
  
`;
const fetchItemQuery = gql`
query FetchItem($restaurantId: Int!){
    item (restaurantId: $restaurantId)
    {
      ItemId
      ItemName
      ItemDesc
      ItemPrice
      SectionId
    }
  }
  
`;
const fetchSectionQuery = gql`
query FetchSection($restaurantId: Int!){
    section (restaurantId: $restaurantId)
    {
      menuSectionId
      menuSectionName
      menuSectionDesc
      count
    }
  }
  
`;

export { getBuyer,searchRestaurantQuery,fetchItemQuery,fetchSectionQuery };