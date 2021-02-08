import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Row,
  Button,
} from "reactstrap";
import { Control, Form } from "react-redux-form";
import { Link } from "react-router-dom";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";

function RenderMenuItem({ dish, onClick }) {
  return (
    <Card>
      <Link to={`/menu/${dish._id}`}>
        <CardImg width="100%" src={dish.recipe.image} alt={dish.recipe.label} />
        <CardImgOverlay>
          <CardTitle className="card-text">{dish.recipe.label}</CardTitle>
        </CardImgOverlay>
      </Link>
    </Card>
  );
}

function RenderMenu({ dishes }) {
  const menu = dishes.map((dish) => {
    return (
      <div key={dish._id} className="col-12 col-md-3 mb-2">
        <RenderMenuItem dish={dish} />
      </div>
    );
  });

  return menu;
}

function RenderPromotions({ promotions }) {
  const menu = promotions.map((dish) => {
    return (
      <div key={dish._id} className="col-12 col-md-3 mb-2">
        <Card>
          <Link to={`/menu/${dish._id}`}>
            <CardImg width="100%" src={dish.image} alt={dish.label} />
            <CardImgOverlay>
              <CardTitle className="card-text">{dish.label}</CardTitle>
            </CardImgOverlay>
          </Link>
        </Card>
      </div>
    );
  });

  return menu;
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.fetchDishes(values.foodSearch);
    console.log("Current State is: " + JSON.stringify(values));
  }

  render() {
    const Promotions = () => {
      if (this.props.promos.isLoading) {
        return (
          <div className="container">
            <div className="row">
              <Loading />
            </div>
          </div>
        );
      } else if (this.props.promos.errMess) {
        return (
          <div className="container">
            <div className="row">
              <h4>{this.props.dishes.errMess}</h4>
            </div>
          </div>
        );
      } else
        return (
          <div className="container">
            <div className="row">
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/home">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Menu</BreadcrumbItem>
              </Breadcrumb>
              <div className="col-12">
                <h2>Daily Promotions For Working Out</h2>
                <hr className="divider" />
              </div>
            </div>
            <div className="row">
              <RenderPromotions promotions={this.props.promos.promotions} />
            </div>
          </div>
        );
    };

    return (
      <div className="container">
        <Form
          model="foodSearch"
          onSubmit={(values) => this.handleSubmit(values)}
        >
          <Row className="form-group">
            <Col md={9} className="mt-2">
              <Control.text
                model=".foodSearch"
                id="foodSearch"
                name="foodSearch"
                placeholder="Search For Food"
                className="form-control "
              />
            </Col>

            <Col md={{ size: 2 }} className="mt-2">
              <Button type="submit" color="primary">
                Search
              </Button>
            </Col>

            <Col md={{ size: 1 }} className="mt-2">
              <Link className="nav-link fav" to="/favorites">
                <div className="fa fa-heart fa-lg"></div>
              </Link>
            </Col>
          </Row>
        </Form>

        <div className="row">
          <RenderMenu dishes={this.props.dishes.dishes} />
        </div>

        <Promotions />
      </div>
    );
  }
}

export default Menu;
