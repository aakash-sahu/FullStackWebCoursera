import React, { Component } from 'react';
import { Card,CardImg, CardText,  CardBody, CardTitle, BreadcrumbItem, Breadcrumb, Button,
        Modal, ModalBody, ModalHeader, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Stagger, Fade } from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len) ;
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddCommentOpen: false
        };
        this.toggleAddCommentModal = this.toggleAddCommentModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleAddCommentModal() {
        this.setState({
            isAddCommentOpen: !this.state.isAddCommentOpen
        })
    };

    handleSubmit(values) {
        this.toggleAddCommentModal();
        // alert("Current state is: "+ JSON.stringify(values));
        this.props.postComment(this.props.dishId,values.rating, values.author, values.comment);
    };

    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleAddCommentModal}><span className="fa fa-pencil fa-lg"></span>{" "} 
                Submit Comment</Button>
                <Modal isOpen ={this.state.isAddCommentOpen} toggle={this.toggleAddCommentModal}>
                    <ModalHeader toggle={this.toggleAddCommentModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <LocalForm onSubmit={(values)=> this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text model=".author" id = "author" name="author"
                                     className = "form-control"
                                     placeholder="Your Name"
                                     validators = {{
                                         minLength: minLength(3), maxLength:maxLength(15)
                                     }} />
                                     <Errors
                                     className="text-danger"
                                     model=".author"
                                     show="touched"
                                     messages={{
                                         minLength: "Must be greater than 3 characters",
                                         maxLength: "Must be 15 characters or less"
                                     }} />
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea model=".comment" id = "comment" name="comment"
                                     className = "form-control" 
                                     rows="6"/>
                                </Row>
                                <Row className="form-group">
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                    <Button onClick={this.toggleAddCommentModal} color="primary" className="ml-1">Cancel</Button>
                                </Row>
                            </LocalForm>
                        </div>

                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

    
    function RenderDish({dish}){
        return (
            <FadeTransform in transformProps={{
                exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
                <Card>
                    <CardImg src={baseUrl + dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    }

    function RenderComments({comments, postComment, dishId}){
        const dishComments = <Stagger in>{ comments.map((comment)=> {
            
            return (
                <Fade in>
                    <ul className='list-unstyled m-1'>
                        <li key = {Comment.id}>{comment.comment}</li>
                        <li key = {Comment.id} className="mb-1 text-muted">-- {comment.author}, {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</li>
                    </ul>
                </Fade>
            )
        })
        }</Stagger>
        
        if (dishComments != null) {
            return (
                <div>
                    {dishComments}
                    <CommentForm dishId={dishId} postComment={postComment} />
                </div>
                );
        }
        else {
            return <div></div>
        }

    }

    const DishDetail = (props) => {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null){
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                    <div className="row">
                        <div className= "col-12 col-md-5 mt-1">
                            <RenderDish dish = {props.dish} />
                        </div>
                        <div className="col-12 col-md-5 mt-1">
                            <h4>Comments</h4>
                            <RenderComments comments = {props.comments} 
                            postComment={props.postComment}
                            dishId = {props.dish.id}  />
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return <div>wrongone</div>
        }
    }


export default DishDetail;