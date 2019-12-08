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
const getOwner = gql`
query GetOwner($userId: String!){
    Owner (id: $userId)
    {
    ownerId
    ownerEmail
    ownerPhone
    ownerLastName
    ownerFirstName
    restaurantId
    restaurantName
    }
  }
`;
const searchRestaurantQuery = gql`
query SearchRestaurant($item: String!){
    restaurants (item: $item)
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
const fetchRestaurantQuery = gql`
query FetchRestaurant($restaurantId: Int!){
    restaurant (id: $restaurantId)
    {
      restaurantName
      restaurantCuisine
      restaurantAddress
      restaurantZipCode
    }
  }
  
`;
export { getBuyer, getOwner, searchRestaurantQuery, fetchItemQuery, fetchSectionQuery ,fetchRestaurantQuery};