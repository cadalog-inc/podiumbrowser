import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { NavBar } from './components/navbar';
import { HomePage } from './components/homepage';

import { Container, Col, Row } from 'react-bootstrap';



const TestGalleryElement = () => {
  return (<React.Fragment>
            <div className="grayborder" style={{ marginLeft: "5px", marginRight: "5px", marginBottom: "25px", height: 220, width: 180 }}>
              {/* <img style={{ width: 175, height: 150 }} /> */}
              <p> 4 MB</p>
              <p> Description</p>
              <p> In/Category/Subcategory</p>
            </div>
          </React.Fragment>
  )
};








class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        title: "",
        categories: []
      },
      items: [],
      selectedCategory: "",
      searchTerm: "",
      indexStart: 0,
      indexLimit: 100
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getItems();
  }

  render() {
    const items = this.state.items.filter((item) => {
      const isInTags = this.state.searchTerm === "" || this.searchArray(item.tags, (this.state.searchTerm));
      const isInCategoryTitle = item.category_title.includes(this.state.selectedCategory);
      return isInTags && isInCategoryTitle;
    });

    // are there any categories in this category?

    // todo: only search on press enter
    return (
      <div className="App">
        <BrowserRouter>

            <Link to="/test01">Test 01</Link>
            <Link to="/test02">Test 02</Link>
            <Link to="/">Home</Link>

            <Route exact path='/test01' render={
              (props) => {
                return (
                  <React.Fragment style={{flexGrow : 1, width: "95%"}}>
                    <Container fluid={true}>
                      <Row>
                        <Col style={{height: 80}} className="float-left grayborder">1 of 2</Col>
                        <Col style={{height: 80}} className="float-left grayborder">2 of 2</Col>
                      </Row>
                      <Row>
                        <Col className="float-left grayborder">1 of 3</Col>
                        <Col className="float-left grayborder">2 of 3</Col>
                        <Col className="float-left grayborder">3 of 3</Col>
                      </Row>
                      <Row>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                        <Col style={{height: 224}} className="float-left grayborder"><TestGalleryElement/></Col>
                      </Row>
                    </Container>

                  </React.Fragment>
                )
              }
            } />


            <Route exact path='/test02' render={
              (props) => {
                return (
                  <React.Fragment>
                    <h3>Category Name</h3>
                    <table striped bordered hover variant="dark">
                      <thead>
                        <tr>
                          <th colSpan="9"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                          <td><TestGalleryElement/></td>
                        </tr>
                      </tbody>
                    </table>
                  </React.Fragment>
                )
              }
            } />


            <Route exact path="/" render={
              (props) => {
                return (
                  <React.Fragment>
                    <NavBar
                      handleCategoryChange={this.handleCategoryChange}
                      handleKeySearchChange={this.handleKeySearchChange}
                      categories={this.state.categories}
                      {...props}
                    />
                    <HomePage
                      categories={this.state.categories}
                      items={items}
                      {...props}
                    />
                  </React.Fragment>
                )
              }
            } />
        </BrowserRouter>
      </div>
    );
  }

  handleCategoryChange = (event) => {
    const value = event.target.value;

    this.setState({
      selectedCategory: value
    });
  }

  handleKeySearchChange = (event) => {
    const value = event.target.value;

    this.setState({
      searchTerm: value
    });
  }

  getCategories() {
    axios.get('categories.json')
      .then((response) => {
        this.setState({
          categories: response.data.categories
        }, () => {
          console.log(this.state.categories.categories.length);
        });
      });
  }

  getItems() {
    axios.get('items.json')
      .then((response) => {
        this.setState({
          items: response.data.data, browserDatabaseArray: response.data.data
        }, () => {
          // console.log(this.state.items);
        });
      });
  }

  searchArray = (items, value) => {
    const l = items.length;
    for (let i = 0; i < l; i++) {
      const item = items[i];
      if (item.includes(value)) {
        return true;
      }
    }
    return false;
  }
}

export default App;
