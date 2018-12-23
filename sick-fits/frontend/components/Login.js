import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event, login) => {
    event.preventDefault()
    const user = await login()
  }

  render() {
    const { email, name, password } = this.state;
    return (
      <Mutation
        mutation={LOGIN_MUTATION}
        variables={this.state}
        refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
        >
        {(login, { error, loading }) => (
          <Form method="post" onSubmit={(e) => this.handleSubmit(e, login)}>
            <fieldset aria-busy={loading} disabled={loading}>
              <h2>Login to your account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input type="text" name="email" placeholder="email" value={email} onChange={this.saveToState}/>
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" placeholder="password" value={password} onChange={this.saveToState}/>
              </label>
            </fieldset>
            <button>Login</button>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default Login;
