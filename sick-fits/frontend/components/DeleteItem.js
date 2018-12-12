import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class Delete extends React.Component {
  update = (cache, payload) => {
    debugger
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter((item) => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }

  confirm = (deleteItemMutation) => {
    if (confirm('Are You sure you want to delete the item ?')) {
      deleteItemMutation()
    }
  }

  render() {
    const { id, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button onClick={() => this.confirm(deleteItem)}>
            {children}
          </button>
        )}
      </Mutation>
    )
  }
};

export default Delete;
