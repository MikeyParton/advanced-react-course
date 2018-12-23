import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signUp(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: ''
  }

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event, signup) => {
    event.preventDefault()
    const user = await signup()
    console.log(user)
  }

  render() {
    const { email, name, password } = this.state;
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => (
          <Form method="post" onSubmit={(e) => this.handleSubmit(e, signup)}>
            <fieldset aria-busy={loading} disabled={loading}>
              <h2>Signup for an account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input type="text" name="email" placeholder="email" value={email} onChange={this.saveToState}/>
              </label>
              <label htmlFor="name">
                Email
                <input type="text" name="name" placeholder="name" value={name} onChange={this.saveToState}/>
              </label>
              <label htmlFor="password">
                Email
                <input type="password" name="password" placeholder="password" value={password} onChange={this.saveToState}/>
              </label>
            </fieldset>
            <button>Sign Up</button>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default Signup;
