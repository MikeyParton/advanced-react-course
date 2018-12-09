import React from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
    }
  }
`;

class UpdateItem extends React.Component {
  state = {}

  asyncSetState = (args = {}) => {
    return new Promise((resolve, reject) => {
      this.setState(args, () => {
        resolve()
      })
    })
  }

  handleChange = (event) => {
    const { type, name, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleSubmit = async (event, updateItemMutatation) => {
    event.preventDefault();
    const response = await updateItemMutatation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  }

  render() {
    const { id } = this.props;
    const { loadingImage, ...variables } = this.state;
    const { title, description, image, price } = variables;

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading ....</p>
          if (error) return <p>Error {error.message}</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {( updateItem, { loading, error }) => {
                return (
                  <Form onSubmit={(event) => this.handleSubmit(event, updateItem)}>
                    <h2>Update Item</h2>
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      <label htmlFor="title">
                        Title
                        <input
                          type="text"
                          name="title"
                          id="title"
                          placeholder="title"
                          defaultValue={data.item.title}
                          onChange={this.handleChange}
                          required
                        />
                      </label>
                      <label htmlFor="price">
                        Price
                        <input
                          type="number"
                          name="price"
                          id="price"
                          placeholder="price"
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                          required
                        />
                      </label>
                      <label htmlFor="description">
                        Description
                        <textarea
                          name="description"
                          id="description"
                          placeholder="description"
                          defaultValue={data.item.description}
                          onChange={this.handleChange}
                          required
                        />
                      </label>
                    </fieldset>
                    <button>Sumbit</button>
                  </Form>
                )
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }
};

export default UpdateItem;
