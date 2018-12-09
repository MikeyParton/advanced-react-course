import React from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends React.Component {
  state = {
    title: '',
    description: '',
    price: 0,
    image: null,
    largeImage: null,
    loadingImage: false
  }

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

  uploadImage = async (event) => {
    const files = event.target.files;
    await this.asyncSetState({ loadingImage: true })
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits')
    const res = await fetch('https://api.cloudinary.com/v1_1/dqcj6447g/image/upload', {
      method: 'POST',
      body: data
    })
    const file = await res.json()
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
      loadingImage: false
    })
  }

  render() {
    const { loadingImage, ...variables } = this.state;
    const { title, description, image, price } = variables;

    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={variables}>
        {( createItem, { loading, error }) => {
          const handleSubmit = async (event) => {
            event.preventDefault();
            const response = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: response.data.createItem.id }
            })
          };

          return (
            <Form onSubmit={handleSubmit}>
              <h2>Sell an Item</h2>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="title"
                    value={title}
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
                    value={price}
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
                    value={description}
                    onChange={this.handleChange}
                    required
                  />
                </label>
                <label htmlFor="file">
                  Image
                  <input
                    name="file"
                    id="file"
                    type="file"
                    placeholder="Upload an image"
                    onChange={this.uploadImage}
                  />
                  {loadingImage && <p>Uploading ...</p>}
                  {image && !loadingImage && <img width="200" src={image} alt="Upload preview" />}
                </label>
              </fieldset>
              <button>Sumbit</button>
            </Form>
          )
        }}
      </Mutation>
    )
  }
};

export default CreateItem;
