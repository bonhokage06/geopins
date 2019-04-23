import gql from "graphql-tag";
export const CREATE_PIN_MUTATION = gql`
  mutation(
    $title: String!
    $image: String!
    $content: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    createPin(
      input: {
        title: $title
        image: $image
        content: $content
        latitude: $latitude
        longitude: $longitude
      }
    ) {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`;
export const DELETE_PIN_MUTATION = gql`
  mutation($id: ID!) {
    deletePin(pinId: $id) {
      _id
    }
  }
`;
export const CREATE_COMMENT_MUTATION = gql`
  mutation($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text) {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`;
