import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarText,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  FormText,
  Input,
  Label,
  NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ExploreGroups from '../ExploreGroups/ExploreGroups.jsx';
import LoginModal from '../Auth/LoginModal.jsx';
import axios from 'axios';
import logo from '../../../assets/townsquare.png';
import CreateEventModal from '../Events/CreateEventModal.jsx';
require ('jquery');
require('bootstrap');

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      input: {
        group_name: '',
        description: '',
        category: ''
      },
      options: ['', 'outdoors', 'music', 'cooking', 'animals', 'hobbies', 'religious'],
      validations: {
        group_name: false,
        description: false,
        category: false,
        zipcode: false
      },
      nameTaken: false,
      group: {
        group_id: 1,
        group_name: "JavaScript Meet Up",
        category: "religious",
      }
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  allValid() {
    let valid = true;
    for (let key in this.state.validations) {
      if (!this.state.validations[key]) {
        valid = false;
      }
    }
    return valid;
  }

  handleCreateGroup(e) {
    e.preventDefault();
    if (this.allValid()) {
      this.toggleModal();
      let data = this.state.input;
      data.owner_id = this.props.userID;
      data.zipcode = parseInt(data.zipcode);
      axios.post('/api/groups', data)
        .catch((err) => console.log(err))
        .then((res) => {
          this.setState({
            input: {
              group_name: '',
              description: '',
              category: ''
            },
            validations: {
              group_name: false,
              description: false,
              category: false
            },
            nameTaken: false
          })
        })

    }
  }

  checkGroupName(name) {
    axios.get('/api/groups/search', {params: {name: name, exact: true}})
      .then((result) => {
        let newValid = this.state.validations;
        newValid.group_name = result.data.length < 1;
        this.setState({
          nameTaken: result.data.length >= 1
        })
      })
  }

  handleChange(e) {
    let newInput = this.state.input;
    newInput[e.target.name] = e.target.value;

    let newValid = this.state.validations;
    if (e.target.value.length > 5 && e.target.name === 'group_name') {
      if (this.checkGroupName(e.target.value)) {
        newValid[e.target.name] = true;
      } else {
        newValid[e.target.name] = false;
      }
    } else if ((e.target.value.length < 5 && e.target.name === 'group_name')) {
      newValid[e.target.name] = false;
    }
    if (e.target.name === 'group_name') {
      this.checkGroupName(e.target.value)
    }
    if (e.target.value.length > 10 && e.target.name === 'description') {
      newValid[e.target.name] = true;
    } else if (e.target.value.length < 10 && e.target.name === 'description'){
      newValid[e.target.name] = false;
    }
    if (e.target.value !== '' && e.target.name === 'category') {
      newValid[e.target.name] = true;
    } else if (e.target.value === '' && e.target.name === 'category') {
      newValid[e.target.name] = false;
    }
    if (e.target.name === 'zipcode' && (e.target.value.length === 5 && !isNaN(Number(e.target.value)))) {
      newValid[e.target.name] = true;
    } else if (e.target.name === 'zipcode' && (e.target.value.length !== 5 || isNaN(Number(e.target.value)))){
      newValid[e.target.name] = false;
    }
    this.setState({
      input: newInput,
      validations: newValid
    });
  }

  render() {
    return (
      <div className='main-header'>
            <LoginModal toggleLogin={this.props.toggleLogin} isLoginOpen={this.props.isLoginOpen} />
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Create New Group</ModalHeader>
              <ModalBody>
                <Form onSubmit={this.handleCreateGroup}>
                  <FormGroup>
                    <Label for='group_name'>Group Name</Label>
                    <Input
                      type='text'
                      id='group_name'
                      name='group_name'
                      onChange={this.handleChange}
                      value={this.state.group_name}
                      valid={this.state.validations.group_name && !this.state.nameTaken ? true : false}
                      invalid={(this.state.nameTaken && !this.state.validations.group_name) ? 1 : undefined}
                      required
                    />
                    <FormText>e.g. Philly Phanatics</FormText>
                    <FormFeedback valid>Sweet! That name is available!</FormFeedback>
                    <FormFeedback invalid>That name is already taken.</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for='group-description'>Group Description</Label>
                    <Input
                      type='textarea'
                      id='group-description'
                      name='description'
                      onChange={this.handleChange}
                      value={this.state.description}
                      valid={this.state.validations.description}
                      required
                    />
                    <FormText>Please provide a description of your group.</FormText>
                    <FormFeedback valid>Great description!</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for='image_url'>Image url</Label>
                    <Input
                      type='text'
                      id='image_url'
                      name='image_url'
                      onChange={this.handleChange}
                    />
                    <FormText>Please provide a link to an image for your group.</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label for='zipcode'>Zipcode</Label>
                    <Input
                      type='text'
                      id='zipcode'
                      name='zipcode'
                      onChange={this.handleChange}
                      required
                    />
                    <FormText>Please provide a link to an image for your group.</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label for='modal-category'>Select Category</Label>
                      <Input
                      onChange={this.handleChange}
                      type='select'
                      name='category'
                      id='modal-category'
                      valid={this.state.validations.category}
                      >
                      {this.state.options.map((option, i) => {
                        return <option value={option} key={i}>{option}</option>
                      })}
                    </Input>
                    <FormText>Select a category for your group.</FormText>
                    <FormFeedback valid></FormFeedback>
                  </FormGroup>
                  <Button type='submit' value='submit' color='primary'>
                    Create Group
                  </Button>
                </Form>
              </ModalBody>
            </Modal>
          <nav className="navbar navbar-expand-md navbar-light bg" style={{backgroundColor: '#6c757d'}}>
              <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item ">
                      <Link to='/allgroups'>
                        <Button
                          eventKey="1"
                          color='secondary'
                          size='small'
                          style={{ marginTop: '16px'}}
                          >
                          Browse All Groups
                        </Button>
                      </Link>
                    </li>
                    <li className="nav-item">
                      {this.props.loggedIn?
                        <Button
                          color='secondary'
                          size='small'
                          onClick={this.toggleModal}
                          style={{marginTop: '16px', marginLeft: '10px'}}
                          className='createGroupBtn'
                        >
                          Create New Group
                        </Button>:
                        <div></div>
                      }
                    </li>
                </ul>
              </div>
              <div className="mx-auto order-0">
                <Link to='/'>
                  <div className="navbar-brand mx-auto"  style={{ color: '#fff', fontSize: '2.2em', margin: 'auto'}} > <img height="45px" id='logo' src={logo} alt='TownSquare Logo'/> TownSquare</div>
                </Link>
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                      <span className="navbar-toggler-icon"></span>
                  </button>
              </div>
              <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    {
                      this.props.loggedIn?
                      <Button
                      color='secondary'
                      size='small'
                      style={{marginLeft: '10px', marginTop: '16px'}}
                      onClick={this.props.handleLogout}
                      className='loginBtn'
                    >
                      Log Out
                    </Button> :
                      <Button
                        color='secondary'
                        size='small'
                        style={{marginLeft: '10px', marginTop: '16px'}}
                        onClick={this.props.toggleLogin}
                        className='loginBtn'
                      >
                        Log In
                      </Button>
                    }
                  </li>
                  <li className="nav-item">
                  {
                    this.props.loggedIn?
                    <Button
                    outline
                    color='secondary'
                    size='small'
                    style={{ backgroundColor: '#fff', marginLeft: '10px', marginTop: '16px'}}
                    className='signupBtn'
                    >
                  {this.props.currentUser.first_name}&nbsp;{this.props.currentUser.last_name}
                  </Button> :
                    <Link to='/signup'>
                    <Button
                      color='secondary'
                      size='small'
                      style={{marginLeft: '10px', marginTop: '16px'}}
                      className='signupBtn'
                    >
                      Sign Up
                    </Button>
                    </Link>
                  }
                </li>
                <li className='nav-item'>
                <Link to='/'>
                  <i style={{color: '#fff', marginLeft: '10px', marginTop: '8px'}} className='fas fa-home fa-3x'></i>
                </Link>
                </li>
              </ul>
            </div>
          </nav>
      </div>
    );
  }
}

export default Header;

